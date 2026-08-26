# -*- coding: utf-8 -*-
"""Generate AZ/index.html from the Russian index.html one directory up.

The Azerbaijani site is the same design, same CSS, same JS. Only the copy and
the structured data differ. Generating instead of forking means a fix to the
Russian page's markup reaches the Azerbaijani one by re-running this script.

Anything wrapped in {{ }} is a fact nobody has given us yet. Do not guess these.
Run:  python AZ/build-az.py   (from the repo root)
"""
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "index.html")
DST = os.path.join(ROOT, "AZ", "index.html")

# ---------------------------------------------------------------- copy map
# Left: exact Russian string in the source. Right: Azerbaijani.
# NEEDS NATIVE PROOFREAD. Written by Claude, not a native speaker.
COPY = [
    # --- nav ---
    ("Услуги", "Xidmətlər"),
    ("Галерея", "Qalereya"),
    ("Локации", "Ünvanlar"),
    ("Контакты", "Əlaqə"),
    ("Записаться", "Onlayn yazıl"),

    # --- hero ---
    ("Точность в каждом движении", "Hər hərəkətdə dəqiqlik"),
    ("Листай", "Sürüşdür"),

    # --- services ---
    ("УСЛУГИ", "XİDMƏTLƏR"),
    ("Хорошая стрижка говорит за тебя", "Yaxşı saç düzümü sənin əvəzinə danışır"),
    ("Только по записи. Приходишь к своему времени",
     "Yalnız qeydiyyatla. Öz vaxtına gəlirsən"),
    ("Первая стрижка", "İlk saç düzümü"),
    ("Знакомство с ЛЕЗВИЕ. Консультация, стрижка и укладка премиум-средствами. Специальная цена для первого визита",
     "LEZVIE ilə tanışlıq. Məsləhət, saç düzümü və premium vasitələrlə forma. İlk gəliş üçün xüsusi qiymət"),
    ("Стрижка + борода", "Saç + saqqal"),
    ("Полный комплекс: стрижка, моделирование бороды, контуринг опасной бритвой. Горячее полотенце в подарок",
     "Tam kompleks: saç düzümü, saqqal modelləşdirmə, ülgüclə kontur. Hədiyyə olaraq isti dəsmal"),
    ("Отец + сын", "Ata + oğul"),
    ("Две стрижки по цене комплекса. Приходи с сыном и уходите вдвоём с новыми стрижками",
     "Kompleks qiymətinə iki saç düzümü. Oğlunla gəl, ikiniz də yeni saç düzümü ilə çıxın"),
    ("День рождения", "Ad günü"),
    ("Скидка на все услуги в день рождения. Покажи паспорт, и всё",
     "Ad günündə bütün xidmətlərə endirim. Şəxsiyyət vəsiqəni göstər, vəssalam"),

    # --- barbers ---
    ("КОМАНДА", "KOMANDA"),
    ("Наши мастера", "Bizim ustalar"),
    ("Барбершоп, как он должен быть", "Barbershop, necə olmalıdırsa"),
    ("Команда", "Komanda"),

    # --- reviews ---
    ("Нам верят на слово. И проверяют", "Sözümüzə inanırlar. Və yoxlayırlar"),
    ("Читать все отзывы на 2ГИС", "Bütün rəyləri oxu"),

    # --- sections ---
    ("ГАЛЕРЕЯ", "QALEREYA"),
    ("ЛОКАЦИИ", "ÜNVANLAR"),
    ("С 10:00 до 21:00, ежедневно", "Hər gün 10:00 - 21:00"),

    # --- cta / footer ---
    ("ТВОЙ ХОД", "SƏNİN NÖVBƏN"),
    ("Выбери удобный способ связи", "Rahat əlaqə üsulunu seç"),
    ("ЗАПИСАТЬСЯ", "YAZIL"),
    ("Стрижка, к которой возвращаются", "Geri qayıtdığın saç düzümü"),

    # --- alt text ---
    ("Рашад, владелец и барбер ЛЕЗВИЕ", "Rəşad, LEZVIE-nin sahibi və barberi"),
    ("Эльмин, барбер ЛЕЗВИЕ", "Elmin, LEZVIE barberi"),
    ("Мустафа, барбер ЛЕЗВИЕ", "Mustafa, LEZVIE barberi"),
    ("Барберы ЛЕЗВИЕ на Барышникова 27", "LEZVIE barberləri"),
    ("Фото галереи", "Qalereya şəkli"),
    # --- aria labels, logo, staff, socials ---
    ("ВКонтакте", "Facebook"),
    ("Закрыть", "Bağla"),
    ("Открыть меню", "Menyunu aç"),
    ("Предыдущее фото", "Əvvəlki şəkil"),
    ("Следующее фото", "Növbəti şəkil"),
    ("Предыдущий отзыв", "Əvvəlki rəy"),
    ("Следующий отзыв", "Növbəti rəy"),
    ("Просмотр фото", "Şəklə bax"),
    # branch names and the copyright line must be replaced BEFORE the generic
    # LEZVIE rule below, otherwise they stop matching
    ("ЛЕЗВИЕ на Барышникова", "{{FILIAL_1}}"),
    ("ЛЕЗВИЕ на Пушкинской", "{{FILIAL_2}}"),
    ("ЛЕЗВИЕ на Красноармейской", "{{FILIAL_3}}"),
    ("&copy; 2026 ЛЕЗВИЕ. Ижевск", "&copy; 2026 LEZVIE. {{SEHER}}"),
    (">ЛЕЗВИЕ<", ">LEZVIE<"),
    ("ЛЕЗВИЕ", "LEZVIE"),
]

# Staff of the Azerbaijani shop is not known. Do not reuse the Izhevsk barbers.
STAFF = [
    ("Рашад", "{{USTA_1}}"),
    ("Эльмин", "{{USTA_2}}"),
    ("Мустафа", "{{USTA_3}}"),
    ("Rəşad, LEZVIE-nin sahibi və barberi", "{{USTA_1}}, LEZVIE barberi"),
    ("Elmin, LEZVIE barberi", "{{USTA_2}}, LEZVIE barberi"),
    ("Mustafa, LEZVIE barberi", "{{USTA_3}}, LEZVIE barberi"),
    ("Ижевск", "{{SEHER}}"),
    ("https://vk.com/lezvie_barbershop", "{{FACEBOOK_URL}}"),
    ("https://www.instagram.com/lezvie_barbershop.izhevsk/", "{{INSTAGRAM_URL}}"),
    ("https://dikidi.net/g313100?p=0.sp", "{{QEYDIYYAT_LINKI}}"),
    ("https://2gis.ru/izhevsk/firm/70000001038561940/tab/reviews", "{{REYLER_LINKI}}"),
]

# Facts we do not have. Left as visible placeholders on purpose.
PLACEHOLDERS = [
    ("ул. Барышникова 27", "{{UNVAN_1}}"),
    ("ул. Пушкинская 270", "{{UNVAN_2}}"),
    ("ул. Красноармейская 164", "{{UNVAN_3}}"),
    ("+7-912-757-48-48", "{{TELEFON_1}}"),
    ("+7-912-026-10-10", "{{TELEFON_2}}"),
    ("2ГИС · 4.9 ★ · 360+ ОТЗЫВОВ", "{{REYTINQ_SETIRI}}"),
    ("1000₽", "{{QIYMET_1}}"),
    ("1800₽", "{{QIYMET_2}}"),
]


def build():
    s = io.open(SRC, encoding="utf-8").read()

    # 1. language
    s = s.replace('<html lang="ru">', '<html lang="az">', 1)

    # 2. head: title, meta, canonical, OG
    s = re.sub(
        r"<title>.*?</title>",
        "<title>LEZVIE · {{SEHER}} barbershop</title>",
        s, count=1, flags=re.S,
    )
    s = s.replace(
        "Барбершоп ЛЕЗВИЕ в Ижевске. Три студии, ежедневно с 10:00 до 21:00. Стрижка, борода, бритьё опасной бритвой. Запись онлайн.",
        "LEZVIE barbershop {{SEHER}}. Hər gün 10:00 - 21:00. Saç düzümü, saqqal, ülgüclə təraş. Onlayn qeydiyyat.",
    )
    s = s.replace(
        "Три студии в Ижевске. Стрижка, борода, бритьё опасной бритвой. Ежедневно с 10:00 до 21:00.",
        "{{SEHER}}. Saç düzümü, saqqal, ülgüclə təraş. Hər gün 10:00 - 21:00.",
    )
    s = s.replace("ЛЕЗВИЕ · Барбершоп в Ижевске", "LEZVIE · {{SEHER}} barbershop")
    s = s.replace("https://lezviebarbershop.ru", "https://{{DOMAIN}}")
    s = s.replace('content="ru_RU"', 'content="az_AZ"')

    # 3. structured data: rebuild rather than translate, so no RU facts leak in
    s = re.sub(
        r'<script type="application/ld\+json">\n.*?\n  </script>',
        '<script type="application/ld+json">\n' + schema() + "\n  </script>",
        s, count=1, flags=re.S,
    )

    # 4. Yandex block is wrong market. Azerbaijan is Google-first.
    s = re.sub(
        r"  <!-- =+\n       STAGED FOR LAUNCH DAY.*?=+ -->\n",
        google_staged(),
        s, count=1, flags=re.S,
    )

    # 5. copy + placeholders
    missed = []
    for old, new in COPY + STAFF + PLACEHOLDERS:
        if old in s:
            s = s.replace(old, new)
        else:
            missed.append(old)

    # 6. reviews data source: the AZ shop has its own reviews
    s = s.replace('src="js/reviews.js"', 'src="js/reviews.az.js"')

    io.open(DST, "w", encoding="utf-8", newline="").write(s)
    print("wrote", DST)
    if missed:
        print("\n!! %d strings not found in source (RU page changed?):" % len(missed))
        for m in missed:
            print("   ", m[:70])
    left = re.findall(r"[А-Яа-яЁё]{3,}", re.sub(r"<!--.*?-->", "", s, flags=re.S))
    if left:
        print("\n!! Cyrillic left in visible markup, check these:", sorted(set(left))[:15])


def schema():
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://{{DOMAIN}}/#organization",
                "name": "LEZVIE",
                "url": "https://{{DOMAIN}}/",
                "telephone": ["{{TELEFON_1}}"],
                "sameAs": ["{{INSTAGRAM_URL}}"],
                "areaServed": {"@type": "City", "name": "{{SEHER}}"},
            },
            {
                "@type": "WebSite",
                "@id": "https://{{DOMAIN}}/#website",
                "url": "https://{{DOMAIN}}/",
                "name": "LEZVIE",
                "inLanguage": "az-AZ",
                "publisher": {"@id": "https://{{DOMAIN}}/#organization"},
            },
            {
                "@type": "HairSalon",
                "@id": "https://{{DOMAIN}}/#salon-1",
                "name": "{{FILIAL_1}}",
                "parentOrganization": {"@id": "https://{{DOMAIN}}/#organization"},
                "url": "https://{{DOMAIN}}/",
                "telephone": ["{{TELEFON_1}}"],
                "priceRange": "{{QIYMET_ARALIGI}}",
                "currenciesAccepted": "AZN",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "{{UNVAN_1}}",
                    "addressLocality": "{{SEHER}}",
                    "addressCountry": "AZ",
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "{{LAT_1}}",
                    "longitude": "{{LON_1}}",
                },
                "openingHoursSpecification": [{
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday",
                                  "Friday", "Saturday", "Sunday"],
                    "opens": "10:00",
                    "closes": "21:00",
                }],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False, indent=2)


def google_staged():
    return '''  <!-- ============================================================
       STAGED FOR LAUNCH DAY. Uncomment, paste the real id, redeploy.

       Azerbaijan is a Google market, not a Yandex one. The Russian site's
       Yandex Webmaster and Metrika block does not belong here. Use Google
       Search Console plus GA4. Yandex Webmaster is optional and second.

       1) Google Search Console ownership check, from search.google.com.
       <meta name="google-site-verification" content="PASTE_CODE_HERE">

       2) GA4. Replace G-XXXXXXXXXX in both lines.
       <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
       <script>
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXXX');
       </script>
       ============================================================ -->

'''


if __name__ == "__main__":
    build()

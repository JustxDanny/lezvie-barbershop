# LEZVIE AZ — Azerbaijani version

Groundwork for the Azerbaijani site Rashad asked for. Nothing here is live yet.
The page is generated, not hand-written: run `python AZ/build-az.py` from the repo
root and it rebuilds `AZ/index.html` from the Russian `index.html`, swapping copy
and structured data. A markup fix on the Russian page reaches this one by
re-running the script, so the two never drift apart.

## Status

| Piece | State |
|---|---|
| Page markup, CSS, JS | done, shared with the RU site |
| Azerbaijani copy | drafted, **needs a native proofread** |
| Structured data | rebuilt for AZ, placeholders inside |
| Google Search Console + GA4 | staged as comments in `<head>` |
| Real facts (address, phone, prices, staff) | **missing, see below** |
| Domain, hosting | not decided |
| Photos | not received |

## What is missing, and nobody should guess it

Every `{{PLACEHOLDER}}` in `AZ/index.html` is a fact we do not have. Search the
file for `{{` to see them all. The list to put to Rashad:

1. **City.** `{{SEHER}}`. Baku, Ganja, somewhere else?
2. **How many shops**, and the address of each. The template carries three
   because Izhevsk has three. Cut or add branches to match reality.
3. **Phone numbers**, in `+994...` format, and which number belongs to which shop.
4. **Prices in AZN.** The Russian page shows 1000₽ and 1800₽. A straight currency
   conversion will be wrong; Azerbaijani prices are set by the local market.
5. **Barber names and photos** for the AZ shop. Do not reuse Rashad, Elmin and
   Mustafa unless those same people actually work there.
6. **Booking link.** Dikidi is a Russian service. Azerbaijan usually runs on
   WhatsApp or Instagram DM. If there is no booking system, the CTA should be a
   WhatsApp link, not a fake "book online" button.
7. **Instagram and Facebook** for the AZ shop. VK is irrelevant there.
8. **Where reviews live.** Google Maps most likely, since 2GIS has thin coverage
   in Azerbaijan. `AZ/js/reviews.az.js` is an empty stub waiting for real ones.
9. **Domain.** `.az` registration requires a local presence, which Rashad has and
   Daniel does not. Registering under his name is the clean path. A `.com` avoids
   the requirement entirely and is the fallback.

## Language decision

Azerbaijani, Latin script, `lang="az"`. Russian is widely understood in Baku, so
a RU toggle is worth asking about, but it doubles the copy to maintain. Do not
build it until Rashad says he wants it. If he does, the pattern is a
`AZ/ru/index.html` variant plus reciprocal `hreflang` tags on both.

**The Azerbaijani in this repo was written by Claude and has not been checked by
a native speaker.** Rashad is Azerbaijani. Have him read it out loud before it
goes anywhere near a customer. Machine-plausible Azerbaijani that reads slightly
off will cost more trust than it saves time.

## SEO plan: different market, different playbook

The Russian site is built for Yandex. That work does not transfer.

| | Izhevsk (RU) | Azerbaijan |
|---|---|---|
| Primary engine | Yandex, roughly half the market | Google, dominant |
| Local listing | Я.Бизнес | Google Business Profile |
| Analytics | Yandex Metrika, feeds ranking | GA4 |
| Maps | Yandex Maps, 2GIS | Google Maps |
| Instant indexing | IndexNow via Yandex | IndexNow via Bing, minor |

So: Google Search Console and GA4 are staged in `<head>` instead of the Yandex
pair. Yandex Webmaster is optional and second here, worth adding only if the shop
draws Russian-speaking traffic. The single highest-value action after launch is
a verified Google Business Profile per shop with real photos, exactly as
Я.Бизнес is the highest-value action in Izhevsk.

`robots.txt` keeps `Clean-param` anyway. It is harmless outside Yandex and costs
nothing if a Russian audience shows up later.

## Money

Daniel's call, not a calculation. Rashad pays in free haircuts for the Russian
site, and this one is meant to be symbolic rather than free, so the number's job
is to establish that Daniel's work has a price without straining a friendship.
Charging something also makes the next referral a paid conversation by default.

Worth deciding before quoting:

- Is this a fresh build or a rebrand of the existing one? It is the second, which
  is most of a day, not most of a week. Quote it as what it is.
- Does the price include the domain and hosting, or does Rashad buy those?
- Does it include ongoing edits, or is each change a new small job?

`/sales` renders the actual proposal once those three are settled.

## Build

```bash
python AZ/build-az.py        # regenerates AZ/index.html from the RU page
```

The page shares `css/`, `js/` and `img/` with the Russian site, so it cannot be
deployed straight from this folder. `AZ/scripts/deploy.sh` stages the shared
assets next to `AZ/index.html` and deploys that. It needs a Netlify site of its
own, which does not exist yet.

## Open question for Daniel

The AZ shop may reuse the Izhevsk gallery photos, which would be dishonest on a
page for a different shop in a different country. Get real photos, or drop the
gallery section for the first version and add it when the photos arrive.

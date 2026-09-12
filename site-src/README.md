# customelectrics.co.uk — public website

The public site and the CRM share one repo and one domain.

| URL | What it is |
|---|---|
| `/` | Public website (generated — do not hand-edit) |
| `/services/…`, `/areas/…`, `/about/`, `/reviews/`, `/contact/` | Generated public pages |
| `/login.html` | CRM sign-in — **bookmark this** |
| `/dashboard.html`, `/diary.html`, `/jobs.html`, … | CRM, unchanged, behind auth |

## Editing the site

**Never edit the generated HTML at the repo root.** It is overwritten on every
build. All copy lives in `site-src/content.js`.

```bash
cd C:\LocalDocs\custom-electrics
# edit site-src/content.js
node site-src/build.js
git add -A && git commit -m "Update site copy" && git push
```

GitHub Pages redeploys within a couple of minutes.

### Preview locally before pushing

```bash
python -m http.server 8099 --bind 127.0.0.1
# then open http://127.0.0.1:8099/
```

Root-relative links (`/services/`) mean opening the files directly with
`file://` will look broken. Use the local server.

### The build is intentionally strict

`build.js` throws rather than emitting a page that is missing a title,
description or body, and warns on over-length titles (>65 chars) and
descriptions (>165). **Read the warnings** — they are the whole point of the
guard rails. Google truncates anything longer, so a warning means real search
results are being cut off.

## Adding a service or area page

Append an object to `SERVICES` or `AREAS` in `content.js` and rebuild. Nav,
footer, sitemap, cross-links and schema all pick it up automatically.

One rule for area pages: **write something genuinely specific to the place.**
The existing pages are built around the housing stock actually there — stone
back-to-backs in Pudsey, extended semis in Horsforth, ex-council stock in
Bramley. Six near-identical pages with the town name swapped are treated by
Google as doorway pages and can pull down the whole site's rankings. If there
is nothing real to say about a town, leave it as a pill link on `/areas/`
rather than giving it a page.

## Things deliberately NOT done

- **No `aggregateRating` in the structured data.** The 5.0-from-25 figure
  belongs to Rated People. Google only permits `aggregateRating` markup for
  ratings the site collected itself; marking up a third party's is a
  manual-action risk. The rating is shown as an attributed, linked badge.
- **No invented or altered reviews.** The five on `/reviews/` are verbatim,
  with the reviewers' own first names. Since April 2025 the Digital Markets,
  Competition and Consumers Act 2024 makes publishing fake or materially
  altered reviews a banned practice the CMA can fine directly.
- **No anonymous write access to Supabase.** See below.

---

# Enquiry form — remaining setup

The contact form posts to a Supabase Edge Function. **Until it is deployed the
form will fail**, and the page falls back to telling visitors to email
directly — so nothing is silently lost, but no leads reach the CRM either.

Source: `C:\LocalDocs\custom-electrics-supabase\functions\website-enquiry\index.ts`

## Why a function instead of a direct insert

A public form posting straight to PostgREST would need an RLS policy granting
`anon` INSERT on `leads`. That is a bigger hole than it looks: `anon` could
forge `business_id`, `status`, `source` and `lead_cost`, and any later mistake
editing that policy risks exposing the whole customer list on SELECT. Running
server-side with the service-role key means `leads` keeps its existing
member-only policies and the anon key gains nothing at all.

## Deploy it

No Supabase CLI is installed on this machine, so the quickest route is the
dashboard:

1. **https://supabase.com/dashboard/project/vbhrslysnnhjdhbyhqgm/functions**
2. *Create a new function*, name it exactly `website-enquiry`.
3. Paste the whole contents of `website-enquiry/index.ts`.
4. **Turn OFF "Verify JWT with legacy secret"** for this function. This matters:
   leave it on and every public submission gets a 401, because website visitors
   are not signed in.
5. Deploy.

Or, if you'd rather install the CLI (`npm i -g supabase`):

```bash
cd C:\LocalDocs\custom-electrics-supabase
supabase functions deploy website-enquiry --no-verify-jwt
```

## Secrets

At **https://supabase.com/dashboard/project/vbhrslysnnhjdhbyhqgm/settings/functions**

| Secret | Value |
|---|---|
| `RESEND_API_KEY` | Already set — the same key `send-email` uses |
| `ENQUIRY_BUSINESS_ID` | Optional. The `businesses.id` to file leads against |

`ENQUIRY_BUSINESS_ID` can be left unset while there is exactly one row in
`businesses` — the function resolves it automatically. If a second business is
ever added it fails loudly rather than guessing, because silently filing
enquiries against the wrong business would make them invisible to the person
who needs to see them.

## Test it

```bash
curl -X POST https://vbhrslysnnhjdhbyhqgm.supabase.co/functions/v1/website-enquiry \
  -H "Content-Type: application/json" \
  -H "Origin: https://customelectrics.co.uk" \
  -d '{"name":"Test Enquiry","phone":"07700900123","service":"EICR / landlord certificate","notes":"Ignore - testing the form"}'
```

Expect `{"ok":true,"id":"…"}`, a new lead in the Leads tab with source
`Website` and cost `0`, and an alert email. Delete the test lead afterwards.

Built-in protections: a honeypot field (returns a fake success so bots don't
retry), an origin allowlist, and a 10-minute duplicate guard so a double-tap
on a flaky mobile connection doesn't create two leads.

---

# SEO — what is done and what only you can do

## Done in the build

- Unique title + meta description per page, all inside Google's truncation limits
- `Electrician` + `BreadcrumbList` schema sitewide; `Service` + `FAQPage` on
  the six service pages (FAQ markup matched to FAQs genuinely present in the HTML)
- `sitemap.xml` (18 indexable pages) and `robots.txt` excluding every CRM page
- Clean directory URLs, canonical tags, Open Graph tags
- Mobile-first layout, sticky tap-to-call bar, no render-blocking JS
- Internal linking between every service and area page

## Only you can do these — in priority order

**1. Google Business Profile — https://business.google.com/create**

This is the single biggest lever and the site cannot substitute for it. Most
"electrician near me" traffic goes to the map pack, and you cannot appear there
without a verified profile.

- Choose **"I deliver goods and services to my customers"**, then **hide the
  address** — you are a service-area business, so Earlswood Mead stays private
- Primary category: **`Electrician`** exactly
- Service areas: Pudsey, Farsley, Horsforth, Bramley, Leeds, Bradford
- Website: `https://customelectrics.co.uk`
- Description: `site-src/marketing/gbp-description.txt` (726/750 chars)
- Expect postcard or video verification; video is faster
- Check status at **https://business.google.com/dashboard**

Once verified, grab the `https://g.page/r/…` review short link and put it in
`REVIEW_LINK` at the top of `shared.js`. The review-request email template in
the CRM then points at Google instead of Rated People. **Google reviews feed
the map pack; Rated People reviews do nothing for local search.**

**2. Google Search Console — https://search.google.com/search-console**

Add `customelectrics.co.uk` as a **Domain** property. Verification is a DNS TXT
record wherever the domain's nameservers are (the site is behind Cloudflare).
Then submit `https://customelectrics.co.uk/sitemap.xml`.

Without this you are blind — no idea what you rank for, what is broken, or
whether Google has indexed anything.

**3. Bing Webmaster Tools — https://www.bing.com/webmasters**

Imports straight from Search Console in two clicks. Small traffic share, but
it also feeds ChatGPT search.

**4. Reviews**

Five reviews from 2022 is the weakest thing about the site. Use the
"Past customer — ask for a review" template in the CRM's email modal
(Clients tab → *Write email* / *Email several*) and send it to recent
customers. Aim for a steady trickle rather than a burst — a sudden pile of
reviews on a new profile looks manufactured to Google's filters.

**5. Photos**

The site has no job photos because there were none to use. Before/after shots
of consumer units are the most persuasive images a domestic electrician can
have, and they also go on the Google profile, which measurably affects map-pack
ranking. Take them on a phone; they don't need to be good.

## Realistic timeline

Nothing happens for a few weeks. New sites are sandboxed, and a verified Google
Business Profile with a handful of recent reviews will outrank the website for
local searches long before the website does. Expect three to six months for the
service and area pages to settle, longer for competitive terms like
"electrician Leeds".

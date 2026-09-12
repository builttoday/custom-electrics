/* ===================== Static site generator =====================
   node site-src/build.js

   Renders every public page into the repo root as real static HTML, ready for
   GitHub Pages. Deliberately loud: if a required field is missing it throws
   rather than emitting a half-finished page with an empty <title>, because a
   silently degraded page is far more expensive to notice than a failed build.

   Output layout — directories, not .html files, so URLs are clean
   (/services/house-rewires/ rather than /services/house-rewires.html).
   CRM files at the repo root (dashboard, diary, jobs, ...) are never touched. */

const fs = require("fs");
const path = require("path");
const C = require("./content");
const T = require("./template");

const { BUSINESS, SERVICES, AREAS, REVIEWS, SERVICE_OPTIONS } = C;
const { render, esc, icon, ctaButtons, ctaBand, trustBar, faqBlock, telHref } = T;

const ROOT = path.join(__dirname, "..");
const pages = [];   // {path, title, desc, body, ...} — collected, then written

/* ---------- guard rails ----------
   Every page must carry these before it is written. This exists because a
   generator that quietly drops a meta description is the kind of bug you find
   six months later in Search Console, not at build time. */
const REQUIRED = ["path", "title", "desc", "body"];
function addPage(p) {
  for (const k of REQUIRED) {
    if (!p[k] || !String(p[k]).trim()) {
      throw new Error(`Page "${p.path || "(no path)"}" is missing required field: ${k}`);
    }
  }
  if (p.title.length > 65) console.warn(`  ! title is ${p.title.length} chars (>65, Google will truncate): ${p.path}`);
  if (p.desc.length > 165) console.warn(`  ! description is ${p.desc.length} chars (>165, will truncate): ${p.path}`);
  if (pages.some((x) => x.path === p.path)) throw new Error(`Duplicate page path: ${p.path}`);
  pages.push(p);
}

const stars = '<span class="stars" aria-hidden="true">★★★★★</span>';

/* Rating badge — always attributed, never presented as our own aggregate. */
function ratingBadge() {
  return `<a class="rating" href="${BUSINESS.ratedPeople}" rel="noopener">
      ${stars} <strong>5.0</strong> <span>from 25 ratings on Rated People</span>
    </a>`;
}

/* ============================== Home ============================== */
function buildHome() {
  const serviceCards = SERVICES.map((s) => `<a class="card" href="/services/${s.slug}/">
        <span class="card-icon">${icon(s.icon)}</span>
        <h3>${s.nav}</h3>
        <p>${esc(s.card)}</p>
        <span class="card-more">Read more &rarr;</span>
      </a>`).join("\n      ");

  const areaPills = AREAS.map((a) => `<a class="pill" href="/areas/${a.slug}/">${esc(a.name)}</a>`).join("\n        ");

  const reviewCards = REVIEWS.slice(0, 3).map((r) => `<div class="review">
        ${stars}
        <blockquote>&ldquo;${esc(r.text)}&rdquo;</blockquote>
        <cite>${esc(r.name)}, ${esc(r.place)}<span class="meta">${esc(r.job)} &middot; via Rated People</span></cite>
      </div>`).join("\n      ");

  addPage({
    path: "/",
    title: "Electrician in Pudsey, Leeds & Bradford | Custom Electrics",
    desc: "City & Guilds qualified electrician in Pudsey. Fuse board upgrades, rewires, EICRs, EV chargers and fault finding across Leeds and Bradford. No job too small.",
    trail: [{ name: "Home", href: "/" }],
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      ${ratingBadge()}
      <h1>Your local electrician in Pudsey, Leeds &amp; Bradford</h1>
      <p class="hero-sub">City &amp; Guilds qualified, fully insured, and straight with you about what needs doing and what doesn't. No job too small &mdash; a single socket is a perfectly good reason to ring.</p>
      ${ctaButtons({ onDark: true, large: true })}
    </div>
    <div class="hero-card">
      <h2>Get a quote</h2>
      <p class="lede">Tell me what you need and I'll come and look. No charge for the visit.</p>
      <ul class="tick-list">
        <li>${icon("check")} Fixed price agreed before work starts</li>
        <li>${icon("check")} Full test certificate on every job</li>
        <li>${icon("check")} Honest answer on whether it actually needs doing</li>
        <li>${icon("check")} Same-day response to anything dangerous</li>
      </ul>
      <a class="btn btn-primary" href="/contact/" style="width:100%">Request a quote</a>
    </div>
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap">
    <div class="center" style="margin-bottom:40px">
      <p class="eyebrow">What I do</p>
      <h2>Domestic electrical work, done properly</h2>
      <p class="lede">Everything from a single socket to a full rewire, with the paperwork to match.</p>
    </div>
    <div class="grid grid-3">
      ${serviceCards}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="grid grid-2" style="align-items:center;gap:46px">
      <div>
        <p class="eyebrow">Why me</p>
        <h2>A one-man business, which is the point</h2>
        <p>I'm Will. The person who quotes your job is the person who turns up to do it and the person who answers the phone afterwards. Nothing gets handed to a subcontractor you've never met, and nothing gets sold to you by someone on commission.</p>
        <p>That also means I'll tell you when something <em>doesn't</em> need doing. Plenty of houses that feel like they need rewiring need a consumer unit and two circuits instead, and you're better off hearing that from me than finding out afterwards.</p>
        <a class="btn btn-ghost" href="/about/">More about how I work</a>
      </div>
      <div class="grid" style="gap:16px">
        <div class="card"><span class="card-icon">${icon("cert")}</span><h3>Qualified and certified</h3><p>City &amp; Guilds qualified and fully insured. Every job leaves with the right certificate for the work that was done.</p></div>
        <div class="card"><span class="card-icon">${icon("clock")}</span><h3>Turns up when I say</h3><p>If I'm running late you get a message, not silence. Anything genuinely dangerous gets seen the same day.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="center" style="margin-bottom:36px">
      <p class="eyebrow">Reviews</p>
      <h2>What customers say</h2>
      <p class="lede">Rated 5 out of 5 from 25 ratings on Rated People.</p>
    </div>
    <div class="grid grid-3">
      ${reviewCards}
    </div>
    <div class="center" style="margin-top:32px">
      <a class="btn btn-ghost" href="/reviews/">Read all reviews</a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap center">
    <p class="eyebrow">Where I work</p>
    <h2>Covering Leeds, Bradford &amp; West Yorkshire</h2>
    <p class="lede" style="margin-bottom:26px">Based in Pudsey, so the western side of Leeds and into Bradford is home turf.</p>
    <div class="pills">
        ${areaPills}
    </div>
  </div>
</section>

${ctaBand("Need an electrician?", "Tell me what's wrong and I'll tell you honestly what it needs. No charge for coming to look.")}
`,
  });
}

/* ============================== Services ============================== */
function buildServices() {
  addPage({
    path: "/services/",
    title: "Electrical Services | Custom Electrics, Pudsey & Leeds",
    desc: "Domestic electrical services across Leeds, Pudsey and Bradford: fuse board upgrades, rewires, EICRs, EV chargers, fault finding, sockets and outdoor power.",
    trail: [{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }],
    body: `
<section class="section">
  <div class="wrap">
    <p class="eyebrow">Services</p>
    <h1>Domestic electrical services</h1>
    <p class="lede">Everything below is work I do myself, across Pudsey, Leeds, Bradford and the surrounding area. If what you need isn't listed, ring anyway &mdash; the list isn't exhaustive.</p>
    <div class="grid grid-3" style="margin-top:42px">
      ${SERVICES.map((s) => `<a class="card" href="/services/${s.slug}/">
        <span class="card-icon">${icon(s.icon)}</span>
        <h3>${s.nav}</h3>
        <p>${esc(s.card)}</p>
        <span class="card-more">Read more &rarr;</span>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>
${ctaBand("Not sure what you need?", "Describe the problem and I'll tell you what it is likely to be before I come out.")}
`,
  });

  for (const s of SERVICES) {
    const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
    addPage({
      path: `/services/${s.slug}/`,
      title: s.title,
      desc: s.desc,
      faqs: s.faqs,
      trail: [{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }, { name: s.nav, href: `/services/${s.slug}/` }],
      extraSchema: [{
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.nav,
        serviceType: s.nav,
        description: s.desc,
        provider: { "@id": BUSINESS.domain + "/#business" },
        areaServed: AREAS.map((a) => ({ "@type": "Place", name: a.name })),
      }],
      body: `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">${s.nav}</p>
    <h1>${s.h1}</h1>
    <p class="hero-sub">${esc(s.intro)}</p>
    ${ctaButtons({ onDark: true })}
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap prose">
    ${s.body.trim()}
  </div>
</section>

${faqBlock(s.faqs)}

<section class="section">
  <div class="wrap">
    <h2>Other things I do</h2>
    <div class="grid grid-3" style="margin-top:24px">
      ${others.map((o) => `<a class="card" href="/services/${o.slug}/">
        <span class="card-icon">${icon(o.icon)}</span>
        <h3>${o.nav}</h3>
        <p>${esc(o.card)}</p>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand("Want a price?", "Tell me a bit about the job and I'll come and look. No charge for the visit, and a fixed price before anything starts.")}
`,
    });
  }
}

/* ============================== Areas ============================== */
function buildAreas() {
  addPage({
    path: "/areas/",
    title: "Areas Covered | Electrician in Leeds, Bradford & Pudsey",
    desc: "Custom Electrics covers Pudsey, Farsley, Horsforth, Bramley, Leeds and Bradford from a base in LS28. Domestic electrical work across West Yorkshire.",
    trail: [{ name: "Home", href: "/" }, { name: "Areas", href: "/areas/" }],
    body: `
<section class="section">
  <div class="wrap">
    <p class="eyebrow">Areas covered</p>
    <h1>Where I work</h1>
    <p class="lede">I'm based in Pudsey, so the west side of Leeds and into Bradford is where I am most days. If you're outside these areas it is still worth ringing &mdash; I will just be honest about whether the travel makes sense for the size of the job.</p>
    <div class="grid grid-3" style="margin-top:42px">
      ${AREAS.map((a) => `<a class="card" href="/areas/${a.slug}/">
        <span class="card-icon">${icon("pin")}</span>
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.postcodes)}</p>
        <span class="card-more">Read more &rarr;</span>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>
${ctaBand("In one of these areas?", "Get in touch and I'll come and look at the job.")}
`,
  });

  for (const a of AREAS) {
    addPage({
      path: `/areas/${a.slug}/`,
      title: a.title,
      desc: a.desc,
      trail: [{ name: "Home", href: "/" }, { name: "Areas", href: "/areas/" }, { name: a.name, href: `/areas/${a.slug}/` }],
      body: `
<section class="hero">
  <div class="wrap">
    ${ratingBadge()}
    <h1>${a.h1}</h1>
    <p class="hero-sub">${esc(a.intro)}</p>
    ${ctaButtons({ onDark: true })}
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap prose">
    ${a.body.trim()}
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <h2>Services in ${esc(a.name)}</h2>
    <div class="grid grid-3" style="margin-top:24px">
      ${SERVICES.map((s) => `<a class="card" href="/services/${s.slug}/">
        <span class="card-icon">${icon(s.icon)}</span>
        <h3>${s.nav}</h3>
        <p>${esc(s.card)}</p>
      </a>`).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand(`Electrician needed in ${esc(a.name)}?`, "Tell me what the job is and I'll come and price it up.")}
`,
    });
  }
}

/* ============================== Reviews ============================== */
function buildReviews() {
  addPage({
    path: "/reviews/",
    title: "Customer Reviews | Custom Electrics, Pudsey",
    desc: "Rated 5 out of 5 from 25 ratings on Rated People. Read what customers in Leeds, Bradford and West Yorkshire say about Custom Electrics Ltd.",
    trail: [{ name: "Home", href: "/" }, { name: "Reviews", href: "/reviews/" }],
    body: `
<section class="hero">
  <div class="wrap">
    ${ratingBadge()}
    <h1>Customer reviews</h1>
    <p class="hero-sub">Every review below was left by a real customer on Rated People, where the full profile and rating history are public. They are reproduced word for word, and the link goes straight to the source so you can check them yourself.</p>
    ${ctaButtons({ onDark: true })}
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap">
    <div class="grid grid-2">
      ${REVIEWS.map((r) => `<div class="review">
        ${stars}
        <blockquote>&ldquo;${esc(r.text)}&rdquo;</blockquote>
        <cite>${esc(r.name)}, ${esc(r.place)}<span class="meta">${esc(r.job)} &middot; via Rated People</span></cite>
      </div>`).join("\n      ")}
    </div>
    <p style="margin-top:32px;color:var(--ink-soft);font-size:.92rem;max-width:70ch">
      Custom Electrics holds a 5.0 rating from 25 ratings on Rated People. Not every customer who leaves a
      score also writes a comment &mdash; the reviews shown here are the ones that came with written feedback.
      <a href="${BUSINESS.ratedPeople}" rel="noopener">See the full profile on Rated People</a>.
    </p>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap center">
    <p class="eyebrow">Been a customer?</p>
    <h2>A review makes a real difference</h2>
    <p class="lede">I'm a one-man business without an advertising budget, so word of mouth is most of how people find me. If I've done work for you, a couple of lines takes a minute and genuinely helps.</p>
    <div class="btn-row" style="margin-top:24px">
      <a class="btn btn-primary" href="${BUSINESS.googleReview}" rel="noopener">Leave a Google review</a>
      <a class="btn btn-ghost" href="${BUSINESS.ratedPeople}" rel="noopener">Review on Rated People</a>
    </div>
    <p style="margin-top:18px;font-size:.86rem;color:var(--ink-soft)">
      Or just <a href="mailto:${BUSINESS.email}?subject=Feedback">email me your feedback</a> if you'd rather not post publicly.
    </p>
  </div>
</section>

${ctaBand("Want work doing?", "Tell me what you need and I'll come and price it up. No charge for the visit.")}
`,
  });
}

/* ============================== About ============================== */
function buildAbout() {
  addPage({
    path: "/about/",
    title: "About Custom Electrics Ltd | Electrician in Pudsey",
    desc: "Custom Electrics Ltd is a one-man domestic electrical business run by Will from Pudsey, West Yorkshire. City & Guilds qualified and fully insured. No job too small.",
    trail: [{ name: "Home", href: "/" }, { name: "About", href: "/about/" }],
    body: `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">About</p>
    <h1>A one-man electrical business in Pudsey</h1>
    <p class="hero-sub">I'm Will, and Custom Electrics is me. The person who quotes your job is the person who does it.</p>
    ${ctaButtons({ onDark: true })}
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap prose">
    <h2>How I work</h2>
    <p>Custom Electrics Ltd has been running since ${BUSINESS.founded}, doing domestic electrical work across Pudsey, Leeds, Bradford and the surrounding parts of West Yorkshire. It is deliberately a small operation. I quote the job, I do the job, and I am the one you speak to afterwards if something needs looking at again.</p>
    <p>What that means in practice is that I have no incentive to sell you work you don't need. There is no salesperson on commission and no target to hit. If your house needs a consumer unit rather than the rewire you were braced for, I will say so, and I would rather lose the bigger job than have you find out later that you didn't need it.</p>

    <h2>Qualifications</h2>
    <ul>
      <li><strong>City &amp; Guilds qualified</strong> domestic electrician</li>
      <li><strong>Fully insured</strong></li>
      <li>ID, address, credit and fraud checked by Rated People, where I have been a member for four years</li>
    </ul>

    <h2>The paperwork matters</h2>
    <p>Every job leaves with the right certificate: an Electrical Installation Certificate for new circuits and consumer units, a Minor Works Certificate for alterations, and an EICR where an inspection is what you asked for.</p>
    <p>I am not registered with a competent person scheme, so I do not self-certify notifiable work. Instead it goes through your council's Building Control: I submit the building notice on your behalf before starting, the council inspects, and the council issues the completion certificate. It is the same legal outcome by a different route, and I would rather be straight about which route it is than let you find out afterwards. Most jobs are not notifiable at all &mdash; extra sockets, light fittings, fault repairs and EICRs all fall outside it.</p>
    <p>This is the bit people discover matters years later, usually when they sell the house and a solicitor asks for certificates for work done. Keep them somewhere safe &mdash; and if you have lost one I issued, ask and I will look it up.</p>

    <h2>No job too small</h2>
    <p>It is on every tradesman's website and most of them do not mean it. I do. A single socket, a dead light, a dimmer that buzzes &mdash; these are all perfectly good reasons to get in touch, and they are priced as the small jobs they are. Small jobs are how most of my customers found me in the first place.</p>

    <h2>The business</h2>
    <p>${esc(BUSINESS.legalName)} is registered in England and Wales, company number ${BUSINESS.companyNumber}. That means you are dealing with a registered company, and you can look the filings up at Companies House yourself if you want to.</p>
  </div>
</section>

${ctaBand("Get in touch", "Tell me what you need doing and I'll come and have a look.")}
`,
  });
}

/* ============================== Contact ============================== */
function buildContact() {
  const tel = telHref();
  const phoneBlock = tel
    ? `<div class="card">
        <span class="card-icon">${icon("phone")}</span>
        <h3>Call</h3>
        <p><a href="${tel}" style="font-size:1.15rem;font-weight:600">${esc(BUSINESS.phone)}</a></p>
        <p style="margin-top:8px">${esc(BUSINESS.hours)}. If I'm on a job I'll ring you back.</p>
      </div>`
    : "";

  addPage({
    path: "/contact/",
    title: "Contact | Custom Electrics, Electrician in Pudsey & Leeds",
    desc: "Get a free quote from a City & Guilds qualified electrician covering Pudsey, Leeds and Bradford. Tell me about the job and I'll come and look.",
    trail: [{ name: "Home", href: "/" }, { name: "Contact", href: "/contact/" }],
    body: `
<section class="section">
  <div class="wrap">
    <div class="grid grid-2" style="gap:46px;align-items:start">
      <div>
        <p class="eyebrow">Contact</p>
        <h1>Get a quote</h1>
        <p class="lede">Tell me what needs doing and I'll come and look at it. There's no charge for coming out to price a job, and you get a fixed price in writing before anything starts.</p>
        <div class="grid" style="gap:16px;margin-top:30px">
          ${phoneBlock}
          <div class="card">
            <span class="card-icon">${icon("mail")}</span>
            <h3>Email</h3>
            <p><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></p>
          </div>
          <div class="card">
            <span class="card-icon">${icon("pin")}</span>
            <h3>Where I work</h3>
            <p>Based in Pudsey, LS28. Covering Leeds, Bradford, Farsley, Horsforth, Bramley and the surrounding area.</p>
          </div>
          <div class="card">
            <span class="card-icon">${icon("bolt")}</span>
            <h3>Something dangerous?</h3>
            <p>Burning smells, scorch marks round a socket, or anything that's given someone a shock &mdash; turn that circuit off at the board and ${tel ? "ring rather than emailing" : "email marked URGENT"}. If the whole street is off, that's the network operator on <strong>105</strong>, and it's free.</p>
          </div>
        </div>
      </div>

      <div class="form-card">
        <h2 style="margin-top:0">Tell me about the job</h2>
        <form id="enquiryForm" novalidate>
          <div class="field">
            <label for="f-name">Your name <span class="hint">(required)</span></label>
            <input type="text" id="f-name" name="name" autocomplete="name" required>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-phone">Phone</label>
              <input type="tel" id="f-phone" name="phone" autocomplete="tel">
            </div>
            <div class="field">
              <label for="f-email">Email</label>
              <input type="email" id="f-email" name="email" autocomplete="email">
            </div>
          </div>
          <p style="font-size:.82rem;color:var(--ink-soft);margin:-8px 0 16px">Leave at least one of phone or email so I can reply.</p>
          <div class="field-row">
            <div class="field">
              <label for="f-town">Town</label>
              <input type="text" id="f-town" name="address" autocomplete="address-level2" placeholder="Pudsey">
            </div>
            <div class="field">
              <label for="f-postcode">Postcode</label>
              <input type="text" id="f-postcode" name="postcode" autocomplete="postal-code" placeholder="LS28">
            </div>
          </div>
          <div class="field">
            <label for="f-service">What do you need?</label>
            <select id="f-service" name="service">
              ${SERVICE_OPTIONS.map((o) => `<option>${esc(o)}</option>`).join("\n              ")}
            </select>
          </div>
          <div class="field">
            <label for="f-notes">Details <span class="hint">(the more the better)</span></label>
            <textarea id="f-notes" name="notes" placeholder="What's the problem, what sort of property is it, and when suits you?"></textarea>
          </div>
          <!-- Honeypot: bots fill hidden fields, people don't. Server rejects if set. -->
          <div class="hp" aria-hidden="true">
            <label for="f-website">Leave this blank</label>
            <input type="text" id="f-website" name="website" tabindex="-1" autocomplete="off">
          </div>
          <button type="submit" class="btn btn-primary" id="submitBtn" style="width:100%">Send enquiry</button>
          <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
          <p style="font-size:.78rem;color:var(--ink-soft);margin:14px 0 0">
            Your details are used only to reply to this enquiry and are never passed to anyone else.
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
`,
    scripts: `
<script>
(function () {
  var form = document.getElementById("enquiryForm");
  var btn = document.getElementById("submitBtn");
  var status = document.getElementById("formStatus");
  var ENDPOINT = "${process.env.ENQUIRY_ENDPOINT || "https://vbhrslysnnhjdhbyhqgm.supabase.co/functions/v1/website-enquiry"}";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    var data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.name.trim()) {
      status.className = "form-status err";
      status.textContent = "Please tell me your name.";
      document.getElementById("f-name").focus();
      return;
    }
    if (!(data.phone || "").trim() && !(data.email || "").trim()) {
      status.className = "form-status err";
      status.textContent = "Please leave a phone number or an email address so I can get back to you.";
      document.getElementById("f-phone").focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.innerHTML =
        '<div class="form-done"><h3>Thanks &mdash; that\\'s come through</h3>' +
        '<p>I\\'ll get back to you as soon as I can, usually the same day. ' +
        'If it\\'s urgent, ring rather than waiting on a reply.</p></div>';
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Send enquiry";
      status.className = "form-status err";
      status.innerHTML = 'Sorry &mdash; that didn\\'t send. Please email me directly at ' +
        '<a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.';
    }
  });
})();
</script>`,
  });
}

/* ============================== 404 ============================== */
function build404() {
  addPage({
    path: "/404/",
    file: "404.html",            // GitHub Pages wants this at the root, not /404/index.html
    noindex: true,
    title: "Page not found | Custom Electrics",
    desc: "That page doesn't exist. Head back to the homepage or get in touch.",
    body: `
<section class="section center">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1>That page doesn't exist</h1>
    <p class="lede">It may have moved, or the link may be wrong.</p>
    <div class="btn-row" style="margin-top:26px;justify-content:center">
      <a class="btn btn-primary" href="/">Back to the homepage</a>
      <a class="btn btn-ghost" href="/contact/">Get in touch</a>
    </div>
  </div>
</section>`,
  });
}

/* ============================== Write it all out ============================== */
function writeAll() {
  let written = 0;
  for (const p of pages) {
    const html = render(p);
    let out;
    if (p.file) {
      out = path.join(ROOT, p.file);
    } else if (p.path === "/") {
      out = path.join(ROOT, "index.html");
    } else {
      out = path.join(ROOT, p.path.replace(/^\/|\/$/g, ""), "index.html");
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html, "utf8");
    written++;
    console.log("  " + path.relative(ROOT, out).replace(/\\/g, "/"));
  }

  // static assets that live in site-src/ and are copied out verbatim
  for (const asset of ["site.css", "chat.js"]) {
    fs.copyFileSync(path.join(__dirname, asset), path.join(ROOT, asset));
    console.log("  " + asset);
  }

  // sitemap — public pages only; the 404 and the CRM are excluded on purpose
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.filter((p) => !p.noindex).map((p) => {
    const priority = p.path === "/" ? "1.0" : (p.path.split("/").length <= 3 ? "0.8" : "0.7");
    return `  <url>
    <loc>${BUSINESS.domain}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, "utf8");
  console.log("  sitemap.xml");

  // robots — keep crawlers out of the CRM, which is behind auth anyway but
  // there is no reason for those URLs to be in an index at all
  fs.writeFileSync(path.join(ROOT, "robots.txt"),
`User-agent: *
Allow: /
Disallow: /login.html
Disallow: /dashboard.html
Disallow: /diary.html
Disallow: /jobs.html
Disallow: /clients.html
Disallow: /leads.html
Disallow: /invoices.html
Disallow: /certificates.html
Disallow: /accounts.html
Disallow: /settings.html
Disallow: /import.html

Sitemap: ${BUSINESS.domain}/sitemap.xml
`, "utf8");
  console.log("  robots.txt");

  // Stop GitHub Pages running the content through Jekyll
  fs.writeFileSync(path.join(ROOT, ".nojekyll"), "", "utf8");

  console.log(`\n${written} pages built.`);
  if (!BUSINESS.phone) {
    console.warn("\n  ! NO PHONE NUMBER SET. Call buttons and the mobile call bar are omitted.");
    console.warn("    Set BUSINESS.phone in site-src/content.js and rebuild.");
  }
}

console.log("Building customelectrics.co.uk ...\n");
buildHome();
buildServices();
buildAreas();
buildReviews();
buildAbout();
buildContact();
build404();
writeAll();

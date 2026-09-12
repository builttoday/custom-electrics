/* ===================== Page shell =====================
   Renders a finished HTML document. Header/footer are baked into every page at
   build time rather than injected by JS — Google will index a JS-built nav
   eventually, but it delays discovery and there is no upside to it here. */

const { BUSINESS, NAV, ICONS } = require("./content");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Phone as a tel: href — strip everything that isn't a digit or leading +. */
const telHref = () => BUSINESS.phone ? "tel:" + BUSINESS.phone.replace(/[^\d+]/g, "") : null;

const icon = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

/* The primary call-to-action pair. Falls back to email-only until a phone
   number is configured, so the site is publishable either way. */
function ctaButtons({ onDark = false, large = false } = {}) {
  const size = large ? " btn-lg" : "";
  const secondary = onDark ? "btn-on-dark" : "btn-ghost";
  const tel = telHref();
  if (tel) {
    return `<div class="btn-row">
      <a class="btn btn-primary${size}" href="${tel}">${icon("phone")} Call ${esc(BUSINESS.phone)}</a>
      <a class="btn ${secondary}${size}" href="/contact/">Request a quote</a>
    </div>`;
  }
  return `<div class="btn-row">
    <a class="btn btn-primary${size}" href="/contact/">${icon("mail")} Request a quote</a>
    <a class="btn ${secondary}${size}" href="mailto:${BUSINESS.email}">Email me directly</a>
  </div>`;
}

function header(path) {
  const cur = (href) => (path === href || (href !== "/" && path.startsWith(href)))
    ? ' aria-current="page"' : "";
  const links = NAV.map((n) => n.cta
    ? `<a class="btn btn-primary" href="${n.href}">${esc(n.label)}</a>`
    : `<a href="${n.href}"${cur(n.href)}>${esc(n.label)}</a>`).join("\n        ");
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(BUSINESS.legalName)} home">
      <img class="brand-logo" src="/logo.png" alt="" width="46" height="46">
      <span class="brand-text">
        <span class="brand-script">Custom</span>
        <span class="brand-caption">Electrics</span>
      </span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="nav" aria-label="Menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
    <nav class="nav" id="nav">
        ${links}
    </nav>
  </div>
</header>`;
}

function trustBar() {
  const items = [
    ["cert", "City &amp; Guilds qualified"],
    ["bolt", "No job too small"],
    ["check", "Fully insured"],
    ["pin", "Based in Pudsey"],
  ];
  return `<div class="trust"><div class="wrap trust-inner">
    ${items.map(([i, t]) => `<span class="trust-item">${icon(i)} ${t}</span>`).join("\n    ")}
  </div></div>`;
}

function ctaBand(heading, text) {
  return `<section class="section cta-band">
  <div class="wrap">
    <h2>${heading}</h2>
    <p>${text}</p>
    <div style="margin-top:26px">${ctaButtons({ onDark: true, large: true })}</div>
  </div>
</section>`;
}

function footer() {
  const tel = telHref();
  const phoneLine = tel
    ? `<li><a href="${tel}">${esc(BUSINESS.phone)}</a></li>`
    : "";
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <img class="brand-logo" src="/logo.png" alt="" width="54" height="54">
        <span class="brand-text">
          <span class="brand-script" style="font-size:1.5rem">Custom</span>
          <span class="brand-caption">Electrics</span>
        </span>
        <p class="footer-about">Domestic electrician based in Pudsey, covering Leeds, Bradford and West Yorkshire. No job too small.</p>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="/services/consumer-unit-upgrades/">Fuse boards</a></li>
          <li><a href="/services/house-rewires/">Rewires</a></li>
          <li><a href="/services/eicr-landlord-certificates/">EICRs</a></li>
          <li><a href="/services/ev-charger-installation/">EV chargers</a></li>
          <li><a href="/services/fault-finding/">Fault finding</a></li>
          <li><a href="/services/sockets-lighting-outdoor-power/">Sockets &amp; lighting</a></li>
        </ul>
      </div>
      <div>
        <h4>Areas</h4>
        <ul>
          <li><a href="/areas/pudsey/">Pudsey</a></li>
          <li><a href="/areas/farsley/">Farsley</a></li>
          <li><a href="/areas/horsforth/">Horsforth</a></li>
          <li><a href="/areas/bramley/">Bramley</a></li>
          <li><a href="/areas/leeds/">Leeds</a></li>
          <li><a href="/areas/bradford/">Bradford</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          ${phoneLine}
          <li><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></li>
          <li><a href="/contact/">Request a quote</a></li>
          <li><a href="${BUSINESS.facebook}" rel="noopener">Facebook</a></li>
          <li><a href="${BUSINESS.ratedPeople}" rel="noopener">Rated People</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <p>${esc(BUSINESS.legalName)} is a company registered in England and Wales, company number ${BUSINESS.companyNumber}. Registered office: ${esc(BUSINESS.regAddress)}.</p>
      <p>&copy; ${new Date().getFullYear()} ${esc(BUSINESS.legalName)} &middot; <a href="/login.html">Staff login</a></p>
    </div>
  </div>
</footer>`;
}

/* Sticky bottom bar on phones. Call + quote if there's a number, otherwise
   quote + email, so it's never a dead half-bar. */
function callBar() {
  const tel = telHref();
  if (tel) {
    return `<div class="callbar">
  <a class="primary" href="${tel}">${icon("phone")} Call now</a>
  <a href="/contact/">${icon("mail")} Get a quote</a>
</div>`;
  }
  return `<div class="callbar">
  <a class="primary" href="/contact/">${icon("mail")} Get a quote</a>
  <a href="mailto:${BUSINESS.email}">${icon("mail")} Email</a>
</div>`;
}

/* LocalBusiness graph, emitted once on every page. `Electrician` is a real
   schema.org type and more specific than LocalBusiness, so use it.
   Deliberately NO aggregateRating: the 5-star/25-rating figure belongs to Rated
   People, and Google only permits aggregateRating markup for ratings the site
   itself collected. Marking up someone else's is a manual-action risk. */
function businessSchema() {
  const node = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": BUSINESS.domain + "/#business",
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    url: BUSINESS.domain + "/",
    email: BUSINESS.email,
    description: "Domestic electrician based in Pudsey, covering Leeds, Bradford and West Yorkshire. Consumer unit upgrades, rewires, EICRs, EV chargers and fault finding.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "17 Earlswood Mead",
      addressLocality: "Pudsey",
      addressRegion: "West Yorkshire",
      postalCode: BUSINESS.postcode,
      addressCountry: "GB",
    },
    geo: { "@type": "GeoCoordinates", latitude: BUSINESS.lat, longitude: BUSINESS.lng },
    areaServed: ["Pudsey", "Farsley", "Horsforth", "Bramley", "Leeds", "Bradford", "West Yorkshire"]
      .map((n) => ({ "@type": "Place", name: n })),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
    ],
    sameAs: [BUSINESS.facebook, BUSINESS.ratedPeople],
    foundingDate: BUSINESS.founded,
    priceRange: "££",
    image: BUSINESS.domain + "/logo.png",
    logo: BUSINESS.domain + "/logo.png",
  };
  if (BUSINESS.phone) node.telephone = BUSINESS.phone;
  return node;
}

function breadcrumbSchema(trail) {
  if (!trail || trail.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem", position: i + 1, name: t.name,
      item: BUSINESS.domain + t.href,
    })),
  };
}

function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/* FAQs render as real <details> so the answers are in the HTML source, which is
   what the FAQPage markup has to match — markup describing content that isn't on
   the page is a structured-data violation. */
function faqBlock(faqs) {
  if (!faqs || !faqs.length) return "";
  return `<section class="section section-alt">
  <div class="wrap">
    <h2>Common questions</h2>
    <div class="grid grid-2" style="margin-top:26px">
      ${faqs.map((f) => `<div class="card">
        <h3>${esc(f.q)}</h3>
        <p>${esc(f.a)}</p>
      </div>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function render(page) {
  const canonical = BUSINESS.domain + page.path;
  const schemas = [businessSchema(), breadcrumbSchema(page.trail), faqSchema(page.faqs)]
    .concat(page.extraSchema || [])
    .filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#225361">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BUSINESS.legalName)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${BUSINESS.domain}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/logo.png">
<link rel="apple-touch-icon" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site.css">
<script type="application/ld+json">
${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 1)}
</script>
</head>
<body class="has-callbar">
<a class="skip" href="#main">Skip to content</a>
${header(page.path)}
<main id="main">
${page.body}
</main>
${footer()}
${callBar()}
<script>
(function(){
  var t=document.getElementById("navToggle"),n=document.getElementById("nav");
  t.addEventListener("click",function(){
    var open=n.classList.toggle("open");
    t.setAttribute("aria-expanded",open?"true":"false");
  });
})();
</script>
${page.scripts || ""}
<script src="/chat.js" defer></script>
</body>
</html>`;
}

module.exports = { render, esc, icon, ctaButtons, ctaBand, trustBar, faqBlock, telHref };

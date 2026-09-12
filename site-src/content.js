/* ===================== Custom Electrics Ltd — website content =====================
   Single source of truth for every public page. build.js renders these into static
   HTML; nothing here is fetched or assembled in the browser, because Google should
   see finished markup on first request.

   FACTS IN THIS FILE ARE LOAD-BEARING. Company number, registered office and the
   qualification wording are legal statements — they came from Companies House and
   Will's own trade profiles, not from invention. Don't "improve" them. */

const BUSINESS = {
  name: "Custom Electrics",
  legalName: "Custom Electrics Ltd",
  companyNumber: "13198562",
  // Registered office per Companies House. Shown in the footer because the Companies
  // (Trading Disclosures) Regulations 2015 require it on a Ltd's website.
  regAddress: "17 Earlswood Mead, Pudsey, West Yorkshire, LS28 8QY",
  town: "Pudsey",
  county: "West Yorkshire",
  postcode: "LS28 8QY",
  // Geo for LocalBusiness schema — Pudsey town centre, not the house.
  lat: 53.7965,
  lng: -1.6626,

  // Displayed as written; template.js strips non-digits for the tel: href, so the
  // spacing here is purely for readability on the page.
  phone: "07734 157465",

  email: "will@customelectrics.co.uk",
  domain: "https://customelectrics.co.uk",
  facebook: "https://www.facebook.com/CustomElectrics/",
  ratedPeople: "https://www.ratedpeople.com/profile/william-munro",
  googleReview: "https://g.page/r/CXxEe5se8ssVEBM/review",
  founded: "2021",
  owner: "Will",
  hours: "Mon–Fri 08:00–18:00, Sat 09:00–13:00",
};

/* Nav shown in the header on every page. */
const NAV = [
  { label: "Services", href: "/services/" },
  { label: "Areas", href: "/areas/" },
  { label: "Reviews", href: "/reviews/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/", cta: true },
];

/* Inline SVG icon set — no icon font, no external requests. 24x24 stroke paths. */
const ICONS = {
  board: '<path d="M4 3h16v18H4z"/><path d="M8 7h8M8 12h8M8 17h4"/>',
  rewire: '<path d="M4 8h4l3 8h4l3-8h2"/><circle cx="4" cy="8" r="1.6"/><circle cx="20" cy="8" r="1.6"/>',
  clipboard: '<path d="M9 3h6v3H9z"/><path d="M6 5h2v0h8V5h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M9 12l2 2 4-4"/>',
  ev: '<path d="M5 20V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v13"/><path d="M3 20h14"/><path d="M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9"/><path d="M10 9l-2 3h3l-2 3"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  socket: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.3"/><circle cx="15" cy="10" r="1.3"/><path d="M9 15h6"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  cert: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13 7 22l5-2.5L17 22l-1.5-9"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
};

/* ============================== Services ==============================
   One page each. These are the terms people actually type — "fuse box
   replacement" gets searched far more than "consumer unit", so both appear. */
const SERVICES = [
  {
    slug: "consumer-unit-upgrades",
    icon: "board",
    nav: "Fuse boards & consumer units",
    card: "Old fuse box swapped for a modern consumer unit with RCBO protection on every circuit, tested and certified in a day.",
    title: "Fuse Box & Consumer Unit Replacement in Pudsey & Leeds",
    desc: "Old fuse box replaced with a modern RCBO consumer unit, usually in a day. Fixed price, full test certificate and the Building Control side handled. Leeds & Bradford.",
    h1: "Fuse box &amp; consumer unit upgrades",
    intro: "If your fuse board still has rewireable fuses, or trip switches with no test button, it predates the current wiring regulations and will not cut the power fast enough to protect someone getting a shock. Replacing it is the single biggest safety improvement most houses can have, and it is normally one day's work.",
    body: `
      <h2>How to tell yours needs replacing</h2>
      <ul>
        <li><strong>Rewireable fuses</strong> — ceramic holders with fuse wire in them. These are decades out of date.</li>
        <li><strong>A plastic enclosure</strong> — since 2016 consumer units in domestic properties have had to be non-combustible, which in practice means a steel case.</li>
        <li><strong>No RCD test button</strong> — without an RCD there is nothing cutting the supply quickly enough if a cable is drilled through or an appliance fails.</li>
        <li><strong>Nuisance tripping</strong> — one fault taking out the whole house usually means a single RCD covering everything.</li>
      </ul>

      <h2>What you get</h2>
      <p>A modern steel consumer unit with an <strong>RCBO on every circuit</strong>, so a fault on one circuit no longer blacks out the whole house and you can tell instantly which circuit is at fault. Surge protection (SPD) is included as standard — it protects boilers, TVs and computers from spikes on the incoming supply.</p>
      <p>Before the new board goes on I test every existing circuit. That matters: a new consumer unit with sensitive RCBOs will immediately find faults an old board was quietly tolerating, usually damp in an outside light or a cable nicked by a previous trade. I would rather find those at the quote stage than halfway through the job, so you get an honest price rather than a low one that grows.</p>

      <h2>What it costs and how long it takes</h2>
      <p>A straightforward swap is a single day, with the power off for most of it. You get a fixed price in writing before I start — if the pre-checks turn up remedial work, I tell you what it is, what it costs and whether it genuinely needs doing now or can wait.</p>

      <h2>The paperwork</h2>
      <p>Replacing a consumer unit is notifiable work under <strong>Part P</strong> of the Building Regulations, so it has to be registered with Building Control. You get a full Electrical Installation Certificate with the test results for every circuit — keep it, because it is what a solicitor asks for when you sell the house.</p>
      <p>Work like this is notifiable, which means it has to be registered with Building Control. I take care of that side for you: the building notice goes in to your council before I start, they inspect the work, and they issue the completion certificate to sit alongside your Electrical Installation Certificate. The council charges a fee for the inspection, and I will tell you exactly what it is when I quote, so it is in the price from the start rather than a surprise at the end.</p>
    `,
    faqs: [
      { q: "How long will my power be off?", a: "Most of the working day for a standard swap. I will give you a realistic window before the day so you can plan around home working, freezers or anyone in the house who needs the power on." },
      { q: "Do I legally have to upgrade my fuse box?", a: "No. There is no law forcing you to replace a working fuse board in your own home. But an old board without RCD protection will be flagged on an EICR, and most landlord and mortgage-related inspections will pick it up." },
      { q: "Will a new consumer unit stop my lights tripping?", a: "Usually, but not always — it depends what is causing it. With RCBOs a fault is isolated to one circuit instead of tripping the house, and it becomes obvious which circuit is at fault. If there is an underlying fault on a circuit, that still needs fixing, which is why I test everything before quoting." },
      { q: "Is the certificate included?", a: "Yes. The Electrical Installation Certificate is part of the job, not an extra. A consumer unit swap is also notifiable, so it gets registered with Building Control: I put the building notice in, the council inspects, and they issue the completion certificate. The council charges a fee for that and I will tell you what it is before you commit to anything." },
    ],
  },
  {
    slug: "house-rewires",
    icon: "rewire",
    nav: "House rewires",
    card: "Full and partial rewires, planned around you room by room so you are never left without power or lighting overnight.",
    title: "House Rewires in Pudsey, Leeds & Bradford | Custom Electrics",
    desc: "Full and partial house rewires by a City & Guilds qualified electrician. Staged so you keep power overnight. Fixed price, full certification. Leeds & Bradford.",
    h1: "Full &amp; partial house rewires",
    intro: "A rewire is the most disruptive electrical job there is, so the thing that matters most is planning. I walk the house with you first, agree where every socket, switch and light is going, and stage the work so you are never left without power or lighting at the end of a day.",
    body: `
      <h2>When a house needs rewiring</h2>
      <p>Age alone does not decide it — condition does. The things that genuinely point to a rewire are:</p>
      <ul>
        <li><strong>Rubber, lead or fabric-sheathed cable.</strong> If the insulation cracks when you flex it, it is past saving. Common in houses not touched since the 1960s.</li>
        <li><strong>No earth on the lighting circuits.</strong> Very common in older Pudsey and Bradford stone terraces, and it rules out most modern metal light fittings.</li>
        <li><strong>An EICR with multiple C2 codes</strong> where the remedial cost is approaching the cost of doing it properly once.</li>
        <li><strong>A house being gutted anyway</strong> — if the floors are up and the plaster is off, rewiring then costs a fraction of doing it later.</li>
      </ul>
      <p>Plenty of houses that feel "old" only need a consumer unit and a few circuits rather than a full rewire. I will tell you if that is the case — an <a href="/services/eicr-landlord-certificates/">EICR</a> is the honest way to find out before committing to the bigger job.</p>

      <h2>Full or partial</h2>
      <p>A <strong>full rewire</strong> replaces every cable, accessory and the consumer unit. A <strong>partial rewire</strong> tackles the circuits that are actually failing — often the lighting, or the upstairs sockets — and keeps sound cable where it is. Partial is cheaper and far less disruptive, and it is the right answer more often than the trade generally admits.</p>

      <h2>How I work</h2>
      <p>First fix is the cabling: lifting floorboards, chasing walls, running the new circuits. Second fix is the accessories and testing. A plasterer follows on between the two, and I will show you exactly where the chases will run before I cut anything, so you know what to budget for making good.</p>
      <p>You get the work staged so the kitchen and at least one lighting circuit are live every night. If you are living in the house through it, say so at the quote stage and I will plan around it.</p>

      <h2>Certification</h2>
      <p>A rewire is notifiable under Part P of the Building Regulations. You get a full Electrical Installation Certificate with every circuit's test results and a schedule of what is on each circuit.</p>
      <p>Work like this is notifiable, which means it has to be registered with Building Control. I take care of that side for you: the building notice goes in to your council before I start, they inspect the work, and they issue the completion certificate to sit alongside your Electrical Installation Certificate. The council charges a fee for the inspection, and I will tell you exactly what it is when I quote, so it is in the price from the start rather than a surprise at the end.</p>
    `,
    faqs: [
      { q: "Can I live in the house during a rewire?", a: "Usually yes. I stage the work so you have power and lighting every evening, and so only one area is out of action at a time. Tell me before I quote if anyone in the house works from home or needs power for medical equipment and I will plan around it." },
      { q: "How long does a rewire take?", a: "A typical three-bedroom house is around a week to ten days for first and second fix, with plastering and decorating following on after. Bigger or occupied houses take longer, because the work is staged to keep you in power throughout." },
      { q: "Do you make good the plaster?", a: "I fill every chase so the walls are ready for a plasterer to skim. At quote stage I will walk you through exactly how much making good the job will leave, so it is in your budget from the start rather than a surprise at the end." },
      { q: "Is a partial rewire a false economy?", a: "Not if the remaining cable is genuinely sound — and I will show you the test results rather than ask you to take my word for it. It is a false economy when the old cable is on its way out, and I will say so plainly if that is what I find." },
    ],
  },
  {
    slug: "eicr-landlord-certificates",
    icon: "clipboard",
    nav: "EICRs & landlord certificates",
    card: "Electrical Installation Condition Reports for homeowners, landlords and letting agents — with any remedial work done by the same person who found it.",
    title: "EICR & Landlord Electrical Safety Certificates | Pudsey & Leeds",
    desc: "EICR safety inspections for landlords and homeowners across Leeds, Pudsey and Bradford. Required every 5 years for rentals. Remedial work done too.",
    h1: "EICRs &amp; landlord electrical safety certificates",
    intro: "An Electrical Installation Condition Report is a full inspection and test of the fixed wiring in a property, ending in a document that says whether it is satisfactory or not. If you let property in England, it is not optional.",
    body: `
      <h2>The legal position for landlords</h2>
      <p>Under the Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020, a landlord must:</p>
      <ul>
        <li>Have the installation inspected and tested <strong>at least every 5 years</strong>;</li>
        <li>Give the tenant a copy of the report <strong>within 28 days</strong>;</li>
        <li>Give a copy to a new tenant <strong>before they move in</strong>;</li>
        <li>Supply it to the local authority within 7 days if asked;</li>
        <li>Carry out any <strong>C1, C2 or FI</strong> remedial work within <strong>28 days</strong> (or sooner if the report says so) and get written confirmation it is done.</li>
      </ul>
      <p>Councils can fine up to <strong>£30,000</strong> for non-compliance. Homeowners are advised, though not required, to have an EICR every 10 years.</p>

      <h2>What the codes mean</h2>
      <ul>
        <li><strong>C1 — danger present.</strong> Immediate risk. I make it safe on the spot before leaving.</li>
        <li><strong>C2 — potentially dangerous.</strong> Needs fixing promptly. C1 or C2 anywhere means the report is <em>unsatisfactory</em>.</li>
        <li><strong>FI — further investigation required.</strong> Also makes a report unsatisfactory.</li>
        <li><strong>C3 — improvement recommended.</strong> Does <em>not</em> make a report unsatisfactory, and does not have to be actioned. Be wary of anyone pressuring you to pay for C3 work as though it were compulsory.</li>
      </ul>

      <h2>One contractor, not two</h2>
      <p>The common frustration with EICRs is getting a fail from an inspector who does not do repairs, then chasing a second electrician who has to re-inspect before quoting. I do the inspection and the remedial work, and issue the paperwork at the end — one visit, one invoice, one point of contact, and no incentive for me to inflate the findings because you are free to take the report elsewhere.</p>

      <h2>Portfolios</h2>
      <p>If you have several properties, send me the addresses and I will tell you which are due and when. Landlords and letting agents with more than a couple of units get scheduled together, which keeps the cost per property down.</p>
    `,
    faqs: [
      { q: "How long does an EICR take?", a: "A typical two or three-bedroom house is two to four hours. The power goes off for parts of it because a proper report involves dead testing, not just a visual check — anyone in and out in twenty minutes has not done the test." },
      { q: "What happens if it fails?", a: "You get the report with each item coded, and a separate quote for the remedial work. Nothing is done without your say-so. If there is a C1 I make that item safe before I leave, because leaving known danger is not an option." },
      { q: "How often does a rented property need one?", a: "Every 5 years minimum in England, and a copy has to reach the tenant within 28 days. New tenants need it before they move in." },
      { q: "Do I need an EICR to sell my house?", a: "No, it is not required to sell. Buyers' solicitors normally ask for certificates for any notifiable work done, which is a different thing. An EICR can still be worth having if the buyer's survey flags the electrics." },
    ],
  },
  {
    slug: "ev-charger-installation",
    icon: "ev",
    nav: "EV charger installation",
    card: "Home EV charge points installed and certified, with an honest answer on whether your supply needs load management.",
    title: "EV Charger Installation in Pudsey, Leeds & Bradford",
    desc: "Home EV charge point installation across Leeds, Pudsey and Bradford. Proper load assessment, DNO notification and full certification by a qualified electrician.",
    h1: "EV charger installation",
    intro: "A home charge point is a dedicated circuit from your consumer unit to a wall-mounted unit, with its own protection and earthing arrangement. The install itself is straightforward. What matters is whether your incoming supply can take it — and that is the part that gets skipped.",
    body: `
      <h2>The load assessment nobody mentions</h2>
      <p>A 7.4kW charger draws 32A continuously, often for hours. Add an electric shower, an oven and a hob and a house on an older supply can exceed what the main fuse is rated for. The regulations require a proper maximum-demand assessment before installing, and where the supply is tight the answer is a <strong>load-managed charger</strong> that backs off when the rest of the house is drawing heavily, rather than an upgraded supply costing hundreds.</p>
      <p>I do that assessment before quoting and tell you which of the three situations you are in: fine as is, needs load management, or genuinely needs the DNO to upgrade the supply.</p>

      <h2>Earthing — the reason some quotes are cheaper</h2>
      <p>Most houses round here are on a PME (TN-C-S) earthing system, which is not permitted for outdoor charging without protection against the supply's neutral going open-circuit. That is handled either by a charger with built-in PEN-fault detection or by an earth rod. A quote that does not mention earthing at all has not considered it.</p>

      <h2>What is included</h2>
      <ul>
        <li>Survey and maximum-demand assessment</li>
        <li>Dedicated circuit with the correct RCD type (Type A or B depending on the unit)</li>
        <li>Tidy cable routing — agreed with you before a single clip goes in</li>
        <li>Commissioning, app setup and a walk-through of how to actually use it</li>
        <li>Electrical Installation Certificate, and the DNO notified as required</li>
        <li>Building Control registration handled — a charger is a new circuit, so it is notifiable, and I put the building notice in for you</li>
      </ul>

      <h2>Which charger</h2>
      <p>I will fit the unit you want. If you have no preference I will recommend one based on your parking, whether a tethered or untethered cable suits you better, and whether you are on a cheap-rate overnight tariff worth scheduling around. The recommendation is based on your house, not on which manufacturer I am signed up to.</p>
    `,
    faqs: [
      { q: "Can I get a grant?", a: "The main domestic grant closed to most homeowners in 2022. The EV chargepoint grant is still open to people in flats and rented accommodation, and there is a separate scheme for landlords. I will tell you honestly whether you qualify rather than quote as though you do." },
      { q: "How long does installation take?", a: "Most installs are half a day to a day, depending on how far the charger is from the consumer unit and whether the cable run is straightforward." },
      { q: "Do I need my supply upgraded?", a: "Usually not. Most houses take a 7.4kW charger fine, and where they do not, a load-managed unit is nearly always cheaper than a supply upgrade. I assess it properly before quoting rather than after starting." },
      { q: "Can you fit a charger on a shared drive or a flat?", a: "Sometimes, but it depends on cable routing, ownership of the parking space and permission from the freeholder or management company. Worth a conversation before you buy a unit." },
    ],
  },
  {
    slug: "fault-finding",
    icon: "bolt",
    nav: "Fault finding & repairs",
    card: "Tripping breakers, dead sockets and lights that flicker — traced properly and fixed, not guessed at.",
    title: "Electrical Fault Finding & Repairs | Pudsey, Leeds, Bradford",
    desc: "Tripping RCDs, dead sockets and flickering lights traced and repaired properly across Leeds, Pudsey and Bradford. Charged for time, with an agreed limit.",
    h1: "Electrical fault finding &amp; repairs",
    intro: "Something trips the moment you plug the kettle in. Half the sockets are dead. A light flickers only when it rains. These are the jobs that get bodged most often, because guessing is quicker than testing — and a guess that happens to work still leaves the fault there.",
    body: `
      <h2>How I actually find it</h2>
      <p>Fault finding is a process of elimination with instruments, not intuition. Insulation resistance testing on each circuit, splitting circuits at junction points to halve the search area, and checking the things that genuinely fail most often — moisture in outside lights and sockets, cables nicked by a previous trade, failing accessories, and neutrals borrowed between circuits by whoever wired it last.</p>
      <p>The most common cause I find in Pudsey and Bradford stone terraces is water getting into an outdoor fitting or a garage supply, which is why so many of these faults are weather-dependent. An intermittent fault that only happens in the rain is a strong clue, not a mystery — tell me when it happens and it saves us both time.</p>

      <h2>What it costs</h2>
      <p>Fault finding is charged for the time it takes, because nobody can honestly quote a fixed price to find something they have not seen yet. What I will do is agree a limit with you up front — if it is going to run past that, I stop and talk to you rather than run up a bill. Most faults are found within the first hour or two.</p>

      <h2>Things worth trying before you call</h2>
      <p>Not everything needs an electrician, and I would rather tell you that than charge you to find out:</p>
      <ul>
        <li>Unplug everything on the affected circuit, reset the breaker, then plug items back one at a time. A failing appliance is the cause more often than the wiring.</li>
        <li>If it is an outside light or a garage, check after dry weather — if the fault goes, it is water ingress.</li>
        <li>If the whole house is dead, check whether your neighbours are too before calling anyone. That is a job for the network operator on <strong>105</strong>, and it is free.</li>
      </ul>

      <h2>Genuinely urgent things</h2>
      <p>Burning smells, scorch marks or discolouration round a socket, a consumer unit that is hot to the touch, or anything that has given someone a shock — turn that circuit off at the board and get it looked at the same day. Do not wait to see if it settles down.</p>
    `,
    faqs: [
      { q: "Do you charge a call-out fee?", a: "I charge for the time on site rather than a separate call-out on top. You get told the hourly rate and an agreed limit before I set off, so there are no surprises." },
      { q: "Can you come out the same day?", a: "Often, for anything genuinely dangerous — burning smells, scorch marks, or a shock. Ring rather than emailing if it is urgent. Non-urgent faults are usually within a few days." },
      { q: "My RCD trips at random with nothing plugged in. What is it?", a: "Most often moisture in an outdoor circuit or a failing appliance that is hard-wired, like a boiler, shower or immersion heater. Sometimes it is accumulated small leakage across several circuits, which is exactly the problem RCBOs on individual circuits solve." },
      { q: "Will you fix it on the first visit?", a: "Usually. I carry common accessories and cable, so most faults are found and repaired in one visit. If a part needs ordering I will make it safe and come back." },
    ],
  },
  {
    slug: "sockets-lighting-outdoor-power",
    icon: "socket",
    nav: "Sockets, lighting & outdoor power",
    card: "Extra sockets, new lighting, power to a garage, shed, hot tub or office — no job too small.",
    title: "Extra Sockets, Lighting & Outdoor Power | Pudsey & Leeds",
    desc: "Extra sockets, new lighting, security lights and power to garages, sheds, hot tubs and garden offices across Leeds, Pudsey and Bradford. No job too small.",
    h1: "Sockets, lighting &amp; outdoor power",
    intro: "The everyday work: an extra socket so the extension lead can go in the bin, downlights in a kitchen, a security light that comes on when it should, or a proper supply to the garage instead of a cable out through the window.",
    body: `
      <h2>Inside</h2>
      <ul>
        <li>Extra sockets, doubles from singles, USB sockets</li>
        <li>Kitchen and bathroom lighting, including downlights and under-cabinet</li>
        <li>Dimmers that actually work with LED lamps — a lot do not, and that is the usual cause of flicker and buzz</li>
        <li>Extractor fans, cooker and hob circuits, electric oven installs</li>
        <li>Smoke and carbon monoxide alarm systems, interlinked</li>
        <li>Underfloor heating connections</li>
        <li>Loft, garage and cellar lighting</li>
      </ul>

      <h2>Outside</h2>
      <ul>
        <li>Outdoor sockets, weatherproof and RCD protected</li>
        <li>Security lighting and PIR sensors, aimed so they do not trigger on next door's cat</li>
        <li>Garden and decorative lighting</li>
        <li>Power to garages, sheds, summer houses and garden offices — in armoured cable and buried at the right depth, with its own small consumer unit where it is warranted</li>
        <li>Hot tub supplies, which need a dedicated circuit and the right protection rather than an extension lead</li>
        <li>Electric gates, and access control and door entry systems</li>
      </ul>

      <h2>"No job too small" is meant literally</h2>
      <p>A single socket is a perfectly good reason to ring. Small jobs get quoted and done like any other, and if several small things have been building up it is almost always cheaper to have them done in one visit than one at a time.</p>

      <h2>Certification</h2>
      <p>New circuits get a full Electrical Installation Certificate. Alterations to existing circuits get a Minor Electrical Installation Works Certificate. Most small jobs — an extra socket, swapping a light fitting — are not notifiable at all.</p>
      <p>Some work is: a brand new circuit, or anything inside a bathroom. I will tell you up front when a job falls into that category. Work like this is notifiable, which means it has to be registered with Building Control. I take care of that side for you: the building notice goes in to your council before I start, they inspect the work, and they issue the completion certificate to sit alongside your Electrical Installation Certificate. The council charges a fee for the inspection, and I will tell you exactly what it is when I quote, so it is in the price from the start rather than a surprise at the end.</p>
    `,
    faqs: [
      { q: "Is one socket worth calling someone out for?", a: "Yes. It is a small job and priced as one. If you have a list of other bits that have been nagging you, mention them when you ring — doing several in one visit costs less than several separate visits." },
      { q: "Why do my LED downlights flicker?", a: "Nearly always a dimmer not rated for LED loads, or a mix of lamp types on one dimmer. It is a cheap fix once diagnosed and does not mean anything is wrong with the wiring." },
      { q: "Can you run power to my shed or garden office?", a: "Yes. It needs armoured cable buried at the correct depth, proper protection at both ends and usually a small consumer unit in the outbuilding. A garden office running heaters and computers needs sizing properly rather than being hung off a socket circuit." },
      { q: "Do I need a certificate for a new socket?", a: "An alteration to an existing circuit gets a Minor Works Certificate, and that is not notifiable work — no council involvement, no extra fee. A brand new circuit gets a full Electrical Installation Certificate and is notifiable, so it goes through Building Control. You get the paperwork either way." },
    ],
  },
];

/* ============================== Areas ==============================
   Genuinely distinct pages, not spun duplicates. Each one is written around the
   housing stock actually there, because near-identical location pages are treated
   as doorway pages by Google and can hurt the whole site. If a future area cannot
   be given something real to say, it is better left as a pill link than a page. */
const AREAS = [
  {
    slug: "pudsey",
    name: "Pudsey",
    postcodes: "LS28",
    title: "Electrician in Pudsey | Custom Electrics Ltd",
    desc: "Local Pudsey electrician based in LS28. Fuse board upgrades, rewires, EICRs, EV chargers and fault finding. City & Guilds qualified, 5-star rated. No job too small.",
    h1: "Electrician in Pudsey",
    intro: "Custom Electrics is based in Pudsey — this is home, not a town added to a list. If you are in LS28 I am usually minutes away rather than an hour up the motorway.",
    body: `
      <h2>The electrics in Pudsey houses</h2>
      <p>Pudsey's housing is mostly stone-built: through terraces and back-to-backs around the town centre and Lowtown, interwar semis spreading out towards Tyersal and Fulneck, and pockets of newer estate housing. Each brings its own electrical quirks.</p>
      <p>The stone terraces are the ones I am called to most. Solid walls mean surface-mounted or heavily chased cable, lighting circuits with no earth are common, and consumer units are often tucked in a cellar head or under the stairs where damp is a factor. The 1930s semis frequently still have their original circuit layout with nowhere near enough sockets, which is why extra sockets and a board upgrade so often get done together.</p>

      <h2>What I get called out for locally</h2>
      <ul>
        <li><a href="/services/consumer-unit-upgrades/">Fuse board upgrades</a> in terraces that have never had RCD protection</li>
        <li><a href="/services/eicr-landlord-certificates/">EICRs</a> for the large number of LS28 properties that are let</li>
        <li><a href="/services/fault-finding/">Fault finding</a> on outside lights and garage supplies after heavy rain</li>
        <li><a href="/services/sockets-lighting-outdoor-power/">Power to garages and garden offices</a> on the longer plots</li>
        <li><a href="/services/ev-charger-installation/">EV chargers</a>, increasingly, on the newer estates</li>
      </ul>

      <p>Being local genuinely matters for the small jobs. A single socket is not worth a long journey for anyone, which is why so many people end up living with them — if you are in Pudsey, ring about it.</p>
    `,
  },
  {
    slug: "farsley",
    name: "Farsley",
    postcodes: "LS28",
    title: "Electrician in Farsley, LS28 | Custom Electrics Ltd",
    desc: "Farsley electrician covering LS28. Consumer unit upgrades, rewires, EICRs and fault finding in Farsley's stone terraces. Based next door in Pudsey.",
    h1: "Electrician in Farsley",
    intro: "Farsley is the next village along from my base in Pudsey, so it is a short hop — and it shares LS28, which means I am often there anyway.",
    body: `
      <h2>Farsley's housing stock</h2>
      <p>Farsley kept its village character, and with it a lot of Victorian stone terracing around Town Street and the old mill streets, plus substantial stone semis and villas on the higher ground. The conservation area around Town Street means external work needs a bit more thought — cable routing on a street-facing stone elevation is not something to do carelessly.</p>
      <p>The mill conversions and older terraces throw up two recurring problems: lighting circuits with no circuit protective conductor, which rules out metal fittings until it is put right, and consumer units that have been added to repeatedly over the decades until nobody can say what is on which circuit. An <a href="/services/eicr-landlord-certificates/">EICR</a> is usually the sensible first step in a house like that, because it tells you what you actually have before you spend anything.</p>

      <h2>Common jobs in Farsley</h2>
      <ul>
        <li><a href="/services/house-rewires/">Partial rewires</a> where the lighting is original but the socket circuits were redone at some point</li>
        <li><a href="/services/consumer-unit-upgrades/">Consumer unit replacement</a> with RCBOs, particularly in the older terraces</li>
        <li><a href="/services/sockets-lighting-outdoor-power/">Kitchen and bathroom lighting</a> during renovations</li>
        <li>Interlinked smoke and heat alarms in let properties</li>
      </ul>
    `,
  },
  {
    slug: "horsforth",
    name: "Horsforth",
    postcodes: "LS18",
    title: "Electrician in Horsforth, LS18 | Custom Electrics Ltd",
    desc: "Horsforth electrician covering LS18. Rewires, consumer unit upgrades, EV chargers and extension wiring for Victorian and 1930s housing. Fully insured.",
    h1: "Electrician in Horsforth",
    intro: "Horsforth is a short run from Pudsey and somewhere I work regularly — largely because the housing there generates a particular kind of electrical work.",
    body: `
      <h2>Why Horsforth work looks different</h2>
      <p>Horsforth has larger Victorian villas, generous 1930s semis and a lot of houses that have been extended, converted or had the loft done. That is the key thing: extensions and loft conversions add load and circuits to installations that were never designed for them, and it is surprisingly common to find a loft conversion running off a spur from a bedroom socket, or a kitchen extension with the original 1960s consumer unit still doing the work.</p>
      <p>The other consequence of bigger houses is maximum demand. Electric showers, induction hobs, a hot tub and now an <a href="/services/ev-charger-installation/">EV charger</a> on top of an older supply is the point at which somebody needs to do the arithmetic properly rather than hope. I do that assessment before quoting, and more often than not load management solves it without an expensive supply upgrade.</p>

      <h2>Common jobs in Horsforth</h2>
      <ul>
        <li><a href="/services/ev-charger-installation/">EV charger installation</a>, with a proper load assessment</li>
        <li>Wiring for extensions, loft conversions and garden offices</li>
        <li><a href="/services/house-rewires/">Full rewires</a> in Victorian villas that have never had one</li>
        <li><a href="/services/consumer-unit-upgrades/">Consumer unit upgrades</a> to take the added circuits safely</li>
        <li><a href="/services/eicr-landlord-certificates/">EICRs</a> for the student and professional rental market near the university campus</li>
      </ul>
    `,
  },
  {
    slug: "bramley",
    name: "Bramley",
    postcodes: "LS13",
    title: "Electrician in Bramley, LS13 | Custom Electrics Ltd",
    desc: "Bramley electrician covering LS13. Landlord EICRs, fuse board upgrades, fault finding and extra sockets. Based next door in Pudsey.",
    h1: "Electrician in Bramley",
    intro: "Bramley sits between Pudsey and Leeds, so it is on my doorstep. It has a high proportion of rented property, which shapes the work considerably.",
    body: `
      <h2>Bramley's mix</h2>
      <p>Bramley runs from back-to-back terraces through interwar and postwar council-built semis to newer infill. The postwar semis are the ones with the recurring pattern: sound enough cable, but original consumer units, too few sockets, and lighting circuits that have had decades of additions.</p>
      <p>With a lot of LS13 stock in the private rented sector, <a href="/services/eicr-landlord-certificates/">EICRs</a> are the single most common reason I am called. The usual problem is the one the regulations create: a landlord gets an unsatisfactory report from an inspector who does not do remedials, then has 28 days to find someone else who will re-inspect before they will quote. I do both, so the report, the remedial work and the written confirmation come from one place inside the deadline.</p>

      <h2>Common jobs in Bramley</h2>
      <ul>
        <li><a href="/services/eicr-landlord-certificates/">Landlord EICRs</a> and the remedial work to clear them</li>
        <li><a href="/services/consumer-unit-upgrades/">Fuse board upgrades</a> in ex-council semis</li>
        <li>Interlinked smoke and CO alarms to meet letting requirements</li>
        <li><a href="/services/fault-finding/">Fault finding</a> between tenancies</li>
        <li><a href="/services/sockets-lighting-outdoor-power/">Extra sockets</a> in houses built when one per room was normal</li>
      </ul>
    `,
  },
  {
    slug: "leeds",
    name: "Leeds",
    postcodes: "LS1–LS29",
    title: "Electrician in Leeds | Custom Electrics Ltd, Pudsey",
    desc: "Domestic electrician covering Leeds and the LS postcodes. Rewires, consumer units, landlord EICRs, EV chargers and fault finding. City & Guilds qualified.",
    h1: "Electrician in Leeds",
    intro: "I cover Leeds and the surrounding LS postcodes from my base in Pudsey, on the west side of the city. Domestic work is what I do — houses, flats and rented property rather than industrial sites.",
    body: `
      <h2>Where I work in Leeds</h2>
      <p>Mostly the western side: Pudsey, Farsley, Bramley, Horsforth, Armley, Kirkstall, Headingley, Rodley, Calverley, Guiseley, Yeadon, Morley and into the city centre. If you are further east it is still worth a call — give me the postcode and I will let you know.</p>

      <h2>Leeds-specific work</h2>
      <p>Leeds has an enormous private rented sector, and with it a constant demand for <a href="/services/eicr-landlord-certificates/">EICRs</a>. Student housing around Headingley and Hyde Park is generally HMO, which brings tighter requirements — interlinked alarms, emergency lighting in some cases, and inspection intervals that HMO licensing conditions can set shorter than the standard five years. Worth checking your licence rather than assuming five.</p>
      <p>City centre apartments come with their own considerations: landlord-owned risers, management company permissions and limited routes for new cable. Work in a leasehold flat often needs freeholder consent first, so ring me and I will tell you what is involved before anyone books a visit.</p>

      <h2>What I cover</h2>
      <ul>
        <li><a href="/services/consumer-unit-upgrades/">Consumer unit and fuse board upgrades</a></li>
        <li><a href="/services/house-rewires/">Full and partial rewires</a></li>
        <li><a href="/services/eicr-landlord-certificates/">EICRs and landlord safety certificates</a></li>
        <li><a href="/services/ev-charger-installation/">EV charger installation</a></li>
        <li><a href="/services/fault-finding/">Fault finding and repairs</a></li>
        <li><a href="/services/sockets-lighting-outdoor-power/">Sockets, lighting and outdoor power</a></li>
      </ul>
    `,
  },
  {
    slug: "bradford",
    name: "Bradford",
    postcodes: "BD1–BD18",
    title: "Electrician in Bradford | Custom Electrics Ltd",
    desc: "Domestic electrician covering Bradford and BD postcodes from nearby Pudsey. Consumer units, rewires, landlord EICRs and fault finding in stone terraces.",
    h1: "Electrician in Bradford",
    intro: "Bradford is a few minutes west of Pudsey, and I have worked across the BD postcodes for years — several of my reviews come from Bradford customers.",
    body: `
      <h2>Bradford's stone terraces</h2>
      <p>Bradford's defining housing type is the stone through-terrace and back-to-back, much of it Victorian, much of it now rented. Electrically that means solid stone walls with no cavity, so cable is chased or surface run; cellars where the consumer unit often sits in damp conditions; and a lot of installations that have been added to piecemeal across a century.</p>
      <p>The recurring findings are old rubber or fabric-insulated cable surviving on lighting circuits, no earth at the light switches, and boards with a single RCD covering everything — so one fault in an outside light takes out the whole house. Moving to <a href="/services/consumer-unit-upgrades/">RCBOs per circuit</a> is usually the highest-value thing you can do in a house like that.</p>

      <h2>Landlord work</h2>
      <p>With so much of the BD stock let, <a href="/services/eicr-landlord-certificates/">EICRs</a> and their remedials are steady work. Bradford Council enforces the electrical safety regulations like any other authority, and the 28-day window for clearing C1, C2 and FI items is the part that catches landlords out. Doing the inspection and the remedials with one contractor is what keeps you inside it.</p>

      <h2>Areas I cover</h2>
      <p>Thornbury, Laisterdyke, Eccleshill, Idle, Thackley, Shipley, Bingley, Great Horton, Clayton and the city centre among others. As with Leeds, if you are on the far side of the district it is still worth ringing — give me the postcode and the job and I will tell you what I can do.</p>
    `,
  },
];

/* ============================== Reviews ==============================
   Verbatim from Rated People, attributed and linked to the source profile.
   Rated People shows 25 ratings but only these 5 carry written text — the rest
   are scores with no comment. Do NOT add invented reviews here, and do NOT mark
   these up as aggregateRating: Google only permits that for reviews collected by
   the site itself, and marking up a third party's rating risks a manual action. */
const REVIEWS = [
  { name: "Gareth", place: "SK14", date: "2022-05-21", dateLabel: "May 2022", job: "Electrical installation & testing",
    text: "Will was very responsive and pleasant and his work was first class." },
  { name: "Leonard", place: "WA2", date: "2022-05-14", dateLabel: "May 2022", job: "Internal lighting",
    text: "Extremely professional. Quick and efficient. Polite and friendly. Definitely recommended and will use again." },
  { name: "Charlotte", place: "BD14", date: "2022-05-07", dateLabel: "May 2022", job: "Internal lighting",
    text: "Quick reply and completed work fast and gave advice on other jobs too, would recommend." },
  { name: "John", place: "BD16", date: "2022-05-04", dateLabel: "May 2022", job: "Electrical installation & testing",
    text: "Will was excellent. Very professional." },
  { name: "John", place: "HD5", date: "2022-08-02", dateLabel: "August 2022", job: "Internal lighting",
    text: "Excellent service." },
];

/* Enquiry form dropdown. Values are written to leads.service, so they need to
   match the vocabulary the Leads tab in the CRM already uses. */
const SERVICE_OPTIONS = [
  "Fuse board / consumer unit",
  "Rewire",
  "EICR / landlord certificate",
  "EV charger",
  "Fault finding",
  "Sockets & lighting",
  "Outdoor power",
  "Something else",
];

module.exports = { BUSINESS, NAV, ICONS, SERVICES, AREAS, REVIEWS, SERVICE_OPTIONS };

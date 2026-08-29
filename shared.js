"use strict";

/* ============================== Supabase project (Custom Electrics CRM) ==============================
   Dedicated Supabase project for this CRM -- kept separate from the public Arcade/Built Today project
   since this holds real client PII and needs real user auth (Supabase Auth + RLS scoped to auth.uid()),
   not an open anon key. Fill these in once the project is created; nothing below will work until then,
   but the page layout/nav renders fine regardless. */
const SUPABASE_URL = "https://vbhrslysnnhjdhbyhqgm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RWXpmmijx0Gy-AT2h0LUlA_Rgfpl6QM";
const supabaseReady = SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.startsWith("sb_");
const supabaseClient = (supabaseReady && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* ============================== Nav ============================== */
const NAV_ITEMS = [
  { id: "dashboard", href: "dashboard.html", icon: "\u{1F3E0}", label: "Dashboard", short: "Home" },
  { id: "leads", href: "leads.html", icon: "\u{1F9F2}", label: "Leads" },
  { id: "clients", href: "clients.html", icon: "\u{1F465}", label: "Clients" },
  { id: "jobs", href: "jobs.html", icon: "\u{1F6E0}\u{FE0F}", label: "Jobs" },
  { id: "diary", href: "diary.html", icon: "\u{1F4C5}", label: "Diary" },
  { id: "certificates", href: "certificates.html", icon: "\u{1F4C4}", label: "Certificates", short: "Certs" },
  { id: "invoices", href: "invoices.html", icon: "\u{1F9FE}", label: "Invoices", short: "Invoice" },
  { id: "accounts", href: "accounts.html", icon: "\u{1F4B7}", label: "Accounts", short: "Money" },
  { id: "settings", href: "settings.html", icon: "\u{2699}\u{FE0F}", label: "Settings", short: "Set" },
];

function brandMarkHtml() {
  return `
    <a class="brand-mark" href="dashboard.html">
      <span class="brand-badge">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="#EAF3F1"/>
        </svg>
      </span>
      <span class="brand-name">
        <span class="brand-script">Custom</span>
        <span class="brand-caption">Electrics</span>
      </span>
    </a>`;
}

function renderNav(activeId) {
  const sidebarTarget = document.getElementById("sidebarNav");
  const tabBarTarget = document.getElementById("tabBarNav");
  const topbarTarget = document.getElementById("topbarBrand");

  const linksHtml = NAV_ITEMS.map(item => `
    <a class="nav-link${item.id === activeId ? " active" : ""}" href="${item.href}">
      <span class="nav-icon">${item.icon}</span><span>${item.label}</span>
    </a>`).join("");

  if (sidebarTarget) {
    sidebarTarget.innerHTML = `
      ${brandMarkHtml()}
      ${linksHtml}
      <div class="nav-spacer"></div>
      <a class="nav-link logout" href="#" id="sidebarLogoutBtn"><span class="nav-icon">\u{1F6AA}</span><span>Log out</span></a>
    `;
    document.getElementById("sidebarLogoutBtn").addEventListener("click", (e) => { e.preventDefault(); logout(); });
  }

  if (topbarTarget) topbarTarget.innerHTML = brandMarkHtml();

  if (tabBarTarget) {
    // Nine tabs across a phone leaves ~39px each, so the bottom bar uses the short labels.
    const tabItems = NAV_ITEMS.map(item => `
      <a class="nav-link${item.id === activeId ? " active" : ""}" href="${item.href}">
        <span class="nav-icon">${item.icon}</span><span>${item.short || item.label}</span>
      </a>`).join("");
    tabBarTarget.innerHTML = `<div class="tab-bar-row">${tabItems}</div>`;
  }
}

/* ============================== Auth ============================== */
async function requireAuth() {
  if (!supabaseClient) return; // not configured yet -- let pages render unauthenticated during setup
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) window.location.href = "index.html";
}

/* Resolves the signed-in user's business_id via business_members, cached for the page's
   lifetime -- schema is multi-tenant-ready (see custom-electrics-schema.sql), so pages
   look this up rather than hardcoding the single seeded business's id. */
let _cachedBusinessId = null;
async function getCurrentBusinessId() {
  if (_cachedBusinessId) return _cachedBusinessId;
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user) return null;
  const { data, error } = await supabaseClient
    .from("business_members").select("business_id")
    .eq("user_id", userData.user.id).limit(1).single();
  if (error || !data) return null;
  _cachedBusinessId = data.business_id;
  return _cachedBusinessId;
}

async function logout() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

/* ============================== Attachments (photos on invoices/certificates) ==============================
   One shared component for both -- an attachment is the same shape regardless of which record it
   hangs off (see custom-electrics-add-attachments.sql: one `attachments` table, exactly one of
   invoice_id/certificate_id set per row). Storage path convention:
   {business_id}/{invoice|certificate}/{record_id}/{timestamp}-{filename} -- lets the Storage RLS
   policies check business membership straight from the path's first segment, no extra lookup.
   Bucket is PRIVATE, so thumbnails/links use short-lived signed URLs, not public ones -- same
   membership-gated security posture as every table in this app, not security-by-obscure-URL. */
function createAttachmentsManager(containerId, parentColumn) {
  const container = document.getElementById(containerId);
  let parentId = null;
  let items = [];

  function folderFor(id) {
    const kind = parentColumn === "invoice_id" ? "invoice" : "certificate";
    return `${_cachedBusinessId}/${kind}/${id}`;
  }

  async function refresh() {
    if (!parentId) {
      container.innerHTML = `<p class="field-help" style="margin:0;">Save this record first, then you can attach photos.</p>`;
      return;
    }
    container.innerHTML = `<p class="field-help" style="margin:0;">Loading photos…</p>`;
    const { data, error } = await supabaseClient
      .from("attachments").select("*").eq(parentColumn, parentId).order("created_at");
    if (error) {
      container.innerHTML = `<p class="field-help" style="color:var(--danger);margin:0;">Couldn't load photos: ${error.message}</p>`;
      return;
    }
    items = data || [];
    if (!items.length) {
      container.innerHTML = `<p class="field-help" style="margin:0;">No photos yet.</p>`;
      return;
    }
    const thumbs = await Promise.all(items.map(async (a) => {
      const { data: signed } = await supabaseClient.storage.from("attachments").createSignedUrl(a.storage_path, 3600);
      const url = signed ? signed.signedUrl : "";
      const alt = (a.file_name || "photo").replace(/"/g, "");
      return `
        <div class="attachment-thumb" data-attachment="${a.id}">
          <a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${alt}" loading="lazy"></a>
          <button type="button" class="attachment-remove" data-remove-attachment="${a.id}" title="Delete photo">✕</button>
        </div>`;
    }));
    container.innerHTML = `<div class="attachment-grid">${thumbs.join("")}</div>`;
    container.querySelectorAll("[data-remove-attachment]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.removeAttachment;
        const att = items.find(a => a.id === id);
        if (!att) return;
        if (!confirm("Delete this photo? This can't be undone.")) return;
        await supabaseClient.storage.from("attachments").remove([att.storage_path]);
        await supabaseClient.from("attachments").delete().eq("id", id);
        await refresh();
      });
    });
  }

  async function uploadFiles(fileList) {
    if (!parentId) return;
    for (const file of fileList) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${folderFor(parentId)}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabaseClient.storage.from("attachments")
        .upload(path, file, { contentType: file.type });
      if (upErr) { alert(`Couldn't upload ${file.name}: ${upErr.message}`); continue; }
      const { data: userData } = await supabaseClient.auth.getUser();
      const { error: insErr } = await supabaseClient.from("attachments").insert({
        business_id: _cachedBusinessId, [parentColumn]: parentId,
        storage_path: path, file_name: file.name, content_type: file.type, file_size: file.size,
        uploaded_by: userData.user ? userData.user.id : null,
      });
      if (insErr) alert(`Uploaded ${file.name} but couldn't save its record: ${insErr.message}`);
    }
    await refresh();
  }

  return {
    setParent(id) { parentId = id || null; refresh(); },
    async handleFileInput(fileInputEl) {
      if (!fileInputEl.files || !fileInputEl.files.length) return;
      const files = Array.from(fileInputEl.files);
      fileInputEl.disabled = true;
      try { await uploadFiles(files); } finally { fileInputEl.disabled = false; fileInputEl.value = ""; }
    },
  };
}

/* ============================== Searchable select ==============================
   The client list runs to a few hundred names, which a native <select> turns into an
   endless scroll on a phone -- there is no way to type at it. This wraps an existing
   <select> rather than replacing it: the real element stays in the DOM (hidden) and
   still holds the value, so every page's existing `clientSelect.value = ...`, `.value`
   reads and change-listeners keep working with no edits.

   Two details worth keeping:

   - The dropdown renders INLINE, not absolutely positioned. These selects sit inside
     `.modal-card`, which is `overflow-y: auto` and would clip a positioned panel.

   - The element's own `value` property is intercepted so that code doing
     `select.value = id` WITHOUT dispatching a change event (invoices.html and jobs.html
     both do) still updates what the user sees. */
function makeSearchableSelect(selectId, options) {
  options = options || {};
  const select = document.getElementById(selectId);
  if (!select || select.dataset.searchable === "1") return;
  select.dataset.searchable = "1";

  const placeholder = options.placeholder || "Type to search…";
  const emptyLabel = options.emptyLabel || "Nothing matches that";

  const wrap = document.createElement("div");
  wrap.className = "ss-wrap";
  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "ss-trigger";
  trigger.innerHTML = `<span class="ss-current"></span><span class="ss-caret">▾</span>`;

  const panel = document.createElement("div");
  panel.className = "ss-panel hidden";
  panel.innerHTML = `
    <input type="text" class="ss-search" placeholder="${placeholder}" autocomplete="off" autocorrect="off" spellcheck="false">
    <div class="ss-list"></div>`;

  wrap.appendChild(trigger);
  wrap.appendChild(panel);

  const search = panel.querySelector(".ss-search");
  const list = panel.querySelector(".ss-list");

  function syncTrigger() {
    const opt = select.options[select.selectedIndex];
    const label = opt ? opt.textContent.trim() : "";
    const isPlaceholder = !select.value;
    trigger.querySelector(".ss-current").textContent = label || placeholder;
    trigger.classList.toggle("ss-empty", isPlaceholder);
  }

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const opts = [...select.options];
    const matches = opts.filter(o => {
      if (!q) return true;
      // data-search lets a page widen the haystack (address as well as name) without
      // the option's visible label having to carry it.
      const hay = ((o.dataset.search || "") + " " + o.textContent).toLowerCase();
      return q.split(/\s+/).every(term => hay.includes(term));
    });
    if (!matches.length) {
      list.innerHTML = `<div class="ss-none">${emptyLabel}</div>`;
      return;
    }
    list.innerHTML = matches.map(o => `
      <button type="button" class="ss-option${o.value === select.value ? " selected" : ""}" data-value="${encodeURIComponent(o.value)}">
        <span class="ss-option-label">${o.textContent.trim().replace(/[<>&]/g, "")}</span>
        ${o.dataset.sub ? `<span class="ss-option-sub">${o.dataset.sub.replace(/[<>&]/g, "")}</span>` : ""}
      </button>`).join("");

    list.querySelectorAll(".ss-option").forEach(btn => {
      btn.addEventListener("click", () => {
        choose(decodeURIComponent(btn.dataset.value));
      });
    });
  }

  function choose(value) {
    nativeValueSetter.call(select, value);
    syncTrigger();
    close();
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function open() {
    panel.classList.remove("hidden");
    trigger.classList.add("ss-open");
    search.value = "";
    renderList();
    // Focusing immediately on iOS pops the keyboard over the list; the frame's delay
    // lets the panel lay out first so the list is still visible above it.
    requestAnimationFrame(() => search.focus());
  }
  function close() {
    panel.classList.add("hidden");
    trigger.classList.remove("ss-open");
  }

  trigger.addEventListener("click", () => {
    if (panel.classList.contains("hidden")) open(); else close();
  });
  search.addEventListener("input", renderList);
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (e.key === "Enter") {
      e.preventDefault();
      const first = list.querySelector(".ss-option");
      if (first) first.click();
    }
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  // Keep the trigger honest when the page sets the value or repopulates the options.
  const nativeValueSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
  Object.defineProperty(select, "value", {
    configurable: true,
    get() { return Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").get.call(this); },
    set(v) { nativeValueSetter.call(this, v); syncTrigger(); },
  });
  select.addEventListener("change", syncTrigger);
  new MutationObserver(syncTrigger).observe(select, { childList: true });

  /* A hidden <select> carrying `required` makes Chrome refuse to submit with
     "An invalid form control is not focusable" -- and it refuses SILENTLY, so the page just
     looks broken. Drop the attribute and enforce the same rule ourselves, on the visible
     control, rather than leaving the field unvalidated. */
  if (select.required) {
    select.required = false;
    const form = select.form || wrap.closest("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        if (select.value) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        let err = wrap.querySelector(".ss-error");
        if (!err) {
          err = document.createElement("div");
          err.className = "ss-error";
          wrap.appendChild(err);
        }
        err.textContent = options.requiredMessage || "Pick one to carry on.";
        trigger.classList.add("ss-invalid");
        // Guarded: not every webview this runs in implements scrollIntoView, and losing the
        // scroll must not cost the user the validation message itself.
        if (trigger.scrollIntoView) trigger.scrollIntoView({ block: "center", behavior: "smooth" });
        open();
      }, true); // capture, so it runs before the page's own submit handler
      select.addEventListener("change", () => {
        trigger.classList.remove("ss-invalid");
        const err = wrap.querySelector(".ss-error");
        if (err) err.remove();
      });
    }
  }

  syncTrigger();
  return { refresh: syncTrigger };
}

/* Pages call this straight after populating #clientSelect. Kept as its own named helper
   so the "Client *" requirement message stays consistent across all four forms. */
function makeClientSelectSearchable(selectId) {
  return makeSearchableSelect(selectId || "clientSelect", {
    placeholder: "Type a name, street or postcode…",
    emptyLabel: "No customer matches that",
    requiredMessage: "Choose a customer to carry on.",
  });
}

/* ============================== Marketing email templates ==============================
   Shared between clients.html (warm past customers -- by far the cheapest source of rewire
   and consumer-unit work) and leads.html (cold enquiries and trade introductions), so the
   wording only exists once.

   Merge tokens are filled by fillTemplate(): {first_name} {name} {business} {service}
   {amount} {year}. Anything still unfilled is left visible IN BRACES on purpose -- a
   half-merged email that reads "Hi {first_name}" is embarrassing but obvious, whereas
   silently blanking the token produces "Hi ," and gets sent without anyone noticing.

   UK PECR note, which is why every customer-facing template carries an opt-out line: emailing
   PAST customers about similar services is allowed under the soft opt-in, provided each message
   offers an easy way to stop. Emailing strangers who never enquired is not -- so the cold
   templates below are aimed at businesses (letting/estate agents), where B2B marketing is
   permitted, not at householders who haven't been in touch. */
const MARKETING_TEMPLATES = [
  {
    id: "past-check-in",
    label: "Past customer — 6-month check-in",
    audience: "client",
    subject: "Everything still OK with your electrics, {first_name}?",
    body: `Hi {first_name},

{business} here — I did some electrical work for you a while back and I'm just checking in to make sure everything's still running as it should.

A couple of things worth knowing if you haven't had them looked at recently:

• If your fuse board is the old plastic type with rewireable fuses or plain trip switches, it won't have RCD protection. A modern consumer unit with RCBOs is the single biggest safety upgrade most houses can have, and it's usually a one-day job.
• Homeowners are advised to have an EICR (a full electrical inspection) every 10 years, or every 5 if the property is rented out.

If you'd like me to take a look, just reply to this email or give me a ring and I'll come and quote — no charge for the visit.

Thanks,
{business}

If you'd rather I didn't email you again, just reply saying STOP and I'll take you off the list.`,
  },
  {
    id: "fuse-board-offer",
    label: "Past customer — fuse board / consumer unit upgrade",
    audience: "client",
    subject: "Is your fuse board still the old type, {first_name}?",
    body: `Hi {first_name},

{business} here. A quick one — if the fuse board in your house still has rewireable fuses, or trip switches with no RCD test button, it's from before the current wiring regulations and won't cut the power fast enough if someone gets a shock.

Swapping it for a modern consumer unit with RCBOs means:

• Every circuit protected individually — a fault in one doesn't black out the house
• Surge protection for TVs, computers and boilers
• A proper certificate for the work, notified to Building Control

It's normally a single day's work and I'll give you a fixed price before I start. Reply to this email or call me and I'll come and have a look at what you've got.

Thanks,
{business}

If you'd rather I didn't email you again, just reply saying STOP and I'll take you off the list.`,
  },
  {
    id: "eicr-due",
    label: "Landlord — EICR due reminder",
    audience: "client",
    subject: "Your rental EICR is coming up for renewal",
    body: `Hi {first_name},

A reminder that an EICR (Electrical Installation Condition Report) on a rented property in England has to be renewed every 5 years, and a copy given to the tenant within 28 days.

I can do the inspection and, if anything comes back C1, C2 or FI, carry out the remedial work and issue the paperwork at the same time — so you get one contractor, one visit and a compliant certificate rather than chasing two.

If it's easier, send me the addresses and I'll tell you which ones are due.

Thanks,
{business}

If you'd rather I didn't email you again, just reply saying STOP and I'll take you off the list.`,
  },
  {
    id: "letting-agent-intro",
    label: "Letting agent — introduction",
    audience: "trade",
    subject: "Electrician for your managed properties — {business}",
    body: `Hello,

I'm {business}, a registered electrician working across the area, and I'm writing to introduce myself in case you're ever short of a reliable contractor for your managed properties.

What I do for letting agents:

• EICRs, with the certificate emailed the same day
• C1/C2/FI remedial work quoted off the back of the report, so you're not chasing a second contractor
• Consumer unit replacements, smoke and heat alarm installs, EV chargers
• Full and partial rewires on voids

How I work: I quote within 48 hours, I turn up when I say I will, and I deal with tenants directly on access so your office isn't the go-between.

If it would help, I'm happy to do the first EICR at a trial rate so you can see how the paperwork comes back before committing anything.

Best regards,
{business}`,
  },
  {
    id: "estate-agent-intro",
    label: "Estate agent — introduction",
    audience: "trade",
    subject: "Electrical reports and remedials for your sales — {business}",
    body: `Hello,

I'm {business}, a registered electrician working locally. Sales fall through over electrical reports more often than they should, so I wanted to put myself forward as someone you can call when one does.

I can turn round an EICR quickly, quote the remedials plainly enough for both sides to agree who's paying, and get the work certified before completion. Consumer unit changes and partial rewires are bread-and-butter for me.

If you've got a sale stuck on an electrical report right now, send it over and I'll tell you what it would take to clear it.

Best regards,
{business}`,
  },
  {
    id: "new-enquiry-reply",
    label: "New lead — thanks for your enquiry",
    audience: "lead",
    subject: "Thanks for your enquiry — {business}",
    body: `Hi {first_name},

Thanks for getting in touch about {service}.

To give you an accurate price rather than a guess over the phone, I'd like to come and have a quick look — it takes about twenty minutes and there's no charge for it.

Let me know a couple of days and times that suit you and I'll fit in around them. If it's easier to talk it through first, just reply with the best number and time to call.

Thanks,
{business}`,
  },
  {
    id: "quote-follow-up",
    label: "Lead — quote follow-up (no reply)",
    audience: "lead",
    subject: "Following up on your {service} quote",
    body: `Hi {first_name},

Just following up on the quote I sent you for the {service} — I know these things get buried.

The price I gave you ({amount}) still stands, and I've got availability coming up if you'd like to get it booked in.

If you've decided to go elsewhere or park it for now that's absolutely fine — a one-line reply either way just saves me chasing you.

Thanks,
{business}`,
  },
  {
    id: "quote-follow-up-final",
    label: "Lead — final follow-up before closing",
    audience: "lead",
    subject: "Shall I close this off, {first_name}?",
    body: `Hi {first_name},

I've not heard back about the {service}, so I'll assume the timing isn't right and close it off at my end — no problem at all.

If it comes back round later in the year, just reply to this email and I'll pick it straight back up. The quote will need refreshing for material prices, but you won't have to explain the job again.

All the best,
{business}`,
  },
];

/* Unfilled tokens are left visible (see the note above) rather than blanked. */
function fillTemplate(text, values) {
  return (text || "").replace(/\{(\w+)\}/g, (whole, key) => {
    const v = values[key];
    return (v === undefined || v === null || v === "") ? whole : v;
  });
}

function firstNameFrom(fullName) {
  return (fullName || "").trim().split(/\s+/)[0] || "";
}

/* Wires a <select> of templates to a subject input and body textarea. `getValues` is a
   function rather than a plain object so the merge picks up whoever the modal is currently
   pointed at, not whoever it was pointed at when the picker was built. */
function wireTemplatePicker(selectId, subjectId, bodyId, getValues, audiences) {
  const select = document.getElementById(selectId);
  // Guarded because clients.html wires this from inside loadClients(), which re-runs after
  // every save -- without it each save would stack another change listener on the picker.
  if (!select || select.dataset.templatesWired === "1") return;
  select.dataset.templatesWired = "1";
  const list = audiences
    ? MARKETING_TEMPLATES.filter(t => audiences.includes(t.audience))
    : MARKETING_TEMPLATES;
  select.innerHTML = `<option value="">-- Write from scratch --</option>` +
    list.map(t => `<option value="${t.id}">${t.label}</option>`).join("");
  select.addEventListener("change", () => {
    const tpl = list.find(t => t.id === select.value);
    if (!tpl) return;
    const values = getValues() || {};
    document.getElementById(subjectId).value = fillTemplate(tpl.subject, values);
    document.getElementById(bodyId).value = fillTemplate(tpl.body, values);
  });
}

/* ============================== Init (call on every authenticated page) ============================== */
function initAppShell(activeId) {
  renderNav(activeId);
  requireAuth();
}

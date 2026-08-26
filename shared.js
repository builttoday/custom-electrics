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
    // Eight tabs across a phone leaves ~44px each, so the bottom bar uses the short labels.
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

/* ============================== Init (call on every authenticated page) ============================== */
function initAppShell(activeId) {
  renderNav(activeId);
  requireAuth();
}

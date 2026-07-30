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
  { id: "dashboard", href: "dashboard.html", icon: "\u{1F3E0}", label: "Dashboard" },
  { id: "clients", href: "clients.html", icon: "\u{1F465}", label: "Clients" },
  { id: "diary", href: "diary.html", icon: "\u{1F4C5}", label: "Diary" },
  { id: "certificates", href: "certificates.html", icon: "\u{1F4C4}", label: "Certificates" },
  { id: "invoices", href: "invoices.html", icon: "\u{1F9FE}", label: "Invoices" },
  { id: "settings", href: "settings.html", icon: "\u{2699}\u{FE0F}", label: "Settings" },
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
    const tabItems = NAV_ITEMS.map(item => `
      <a class="nav-link${item.id === activeId ? " active" : ""}" href="${item.href}">
        <span class="nav-icon">${item.icon}</span><span>${item.label}</span>
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

/* ============================== Init (call on every authenticated page) ============================== */
function initAppShell(activeId) {
  renderNav(activeId);
  requireAuth();
}

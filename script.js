/* ============ INFINITYcolor ============ */

// ---- Configuración (edita aquí) ----
const WHATSAPP_NUMBER = "59175864344"; // 591 (Bolivia) + 75864344
const BRAND = "INFINITYcolor";

// ---- Servicios (edita nombres, categorías y descripciones) ----
// swatch: navy | blue | sky | white   ·   desc: frase corta bajo el nombre
const PRODUCTS = [
  { id: 1,  name: "Letrero luminoso LED",        cat: "Letreros",            swatch: "navy",  tag: "Popular", desc: "Para que tu local se vea de día y de noche" },
  { id: 2,  name: "Letras corpóreas 3D",         cat: "Letreros",            swatch: "blue",  tag: "",        desc: "Relieve, volumen y presencia en tu fachada" },
  { id: 3,  name: "Letrero en acrílico",         cat: "Letreros",            swatch: "sky",   tag: "",        desc: "Acabado limpio para oficinas y consultorios" },
  { id: 4,  name: "Rótulo en lona y estructura", cat: "Letreros",            swatch: "white", tag: "",        desc: "Letreros grandes, resistentes y económicos" },
  { id: 5,  name: "Gigantografías y vallas",     cat: "Publicidad exterior", swatch: "navy",  tag: "",        desc: "Tu mensaje a gran escala en la calle" },
  { id: 6,  name: "Rotulado de vehículos",       cat: "Publicidad exterior", swatch: "blue",  tag: "Nuevo",   desc: "Tu marca circulando por toda la ciudad" },
  { id: 7,  name: "Vinil en vidrios y vitrinas", cat: "Publicidad exterior", swatch: "sky",   tag: "",        desc: "Atrae miradas desde la vereda" },
  { id: 8,  name: "Banderas y pasacalles",       cat: "Marketing en la calle", swatch: "white", tag: "",      desc: "Presencia visible en ferias y eventos" },
  { id: 9,  name: "Stands y toldos promocionales", cat: "Marketing en la calle", swatch: "navy", tag: "Popular", desc: "Tu punto de contacto directo con la gente" },
  { id: 10, name: "Afiches, volantes y stickers", cat: "Marketing en la calle", swatch: "blue", tag: "",       desc: "Publicidad que la gente toca y recuerda" },
  { id: 11, name: "Contenido orgánico para redes", cat: "Digital",           swatch: "sky",   tag: "A pedido", desc: "Fotos y videos de tu negocio en la vida real" },
  { id: 12, name: "Identidad y diseño de marca", cat: "Digital",             swatch: "navy",  tag: "A pedido", desc: "Logo y piezas que te hacen reconocible" }
];

// ---- Utilidades ----
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : "");

// ---- Estado de la cotización ----
let quote = [];
try { quote = JSON.parse(localStorage.getItem("infinity_quote") || "[]"); } catch (_) { quote = []; }
const save = () => { try { localStorage.setItem("infinity_quote", JSON.stringify(quote)); } catch (_) {} };

// ---- Links de WhatsApp ----
const greet = `Hola ${BRAND}, quiero información.`;
["waCard", "waFooter", "waFloat"].forEach(id => { const a = $("#" + id); if (a) a.href = waLink(greet); });
$("#year").textContent = new Date().getFullYear();

// ---- Catálogo: filtros y render ----
const categories = ["Todo", ...new Set(PRODUCTS.map(p => p.cat))];
let activeCat = "Todo";

function renderFilters() {
  $("#filters").innerHTML = categories
    .map(c => `<button class="chip ${c === activeCat ? "is-active" : ""}" data-cat="${c}" role="tab" aria-selected="${c === activeCat}">${c}</button>`)
    .join("");
}

function renderGrid() {
  const list = activeCat === "Todo" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
  $("#grid").innerHTML = list.map(p => {
    const added = quote.some(q => q.id === p.id);
    return `
      <article class="card reveal">
        <div class="card__img card__img--${p.swatch}">
          ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
          <button class="card__quick ${added ? "is-added" : ""}" data-add="${p.id}">
            ${added ? "✓ En tu cotización" : "Cotizar"}
          </button>
        </div>
        <div class="card__info">
          <div>
            <div class="card__name">${p.name}</div>
            <div class="card__desc">${p.desc}</div>
          </div>
        </div>
      </article>`;
  }).join("");
  observeReveals();
}

$("#filters").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  activeCat = b.dataset.cat;
  renderFilters();
  renderGrid();
});

// Tiles de colecciones aplican filtro
$$(".tile").forEach(t => t.addEventListener("click", () => {
  activeCat = t.dataset.filter || "Todo";
  renderFilters();
  renderGrid();
}));

// ---- Cotización: agregar / quitar ----
$("#grid").addEventListener("click", e => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  const id = Number(b.dataset.add);
  const existing = quote.find(q => q.id === id);
  if (existing) { existing.qty += 1; }
  else {
    const p = PRODUCTS.find(x => x.id === id);
    quote.push({ id: p.id, name: p.name, qty: 1 });
  }
  save();
  renderQuote();
  renderGrid();
  openDrawer();
});

function changeQty(id, delta) {
  const item = quote.find(q => q.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) quote = quote.filter(q => q.id !== id);
  save();
  renderQuote();
  renderGrid();
}

function qItemHTML(q) {
  return `
    <div class="qitem">
      <span>${q.name}</span>
      <span class="qitem__ctrl">
        <button type="button" class="qbtn" data-dec="${q.id}" aria-label="Quitar uno">−</button>
        <b>${q.qty}</b>
        <button type="button" class="qbtn" data-inc="${q.id}" aria-label="Agregar uno">+</button>
      </span>
    </div>`;
}

function renderQuote() {
  const total = quote.reduce((n, q) => n + q.qty, 0);
  $("#cartCount").textContent = total;
  const html = quote.length
    ? quote.map(qItemHTML).join("")
    : `<p class="qempty">Aún no agregaste servicios. Puedes hacerlo desde la sección Servicios.</p>`;
  $("#quoteList").innerHTML = html;
  $("#drawerBody").innerHTML = html;
}

document.addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) changeQty(Number(inc.dataset.inc), +1);
  if (dec) changeQty(Number(dec.dataset.dec), -1);
});

// ---- Drawer ----
const drawer = $("#drawer"), overlay = $("#overlay");
function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}
function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}
$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
$("#drawerGo").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeDrawer(); closeMenu(); } });

// ---- Menú móvil ----
const nav = $("#nav"), menuBtn = $("#menuBtn");
function closeMenu() { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
$$("#nav a").forEach(a => a.addEventListener("click", closeMenu));

// ---- Formulario → WhatsApp ----
$("#quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const err = $("#formError");
  const v = n => f.elements[n].value.trim();
  const name = v("name");
  const type = v("type");

  if (!name || !type) {
    err.textContent = "Completa tu nombre y selecciona qué necesitas.";
    err.hidden = false;
    return;
  }
  err.hidden = true;

  const lines = [
    `Hola ${BRAND}, quiero una cotización.`,
    ``,
    `*Nombre:* ${name}`,
    v("phone") ? `*Teléfono:* ${v("phone")}` : null,
    `*Necesito:* ${type}`,
    v("qty") ? `*Cantidad aprox.:* ${v("qty")}` : null,
    v("size") ? `*Medidas aprox.:* ${v("size")}` : null,
    v("city") ? `*Ciudad / zona:* ${v("city")}` : null,
    v("date") ? `*Fecha requerida:* ${v("date")}` : null,
    v("details") ? `*Detalles:* ${v("details")}` : null
  ].filter(l => l !== null);

  if (quote.length) {
    lines.push("", "*Servicios de interés:*");
    quote.forEach(q => lines.push(`• ${q.name} x${q.qty}`));
  }

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});

// ---- Animación de entrada ----
let io;
function observeReveals() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(el => el.classList.add("is-in")); return; }
  io = io || new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal:not(.is-in)").forEach(el => io.observe(el));
}

// ---- Inicio ----
renderFilters();
renderQuote();
renderGrid();

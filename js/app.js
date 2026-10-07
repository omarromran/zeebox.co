const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const favicon = document.querySelector('link[rel="icon"]');
if (favicon) favicon.href = "logo.jpg";
const money = amount => `${amount.toLocaleString("en-US")} ${BUSINESS_CONFIG.currency}`;
const heroNote = $(".hero-note");
if (heroNote) heroNote.textContent = "Real chocolate. Real butter. Zero overthinking.";
const heroVideo = $(".hero-video");
if (heroVideo) heroVideo.addEventListener("loadeddata", () => heroVideo.classList.add("is-ready"));
const productGrid = $("[data-products]");
productGrid.innerHTML = PRODUCTS.map(product => `<article class="product-card"><div class="product-view" data-view="${product.id}" aria-label="View ${product.name}"><div class="product-image" data-carousel="${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy"><button class="carousel-arrow carousel-prev" type="button" data-carousel-prev="${product.id}" aria-label="Previous photo">‹</button><button class="carousel-arrow carousel-next" type="button" data-carousel-next="${product.id}" aria-label="Next photo">›</button><div class="carousel-dots">${(product.gallery || [product.image]).map((image, index) => `<i class="carousel-dot${index === 0 ? " is-active" : ""}"></i>`).join("")}</div><span>${product.available ? "" : "Sold out"}</span></div><div class="product-meta"><h3>${product.name}</h3><p>${product.description}</p><strong>${money(product.price)}</strong></div></div><button class="add-button" data-add="${product.id}" ${product.available ? "" : "disabled"}>${product.available ? "Add to cart" : "Sold out"}</button></article>`).join("");
productGrid.addEventListener("click", event => { const arrow = event.target.closest("[data-carousel-prev], [data-carousel-next]"); if (arrow) { event.preventDefault(); event.stopPropagation(); const product = PRODUCTS.find(item => item.id === arrow.dataset.carouselPrev || item.id === arrow.dataset.carouselNext); const images = product.gallery || [product.image]; const image = arrow.closest("[data-carousel]").querySelector("img"); let index = images.indexOf(image.getAttribute("src")); index = (index + (arrow.dataset.carouselNext ? 1 : -1) + images.length) % images.length; image.src = images[index]; arrow.closest("[data-carousel]").querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index)); return; } const view = event.target.closest("[data-view]"); if (view) { event.preventDefault(); openProduct(view.dataset.view); } });
const drawer = $(".cart-drawer");
function openCart() { drawer.classList.add("is-open"); $(".drawer-backdrop").classList.add("is-open"); renderCart(); }
function closeCart() { drawer.classList.remove("is-open"); $(".drawer-backdrop").classList.remove("is-open"); }
function openCheckout() { closeCart(); $(".checkout-modal").classList.add("is-open"); $(".modal-backdrop").classList.add("is-open"); renderSummary(); }
function showMobileCartPreview() { let preview = $(".mobile-cart-preview"); if (!preview) { preview = document.createElement("div"); preview.className = "mobile-cart-preview"; document.body.appendChild(preview); } preview.innerHTML = `<div><strong>${Cart.count()} ${Cart.count() === 1 ? "item" : "items"}</strong><span>${money(Cart.total())}</span></div><button class="preview-continue" type="button">Continue shopping</button><button class="button button-dark preview-checkout" type="button">Checkout</button>`; preview.classList.add("is-visible"); preview.onclick = event => { if (!event.target.closest("button")) { preview.classList.remove("is-visible"); openCart(); } }; preview.querySelector(".preview-continue").onclick = () => preview.classList.remove("is-visible"); preview.querySelector(".preview-checkout").onclick = () => { preview.classList.remove("is-visible"); openCheckout(); }; }
function renderCart() { $("[data-cart-count]").textContent = Cart.count(); const items = Cart.detailed(); $("[data-cart-content]").innerHTML = items.length ? `<div class="cart-items">${items.map(item => `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${money(item.price)}</p><div class="qty"><button data-qty="${item.id}" data-delta="-1" aria-label="Decrease quantity">Decrease</button><span>${item.qty}</span><button data-qty="${item.id}" data-delta="1" aria-label="Increase quantity">Increase</button><button class="remove" data-remove="${item.id}">Remove</button></div></div><strong>${money(item.price * item.qty)}</strong></div>`).join("")}</div><div class="cart-total"><span>Subtotal</span><strong>${money(Cart.total())}</strong></div><p class="delivery-note">Delivery fees not included</p><button class="button button-dark full-button" data-checkout>Checkout</button><button class="text-button" data-close-cart>Continue shopping</button>` : `<div class="empty-cart"><h3>Your cart is waiting.</h3><p>Add a box of brownies and make this interesting.</p><button class="button button-dark" data-close-cart>Explore the menu</button></div>`; bindCart(); }
function bindCart() { $$('[data-close-cart]').forEach(button => button.onclick = closeCart); $$('[data-qty]').forEach(button => button.onclick = () => Cart.change(button.dataset.qty, Number(button.dataset.delta))); $$('[data-remove]').forEach(button => button.onclick = () => Cart.remove(button.dataset.remove)); const checkoutButton = $("[data-checkout]"); if (checkoutButton) checkoutButton.onclick = openCheckout; }
function renderSummary() { $("[data-summary]").innerHTML = Cart.detailed().map(item => `<div class="summary-row"><span>${item.name}, quantity ${item.qty}</span><strong>${money(item.price * item.qty)}</strong></div>`).join("") + `<div class="summary-row total-row"><span>Total</span><strong>${money(Cart.total())}</strong></div><p class="delivery-note">Delivery fees not included</p>`; }
function closeCheckout() { $(".checkout-modal").classList.remove("is-open"); $(".modal-backdrop").classList.remove("is-open"); }
Cart.changed = renderCart;
Cart.clearExpired();
renderCart();
if ($(".checkout-page")) renderSummary();
productGrid.addEventListener("click", event => {
  const arrow = event.target.closest("[data-carousel-prev], [data-carousel-next]");
  if (!arrow) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const product = PRODUCTS.find(item => item.id === (arrow.dataset.carouselPrev || arrow.dataset.carouselNext));
  const frame = arrow.closest("[data-carousel]");
  const image = frame.querySelector("img");
  const images = product.gallery || [product.image];
  let index = images.indexOf(image.getAttribute("src"));
  index = (index + (arrow.dataset.carouselNext ? 1 : -1) + images.length) % images.length;
  image.src = images[index];
  frame.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
}, true);
$$('[data-open-cart]').forEach(button => button.onclick = () => button.classList.contains("cart-trigger") ? openCart() : (Cart.count() ? showMobileCartPreview() : openCart()));
$$('[data-close-checkout]').forEach(button => button.onclick = closeCheckout);
$$('[data-add]').forEach(button => button.onclick = () => { Cart.add(button.dataset.add); showMobileCartPreview(); });
const productModal = document.createElement("div");
productModal.className = "product-modal-wrap";
productModal.innerHTML = `<div class="product-modal-backdrop" data-close-product></div><section class="product-modal" role="dialog" aria-modal="true" aria-label="Product details"><button class="icon-button product-close" data-close-product aria-label="Close product details">Close</button><div data-product-detail></div></section>`;
document.body.appendChild(productModal);
function closeProduct() { productModal.classList.remove("is-open"); }
function openProduct(id) { const product = PRODUCTS.find(item => item.id === id); if (!product) return; const recommendations = PRODUCTS.filter(item => item.id !== id).slice(0, 3); $("[data-product-detail]").innerHTML = `<div class="product-detail-main"><img src="${product.image}" alt="${product.name}"><div><p class="eyebrow">${product.pieces || "Freshly baked"}</p><h2>${product.name}</h2><p>${product.description}</p><strong>${money(product.price)}</strong><button class="button button-dark" data-detail-add="${product.id}">Add to cart</button></div></div><div class="recommendations"><p class="eyebrow">You may also like</p><div>${recommendations.map(item => `<button class="recommendation" data-view="${item.id}"><img src="${item.image}" alt="${item.name}"><span>${item.name}</span><strong>${money(item.price)}</strong></button>`).join("")}</div></div>`; productModal.classList.add("is-open"); $("[data-detail-add]").onclick = () => { Cart.add(id); closeProduct(); showMobileCartPreview(); }; $$('[data-view]').forEach(button => button.onclick = () => openProduct(button.dataset.view)); }
$$('[data-view]').forEach(button => button.onclick = () => openProduct(button.dataset.view));
$$('[data-close-product]').forEach(button => button.onclick = closeProduct);
$("#checkout-form").onsubmit = event => { event.preventDefault(); const form = event.target; const data = Object.fromEntries(new FormData(form)); const phone = data.phone.replace(/[\s()-]/g, ""); const error = $("[data-form-error]"); if (!form.checkValidity()) { error.textContent = "Please fill in all required fields."; form.querySelector(":invalid").focus(); return; } if (!/^01[0125]\d{8}$/.test(phone)) { error.textContent = "Please enter a valid Egyptian mobile number."; form.phone.focus(); return; } if (!Cart.detailed().length) { error.textContent = "Your cart is empty."; return; } const orderId = `BR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`; const lines = Cart.detailed().map(item => `- ${item.name}, quantity ${item.qty}, ${money(item.price * item.qty)}`).join("\n"); const message = `NEW ORDER\n\nORDER ${orderId}\n\nCUSTOMER\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nDELIVERY ADDRESS\nGovernorate: ${data.governorate}\nArea: ${data.area}\nStreet: ${data.street}\nBuilding: ${data.building}\nFloor: ${data.floor}\nApartment: ${data.apartment}\n\nORDER\n${lines}\n\nTOTAL: ${money(Cart.total())}\nDelivery fees: Not included${data.notes ? `\n\nNOTES\n${data.notes}` : ""}`; window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`, "_blank"); Cart.scheduleClear(); };
const customizeToggle = $("#customize-sentence");
const customizeField = $("#customization-field");
const customSentence = $("#custom-sentence");
if (customizeToggle) customizeToggle.onchange = () => { customizeField.hidden = !customizeToggle.checked; customSentence.required = customizeToggle.checked; if (!customizeToggle.checked) customSentence.value = ""; };
if (customSentence) customSentence.addEventListener("input", () => { let count = 0; customSentence.value = [...customSentence.value].filter(char => /\s/.test(char) || ++count <= 30).join(""); });
if (customizeToggle) $("#checkout-form").addEventListener("submit", () => {
  if (customizeToggle.checked && customSentence.value) {
    const notes = $("#checkout-form").elements.notes;
    notes.value = `${notes.value ? `${notes.value}\n` : ""}CUSTOM SENTENCE: ${customSentence.value}`;
  }
}, true);
function addProductModalGallery() {
  const product = PRODUCTS.find(item => item.id === $(`[data-detail-add]`)?.dataset.detailAdd);
  const image = $("[data-product-detail] .product-detail-main > img");
  if (!product || !image || image.dataset.galleryReady) return;
  image.dataset.galleryReady = "true";
  image.parentElement.insertAdjacentHTML("beforeend", `<button class="carousel-arrow carousel-prev" type="button" data-modal-prev aria-label="Previous photo">‹</button><button class="carousel-arrow carousel-next" type="button" data-modal-next aria-label="Next photo">›</button>`);
  image.parentElement.dataset.galleryIndex = "0";
  image.parentElement.addEventListener("click", event => {
    const direction = event.target.closest("[data-modal-prev], [data-modal-next]");
    if (!direction) return;
    const images = product.gallery || [product.image];
    let index = Number(image.parentElement.dataset.galleryIndex || 0);
    index = (index + (direction.hasAttribute("data-modal-next") ? 1 : -1) + images.length) % images.length;
    image.parentElement.dataset.galleryIndex = String(index);
    image.src = images[index];
  });
}
const productModalObserver = new MutationObserver(addProductModalGallery);
productModalObserver.observe(productModal, { attributes: true, attributeFilter: ["class"] });

// Keep customization attached to the cart item and send checkout to its own page.
const originalRenderCart = renderCart;
renderCart = function () {
  originalRenderCart();
  Cart.items.forEach((item, index) => {
    const row = $$("[data-cart-content] .cart-item")[index];
    if (row) row.dataset.cartItem = item.id;
    if (row && !row.querySelector("[data-cart-custom]")) row.insertAdjacentHTML("beforeend", `<label class="cart-customization" data-cart-custom>Custom sentence per box <input type="text" maxlength="60" value="${(item.customSentence || "").replaceAll('"', "&quot;")}" placeholder="Optional"></label>`);
  });
};
document.addEventListener("input", event => {
  if (!event.target.matches("[data-cart-custom] input")) return;
  let count = 0;
  event.target.value = [...event.target.value].filter(char => /\s/.test(char) || ++count <= 30).join("");
  const row = event.target.closest("[data-cart-item]");
  const item = Cart.items.find(entry => entry.id === row.dataset.cartItem);
  if (item) { item.customSentence = event.target.value; try { localStorage.setItem("zeebox-cart", JSON.stringify(Cart.items)); } catch {} }
});
document.addEventListener("click", event => {
  if (event.target.closest("[data-checkout]")) { event.preventDefault(); window.location.href = "checkout.html"; }
});
if ($("#checkout-form")) $("#checkout-form").addEventListener("submit", () => {
  const custom = Cart.items.filter(item => item.customSentence).map(item => `- ${item.customSentence} (${item.qty} box${item.qty === 1 ? "" : "es"})`).join("\n");
  if (custom) $("#checkout-form").elements.notes.value = `${$("#checkout-form").elements.notes.value ? `${$("#checkout-form").elements.notes.value}\n` : ""}CUSTOM SENTENCES\n${custom}`;
}, true);
renderCart();

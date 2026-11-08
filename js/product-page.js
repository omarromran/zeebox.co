const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const key = new URLSearchParams(location.search).get("slug") || new URLSearchParams(location.search).get("product") || document.body.dataset.productId;
const product = getProduct(key);
const money = amount => `${Number(amount).toLocaleString("en-US")} ${BUSINESS_CONFIG.currency}`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

if (!product) { document.title = "Product not found | Zee Box"; $(".product-page").innerHTML = '<div class="empty-cart"><h1>Product not found</h1><p>This product link is invalid or no longer available.</p><a class="button button-dark" href="index.html">Back to menu</a></div>'; }
else {
  document.title = `${product.name} | Zee Box`;
  const image = $("[data-product-image]");
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  let galleryIndex = 0;
  gallery.slice(1).forEach(src => { const preload = new Image(); preload.src = src; });
  const show = index => { galleryIndex = (index + gallery.length) % gallery.length; image.classList.add("is-changing"); image.onload = () => image.classList.remove("is-changing"); image.src = gallery[galleryIndex]; $("[data-gallery-dots]").innerHTML = gallery.map((_, i) => `<button type="button" data-gallery-dot="${i}" class="${i === galleryIndex ? "is-active" : ""}" aria-label="Show image ${i + 1}"></button>`).join(""); };
  $("[data-product-name]").textContent = product.name;
  $("[data-product-description]").textContent = product.description;
  $("[data-product-pieces]").textContent = `${product.pieces} brownies per box`;
  $("[data-product-price]").innerHTML = `${money(product.price)} <small>/ box</small>`;
  $("[data-gallery-prev]").onclick = () => show(galleryIndex - 1);
  $("[data-gallery-next]").onclick = () => show(galleryIndex + 1);
  $("[data-gallery-dots]").onclick = event => { if (event.target.dataset.galleryDot !== undefined) show(Number(event.target.dataset.galleryDot)); };

  const renderFields = () => {
    const quantity = Number($("[data-box-qty-value]").textContent);
    const previous = $$('[data-box-sentence]').map(input => input.value);
    const previousAddOns = $$(".box-customization").map(field => [...field.querySelectorAll("[data-box-addon]:checked")].map(input => input.value));
    const max = product.options?.maxMessageLength || 60;
    $("[data-box-fields]").innerHTML = Array.from({ length: quantity }, (_, index) => `<div class="box-customization"><label><span>Box ${index + 1} <small>Optional · this sentence is written on this box</small></span><input data-box-sentence maxlength="${max}" value="${escapeHtml(previous[index] || "")}" placeholder="e.g. Happy Birthday Sarah"></label><fieldset class="addon-field"><legend>Add-ons <small>Choose one · optional · only available with a brownie box</small></legend>${ADD_ONS.map(addOn => `<label class="addon-toggle"><input type="radio" name="addon-box-${index}" data-box-addon value="${addOn.id}" ${previousAddOns[index]?.includes(addOn.id) ? "checked" : ""}><span>${addOn.name} <b>+${money(addOn.price)}</b></span></label>`).join("")}</fieldset></div>`).join("");
    $$('[data-box-addon]').forEach(input => { input.dataset.wasChecked = String(input.checked); input.onclick = () => { if (input.dataset.wasChecked === "true") input.checked = false; $$(`[data-box-addon][name="${input.name}"]`).forEach(option => { option.dataset.wasChecked = String(option.checked); }); }; });
    $("[data-box-total]").textContent = `${quantity} ${quantity === 1 ? "box" : "boxes"} · ${quantity * product.pieces} brownies`;
  };
  $(".box-count").onclick = event => { const button = event.target.closest("[data-box-qty]"); if (!button) return; $("[data-box-qty-value]").textContent = Math.max(1, Math.min(20, Number($("[data-box-qty-value]").textContent) + Number(button.dataset.boxQty))); renderFields(); };
  $("[data-product-add]").onclick = () => { Cart.addBoxes(product.id, $$(".box-customization").map(field => ({ message: field.querySelector("[data-box-sentence]").value, addOns: [...field.querySelectorAll("[data-box-addon]:checked")].map(input => input.value) }))); renderProductCart(); $("[data-cart-count]").textContent = Cart.count(); $(".cart-drawer")?.classList.add("is-open"); $(".drawer-backdrop")?.classList.add("is-open"); };
  show(0); renderFields();
}

function renderProductCart() { const content = $("[data-cart-content]"); if (!content) return; const boxes = Cart.detailed(); content.innerHTML = boxes.length ? `<div class="cart-items">${boxes.map(box => `<div class="cart-item" data-uid="${box.uid}"><img src="${box.product.image}" alt="${escapeHtml(box.product.name)}"><div><h3>${escapeHtml(box.product.name)}</h3><p>${box.product.pieces} brownies · ${money(box.product.price)}</p>${box.addOnItems.length ? `<p class="cart-addons">Add-ons: ${box.addOnItems.map(addOn => `${escapeHtml(addOn.name)} (+${money(addOn.price)})`).join(", ")}</p>` : ""}<label class="cart-customization">${box.message ? "Custom sentence" : "Add a custom sentence"}<input data-product-cart-message maxlength="${box.product.options?.maxMessageLength || 60}" value="${escapeHtml(box.message)}" placeholder="Optional"></label><div class="qty"><button type="button" data-product-cart-qty="-1">−</button><span>1 box</span><button type="button" data-product-cart-qty="1">+</button></div></div><strong>${money(Cart.itemTotal(box))}</strong></div>`).join("")}</div><div class="cart-total"><span>${boxes.length} ${boxes.length === 1 ? "box" : "boxes"}</span><strong>${money(Cart.total())}</strong></div><button type="button" class="button button-dark full-button" data-product-checkout>Checkout</button>` : `<div class="empty-cart"><h3>Your cart is waiting.</h3><p>Add a box of brownies and make it yours.</p></div>`; content.querySelectorAll("[data-product-cart-qty]").forEach(button => button.onclick = () => { Cart.change(button.closest("[data-uid]").dataset.uid, Number(button.dataset.productCartQty)); renderProductCart(); }); content.querySelectorAll("[data-product-cart-message]").forEach(input => input.onchange = () => Cart.update(input.closest("[data-uid]").dataset.uid, input.value)); $("[data-product-checkout]")?.addEventListener("click", () => { location.href = "checkout.html"; }); }
Cart.changed = () => { renderProductCart(); $("[data-cart-count]").textContent = Cart.count(); };
renderProductCart();
$("[data-open-cart]")?.addEventListener("click", () => { renderProductCart(); $(".cart-drawer")?.classList.add("is-open"); $(".drawer-backdrop")?.classList.add("is-open"); });
$$('[data-close-cart]').forEach(button => button.onclick = () => { $(".cart-drawer")?.classList.remove("is-open"); $(".drawer-backdrop")?.classList.remove("is-open"); });

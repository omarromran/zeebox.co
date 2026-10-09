const $ = selector => document.querySelector(selector);
const money = amount => amount.toLocaleString("en-US") + " " + BUSINESS_CONFIG.currency;
const boxes = Cart.detailed();
const summary = boxes.map(box => "<div class=\"summary-row\"><span><strong>" + box.name + "</strong><br><small>" + box.pieces + " brownies · " + (box.sentence ? "“" + box.sentence + "”" : "No custom sentence") + "</small></span><strong>" + money(box.price) + "</strong></div>").join("");
$("[data-summary]").innerHTML = "<p class=\"form-label\">Order summary</p>" + summary + "<div class=\"summary-row total-row\"><span>" + boxes.length + " " + (boxes.length === 1 ? "box" : "boxes") + " · " + Cart.pieces() + " brownies<br>Subtotal<br><small>Delivery fees not included</small></span><strong>" + money(Cart.total()) + "</strong></div>";
$("#checkout-form").onsubmit = event => {
  event.preventDefault(); const form = event.target; const data = Object.fromEntries(new FormData(form)); const error = $("[data-form-error]");
  if (!form.checkValidity()) { error.textContent = "Please complete all required fields."; form.querySelector(":invalid").focus(); return; }
  const phone = data.phone.replace(/[\s()-]/g, ""); if (!/^01[0125]\d{8}$/.test(phone)) { error.textContent = "Please enter a valid Egyptian mobile number."; form.phone.focus(); return; }
  if (!Cart.count()) { error.textContent = "Your cart is empty."; return; }
  const order = boxes.map((box, i) => "*BOX " + (i + 1) + "*\n" + box.name + "\n*Custom Sentence* :- \"" + (box.sentence || "No custom message") + "\"\nPrice: " + money(box.price)).join("\n\n\n");
  const message = "Hello! I'd like to place an order 🍫\n\n*Customer Details*\nName: " + data.name + "\nPhone: " + data.phone + "\nEmail: " + data.email + "\n\n*Delivery Address*\nGovernorate: " + data.governorate + "\nArea: " + data.area + "\nStreet: " + data.street + "\nBuilding: " + data.building + "\nFloor: " + data.floor + "\nApartment: " + data.apartment + (data.notes ? "\nNotes: " + data.notes : "") + "\n\n*Order*\n" + order + "\n\n*Total*\n" + Cart.count() + " " + (Cart.count() === 1 ? "box" : "boxes") + " · " + Cart.pieces() + " brownies\nSubtotal: " + money(Cart.total()) + "\nDelivery: Uber *Covered by the Customer*\n\nThank you! 🤎";
  const breakdown = Object.entries(boxes.reduce((counts, box) => { counts[box.name] = (counts[box.name] || 0) + 1; return counts; }, {})).map(([name, count]) => count + " " + name).join(", ");
  const cleanedMessage = message.replace(/\s*[·•]\s*\d+\s+brownies/gi, "").replace("\nSubtotal:", " - " + breakdown + "\nSubtotal:");
  window.open("https://wa.me/" + BUSINESS_CONFIG.whatsapp + "?text=" + encodeURIComponent(cleanedMessage), "_blank");
};

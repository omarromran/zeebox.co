const CART_KEY = "zeebox-cart", CART_EXPIRY_KEY = "zeebox-cart-expires";
const Cart = {
  items: (() => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } })(),
  save() { try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {} this.changed?.(); },
  scheduleClear() { try { localStorage.setItem(CART_EXPIRY_KEY, String(Date.now() + 300000)); } catch {} },
  clearExpired() { try { if (Number(localStorage.getItem(CART_EXPIRY_KEY)) <= Date.now()) { this.items = []; localStorage.removeItem(CART_KEY); localStorage.removeItem(CART_EXPIRY_KEY); } } catch {} },
  add(id) { const item = this.items.find(i => i.id === id); item ? item.qty++ : this.items.push({ id, qty: 1 }); this.save(); },
  change(id, delta) { const item = this.items.find(i => i.id === id); if (item) item.qty += delta; this.items = this.items.filter(i => i.qty > 0); this.save(); },
  remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); },
  detailed() { return this.items.map(i => ({ ...PRODUCTS.find(p => p.id === i.id), qty: i.qty })).filter(i => i.name && i.available); },
  count() { return this.items.reduce((n, i) => n + i.qty, 0); },
  total() { return this.detailed().reduce((n, i) => n + i.price * i.qty, 0); }
};
Cart.clearExpired();

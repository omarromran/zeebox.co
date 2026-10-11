const CART_KEY = "zeebox-cart";
<<<<<<< HEAD
const makeUid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const normalizeCart = () => { try { const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); if (!Array.isArray(saved)) return []; return saved.flatMap(item => { const product = getProduct(item.productId || item.id); if (!product || !product.available) return []; if (item.uid) return [{ uid: String(item.uid), productId: product.id, message: String(item.message ?? item.sentence ?? item.customSentence ?? "") }]; const quantity = Math.max(1, Math.min(20, Number(item.qty) || 1)); return Array.from({ length: quantity }, () => ({ uid: makeUid(), productId: product.id, message: String(item.message ?? item.sentence ?? item.customSentence ?? "") })); }); } catch { return []; } };
const Cart = { items: normalizeCart(), save() { try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {} this.changed?.(); }, clear() { this.items = []; this.save(); }, addBoxes(productId, messages) { messages.forEach(message => this.items.push({ uid: makeUid(), productId, message: String(message || "").trim() })); this.save(); }, update(uid, message) { const box = this.items.find(item => item.uid === uid); if (box) { box.message = String(message || "").trim(); this.save(); } }, change(uid, delta) { const index = this.items.findIndex(item => item.uid === uid); if (index < 0) return; if (delta > 0) this.items.splice(index + 1, 0, { ...this.items[index], uid: makeUid() }); else if (delta < 0) this.items.splice(index, 1); this.save(); }, remove(uid) { this.items = this.items.filter(item => item.uid !== uid); this.save(); }, detailed() { return this.items.map(item => ({ ...item, product: getProduct(item.productId) })).filter(item => item.product?.available); }, count() { return this.detailed().length; }, pieces() { return this.detailed().reduce((sum, item) => sum + item.product.pieces, 0); }, total() { return this.detailed().reduce((sum, item) => sum + item.product.price, 0); } };
=======
const Cart = {
  items: (() => { try { const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return saved.flatMap(item => item.uid ? [item] : Array.from({ length: item.qty || 1 }, () => ({ uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`, id: item.id, sentence: item.customSentence || "" }))); } catch { return []; } })(),
  save() { try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {} this.changed?.(); },
  clear() { this.items = []; this.save(); },
  addBoxes(id, sentences) { sentences.forEach(sentence => this.items.push({ uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`, id, sentence: sentence.trim() })); this.save(); },
  update(uid, sentence) { const item = this.items.find(box => box.uid === uid); if (item) { item.sentence = sentence.trim(); this.save(); } },
  updateSilently(uid, sentence) { const item = this.items.find(box => box.uid === uid); if (item) { item.sentence = sentence.trim(); try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {} } },
  change(uid, delta) { const index = this.items.findIndex(box => box.uid === uid); if (index < 0) return; if (delta > 0) { const source = this.items[index]; for (let i = 0; i < delta; i++) this.items.splice(index + 1, 0, { ...source, uid: `${Date.now()}-${Math.random().toString(36).slice(2)}` }); } else if (delta < 0) this.items.splice(index, 1); this.save(); },
  remove(uid) { this.items = this.items.filter(box => box.uid !== uid); this.save(); },
  detailed() { return this.items.map(box => ({ ...box, ...PRODUCTS.find(product => product.id === box.id) })).filter(box => box.name && box.available); },
  count() { return this.items.length; },
  pieces() { return this.detailed().reduce((sum, box) => sum + box.pieces, 0); },
  total() { return this.detailed().reduce((sum, box) => sum + box.price, 0); }
};
>>>>>>> 4b8ddaa35141a73b91c3351cda3c5838e38056a3

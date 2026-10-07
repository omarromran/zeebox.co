const CART_KEY = "zeebox-cart";
const Cart = {
  items: (() => { try { const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return saved.flatMap(item => item.uid ? [item] : Array.from({ length: item.qty || 1 }, () => ({ uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`, id: item.id, sentence: item.customSentence || "" }))); } catch { return []; } })(),
  save() { try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {} this.changed?.(); },
  addBoxes(id, sentences) { sentences.forEach(sentence => this.items.push({ uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`, id, sentence: sentence.trim() })); this.save(); },
  update(uid, sentence) { const item = this.items.find(box => box.uid === uid); if (item) { item.sentence = sentence.trim(); this.save(); } },
  change(uid, delta) { const index = this.items.findIndex(box => box.uid === uid); if (index < 0) return; if (delta > 0) { const source = this.items[index]; for (let i = 0; i < delta; i++) this.items.splice(index + 1, 0, { ...source, uid: `${Date.now()}-${Math.random().toString(36).slice(2)}` }); } else if (delta < 0) this.items.splice(index, 1); this.save(); },
  remove(uid) { this.items = this.items.filter(box => box.uid !== uid); this.save(); },
  detailed() { return this.items.map(box => ({ ...box, ...PRODUCTS.find(product => product.id === box.id) })).filter(box => box.name && box.available); },
  count() { return this.items.length; },
  pieces() { return this.count() * 9; },
  total() { return this.detailed().reduce((sum, box) => sum + box.price, 0); }
};

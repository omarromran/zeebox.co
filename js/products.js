// The only product data source used by the storefront.
const ADD_ONS = [
  { id: "golden-hearts", name: "Golden hearts", price: 50 },
  { id: "pink-sprinkles", name: "Pink sprinkles", price: 50 }
];
const PRODUCTS = [
  { id: "brownie-box", slug: "brownie-box", name: "The Brownie Box", description: "A rich, fudgy brownie topped with a generous chocolate drizzle and personalized white chocolate lettering. Customize it with any message you like!", pieces: 9, price: 600, image: "assets/optimized/product 1.jpg", gallery: ["assets/optimized/product 1.jpg", "assets/optimized/bride-turns-25.jpg", "assets/optimized/good-luck-coworkers.jpg", "assets/optimized/graduation.jpg"], available: true, options: { customMessage: true, maxMessageLength: 30 } },
  { id: "yin-yang-box", slug: "yin-yang-box", name: "The Yin-Yang Box", description: "A box of 9 fudgy brownies topped with irresistible chocolate swirls—the perfect balance of two delicious worlds. Add a custom message to make them extra special.", pieces: 9, price: 600, image: "assets/optimized/yin-yang-box.jpg", gallery: ["assets/optimized/yin-yang-box.jpg", "assets/optimized/happy-birthday-yin-yang.jpg"], available: true, options: { customMessage: true, maxMessageLength: 30 } },
  { id: "42-reasons-box", slug: "42-reasons-box", name: "The 42 Reasons Box", description: "42 brownie bites, one box, and plenty to share! Same rich, fudgy goodness in every bite—made for sharing with your favorite people.", pieces: 42, price: 650, image: "assets/optimized/42-reasons-box.jpg", gallery: ["assets/optimized/42-reasons-box.jpg", "assets/optimized/42-reasons-box-birthday.jpg"], available: true, options: { customMessage: true, maxMessageLength: 30 } }
];
const getProduct = key => PRODUCTS.find(product => product.id === key || product.slug === key);

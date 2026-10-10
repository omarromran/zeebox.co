const slugifyProductName = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const PRODUCTS = [{
  id: "brownie-box",
  name: "The Brownie Box",
  description: "A rich, fudgy brownie topped with a generous chocolate drizzle and personalized white chocolate lettering. Customize it with any message you like!",
  pieces: 9,
  price: 600,
  image: "assets/optimized/product 1.jpg",
  gallery: ["assets/optimized/product 1.jpg", "assets/optimized/bride-turns-25.webp", "assets/optimized/good-luck-coworkers.webp", "assets/optimized/graduation.webp"],
  available: true
}, {
  id: "yin-yang-box",
  name: "The Yin-Yang Box",
  description: "A box of 9 fudgy brownies topped with irresistible chocolate swirls—the perfect balance of two delicious worlds. Add a custom message to make them extra special.",
  pieces: 9,
  price: 600,
  image: "assets/optimized/yin-yang-box.webp",
  gallery: ["assets/optimized/yin-yang-box.webp", "assets/optimized/happy-birthday-yin-yang.webp"],
  available: true
}, {
  id: slugifyProductName("The 42 reasons box"),
  name: "The 42 Reasons Box",
  description: "42 brownie bites, one box, and plenty to share! 🍫 Same rich, fudgy goodness in every bite — made for sharing with your favorite people.",
  pieces: 42,
  price: 650,
  image: "assets/optimized/42-reasons-box.webp",
  gallery: ["assets/optimized/42-reasons-box.webp", "assets/optimized/42-reasons-box-birthday.webp"],
  available: true
}];

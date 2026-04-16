const categories = [
  // { name: 'Smartphones', keywords: 'smartphone phone mobile'},
  // { name: 'Laptops', keywords: 'laptop notebook computer' },
  // { name: 'Smart Watches', keywords: 'smart watch fitness watch' },
  // { name: 'Headphones', keywords: 'wireless headphones earbuds' },
  // { name: 'Tablets', keywords: 'tablet ipad android tablet' },
  // { name: 'Monitors', keywords: 'tv monitor 4k monitor' },
  // { name: 'Gaming Accessories', keywords: 'gaming mouse keyboard controller' },
  // { name: 'Cameras', keywords: 'camera gopro dslr canon Nikon' },
  { name: 'Smart Home', keywords: 'smart speaker smart bulb smart switch smart plug' },
  // { name: 'Computer Accessories', keywords: 'usb hub external hard drive' }
];

const variant_categories = {
  Smartphones: ["color", "storage", "ram"],
  Laptops: ["ram", "ssd", "color"],
  Tablets: ["color", "storage"],
  Headphones:[ "color"],
  "Smart Watches": ["size", "color"]
};

module.exports = { categories, variant_categories };
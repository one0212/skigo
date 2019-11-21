const CartItem = require('./CartItem');
const Cart = require('./Cart');

const log = require('../config/winston');
const ProductsDAL = require('../products/ProductsDAL');

export function getCart(req, res) {
  const { items, totalAmt } = req.session.user.cart;
  res.json({ item: Object.values(items), totalAmt });
}

export function addItem(req, res) {
  const { prodId, prodType, qty } = req.body;
  const product = ProductsDAL.findByTableAndId(prodType, prodId);
  if (!product) {
    log.error(`商品不存在. id=${product.id}`);
    return;
  }

  const newItem = new CartItem(product.id, prodType, product.name, qty, product.price);
  const existingItems = Object.values(req.session.user.cart.items) || [];
  const cart = new Cart();
  cart.addItem(newItem);
  existingItems.forEach((item) => {
    cart.addItem(item);
  });
  req.session.user.cart = cart;
  res.sendStatus(200);
}

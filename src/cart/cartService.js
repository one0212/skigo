const CartItem = require('./CartItem');
const Cart = require('./Cart');

const log = require('../config/winston');
const ProductsDAL = require('../products/ProductsDAL');


const toCartItem = (product, prodType, qty) => new CartItem(
  product.id,
  prodType,
  product.name,
  qty,
  product.price,
  product.info,
  product.vendor,
  product.coverImg,
);

export function getCart(req, res) {
  const { items, totalAmt } = req.session.user.cart;
  res.json({ items: Object.values(items), totalAmt });
}

export function addItem(req, res) {
  const { prodId, prodType, qty } = req.body;
  const product = ProductsDAL.findByTableAndId(prodType, prodId);
  if (!product) {
    log.error(`商品不存在. id=${prodId}`);
    return;
  }


  const newItem = toCartItem(product, prodType, qty);
  const existingItems = Object.values(req.session.user.cart.items) || [];
  const cart = new Cart();
  cart.addItem(newItem);
  existingItems.forEach((item) => {
    cart.addItem(item);
  });
  req.session.user.cart = cart;
  res.sendStatus(200);
}

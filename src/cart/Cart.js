const CartItem = require('./CartItem');

class Cart {
  constructor() {
    this.items = {};
    this.totalAmt = 0;
  }

  addItem(item) {
    const key = `${item.prodType}-${item.prodId}`;
    let oldCartItem = this.items[key];
    if (oldCartItem) {
      oldCartItem = new CartItem(
        item.prodId,
        item.prodType,
        item.name,
        item.qty + oldCartItem.qty,
        item.price,
        item.info,
        item.vendor,
        item.coverImg,
        item.totalAmt + oldCartItem.totalAmt,
      );
      this.items[key] = oldCartItem;
    } else {
      this.items[key] = item;
    }
    // console.log(this.items);
    const allItems = Object.values(this.items);
    if (allItems.length === 1) {
      this.totalAmt = allItems[0].totalAmt;
    } else {
      this.totalAmt = allItems.map((v) => v.totalAmt)
        .reduce((a, b) => a + b);
    }
  }
}

module.exports = Cart;

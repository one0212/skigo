const CartItem = require('./CartItem');

class Cart {
  constructor() {
    this.items = {};
    this.totalAmt = 0;
  }

  addItem(item) {
    let oldCartItem = this.items[item.prodId];
    if (oldCartItem) {
      oldCartItem = new CartItem(
        item.prodId,
        item.prodType,
        item.prodName,
        item.qty + oldCartItem.qty,
        item.price,
        item.totalAmt + oldCartItem.totalAmt,
      );
      this.items[item.prodId] = oldCartItem;
    } else {
      this.items[item.prodId] = item;
    }
    // console.log(this.items);
    const allItems = Object.values(this.items);
    if (allItems.length === 1) {
      this.totalAmt = allItems[0].totalAmt;
    } else {
      this.totalAmt = allItems.reduce((a, b) => a.totalAmt + b.totalAmt);
    }
  }
}

module.exports = Cart;

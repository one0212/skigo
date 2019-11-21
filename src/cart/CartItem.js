class CartItem {
  constructor(prodId, prodType, prodName, qty, price) {
    this.prodId = prodId;
    this.prodType = prodType;
    this.prodName = prodName;
    this.qty = qty;
    this.price = price;
    this.totalAmt = price * qty;
  }
}

module.exports = CartItem;

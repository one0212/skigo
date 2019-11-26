class CartItem {
  constructor(prodId, prodType, prodName, qty, price, info, vendor) {
    this.prodId = prodId;
    this.prodType = prodType;
    this.prodName = prodName;
    this.qty = qty;
    this.price = price;
    this.info = info;
    this.vendor = vendor;
    this.totalAmt = price * qty;
  }
}

module.exports = CartItem;

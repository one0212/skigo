class CartItem {
  constructor(prodId, prodType, name, qty, price, info, vendor, coverImg) {
    this.prodId = prodId;
    this.prodType = prodType;
    this.name = name;
    this.qty = qty;
    this.price = price;
    this.info = info;
    this.vendor = vendor;
    this.coverImg = coverImg;
    this.totalAmt = price * qty;
  }
}

module.exports = CartItem;

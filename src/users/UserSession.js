export default class UserSession {
  constructor(email, role, cart = {}) {
    this.email = email;
    this.role = role;
    this.cart = cart;
  }
}

module.exports = UserSession;

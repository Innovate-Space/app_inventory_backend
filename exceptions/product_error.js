class ProductException extends Error {
    constructor(message) {
      super(message);
      this.name = "ProductException";
    }
}

module.exports = ProductException;
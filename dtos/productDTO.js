class productDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
  }
}

export default productDTO;

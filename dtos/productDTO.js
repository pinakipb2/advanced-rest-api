import userDTO from './userDTO';

/* Product "DTO" (Data Transfer Object)
  -> Takes in a Product and returns the necessary Product info
*/
class productDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.addedBy = new userDTO(product.addedBy);
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export default productDTO;

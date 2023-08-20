import { promises as fs } from "fs";

export default class CartManager {

  constructor(path) {
    this.path = path
  }

  async addCart(products);

  async getCartById(id);

  async addProductToCart(carritoId, productId, quantity);
}
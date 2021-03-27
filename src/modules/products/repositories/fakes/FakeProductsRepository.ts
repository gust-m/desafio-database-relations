import { uuid } from 'uuidv4';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id: uuid(),
      name,
      price,
      quantity,
    });

    this.products.push(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProductByName = this.products.find(
      product => product.name === name,
    );

    return findProductByName;
  }

  // public async findAllById(product_id: IFindProducts[]): Promise<Product[]> {
  //   // const findProductsById = this.products.map(
  //   //   product => {
  //   //   };
  //   // );
  //   // return findProductsById;
  // }

  public async updateQuantity(
    data: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const Products = this.products;

    const products = data.map(eachProduct => {
      const productToBeUpdated = Products.find(
        product => eachProduct.id === product.id,
      );

      const productIndex = Products.findIndex(
        product => eachProduct.id === product.id,
      );

      if (!productToBeUpdated) {
        throw new AppError(`Product with id:${eachProduct.id} does not exists`);
      }

      Products[productIndex].quantity += eachProduct.quantity;

      return productToBeUpdated;
    });

    return products;
  }
}

export default FakeProductsRepository;

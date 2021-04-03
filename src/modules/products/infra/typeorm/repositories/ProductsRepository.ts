import { getRepository, In, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProductByName = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProductByName;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existentProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existentProducts;
  }

  public async updateQuantity(
    data: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const Products = await this.ormRepository.find();

    const productsQuantity = data.map(eachProduct => {
      const productToBeUpdated = Products.find(
        product => eachProduct.id === product.id,
      );

      if (!productToBeUpdated) {
        throw new AppError(`Product with id:${eachProduct.id} does not exists`);
      }

      if (productToBeUpdated.quantity - eachProduct.quantity < 0) {
        throw new AppError('There is no sufficient quantities in the stock');
      }

      productToBeUpdated.quantity -= eachProduct.quantity;

      return productToBeUpdated;
    });

    this.ormRepository.save(productsQuantity);

    return productsQuantity;
  }
}

export default ProductsRepository;

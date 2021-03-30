import { getRepository, Repository } from 'typeorm';
// import { In } from 'typeorm';

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

    this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProductByName = await this.ormRepository.findOne({
      where: name,
    });

    return findProductByName;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProductsById: Product[] = [];

    products.map(async product => {
      const productExists = await this.ormRepository.findOne({
        where: product.id,
      });

      if (productExists) {
        findProductsById.push(productExists);
      }
    });

    return findProductsById;
  }

  public async updateQuantity(
    data: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const Products = await this.ormRepository.find();

    const products = data.map(eachProduct => {
      const productToBeUpdated = Products.find(
        product => eachProduct.id === product.id,
      );

      if (!productToBeUpdated) {
        throw new AppError(`Product with id:${eachProduct.id} does not exists`);
      }

      productToBeUpdated.quantity += eachProduct.quantity;

      this.ormRepository.save(productToBeUpdated);

      return productToBeUpdated;
    });

    return products;
  }
}

export default ProductsRepository;

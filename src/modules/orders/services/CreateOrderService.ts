import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('There is no customer with this id');
    }

    const allSelectedProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!allSelectedProducts.length) {
      throw new AppError('There is no products with given ids');
    }

    const productsIds = allSelectedProducts.map(product => product.id);

    const inexistentProducts = products.filter(
      product => !productsIds.includes(product.id),
    );

    if (inexistentProducts.length) {
      const inexistentProductsIds = inexistentProducts.map(
        product => product.id,
      );

      throw new AppError(
        `Can not find the product(s) with the id(s): ${inexistentProductsIds}`,
      );
    }

    // eslint-disable-next-line array-callback-return
    allSelectedProducts.map(product => {
      const productToBeSubtracted = products.filter(p => p.id === product.id);

      if (productToBeSubtracted[0].quantity > product.quantity) {
        throw new AppError('Insufficient product quantity');
      }
    });

    const productsWithPrice = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: allSelectedProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: productsWithPrice,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;

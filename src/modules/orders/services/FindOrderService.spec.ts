import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';

import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

// import AppError from '@shared/errors/AppError';

let createProduct: CreateProductService;
let createCustomer: CreateCustomerService;
let fakeProductsRepository: FakeProductsRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let createOrder: CreateOrderService;
let fakeOrdersRepository: FakeOrdersRepository;
let findOrder: FindOrderService;

describe('FindOrder', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeOrdersRepository = new FakeOrdersRepository();

    findOrder = new FindOrderService(fakeOrdersRepository);
    createProduct = new CreateProductService(fakeProductsRepository);
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to list one specific order', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const order = await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    const response = await findOrder.execute({ id: order.id });

    // expect(response).toEqual(
    //   expect.objectContaining({
    //     customer: expect.objectContaining({
    //       id: customer.id,
    //       name: 'Rocketseat',
    //       email: 'oi@rocketseat.com.br',
    //     }),
    //     order_products: expect.arrayContaining([
    //       expect.objectContaining({
    //         product_id: product.id,
    //         price: '500.00',
    //         quantity: 5,
    //       }),
    //     ]),
    //   }),
    // );

    expect(response).toEqual({
      customer: {
        id: customer.id,
        name: 'Rocketseat',
        email: 'oi@rocketseat.com.br',
      },
      order_products: [
        {
          product_id: product.id,
          price: 500,
          quantity: 5,
        },
      ],
    });
  });
});

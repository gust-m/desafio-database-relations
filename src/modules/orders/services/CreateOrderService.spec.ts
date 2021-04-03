// import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';

import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';
import AppError from '@shared/errors/AppError';

let createProduct: CreateProductService;
let createCustomer: CreateCustomerService;
let fakeProductsRepository: FakeProductsRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let createOrder: CreateOrderService;
let fakeOrdersRepository: FakeOrdersRepository;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeOrdersRepository = new FakeOrdersRepository();

    createProduct = new CreateProductService(fakeProductsRepository);
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const customer = await createCustomer.execute({
      name: 'teste',
      email: 'oi@teste.com.br',
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

    expect(order).toEqual({
      customer: {
        id: customer.id,
        name: 'teste',
        email: 'oi@teste.com.br',
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

  it('should not be able to create an order with a invalid customer', async () => {
    await expect(
      createOrder.execute({
        customer_id: '6a1922c8-af6e-470e-9a34-621cb0643911',
        products: [
          {
            id: '6a1922c8-af6e-470e-9a34-621cb0643911',
            quantity: 5,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with invalid products', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          {
            id: '6a1922c8-af6e-470e-9a34-621cb0643911',
            quantity: 5,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with some invalid products ids', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product1 = await createProduct.execute({
      name: 'Product 01',
      price: 500,
      quantity: 10,
    });

    const product2 = await createProduct.execute({
      name: 'Product 02',
      price: 500,
      quantity: 10,
    });

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          product1,
          product2,
          { id: '69ac1aca-6f8c-4091-8c16-154a6f04e548', quantity: 10 },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with products with insufficient quantities', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          {
            id: product.id,
            quantity: 500,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to subtract an product total quantity when it is ordered', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    let foundProduct = await fakeProductsRepository.findAllById([
      { id: product.id },
    ]);

    expect(foundProduct[0]).toEqual(
      expect.objectContaining({
        quantity: 45,
      }),
    );

    await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 5,
        },
      ],
    });

    foundProduct = await fakeProductsRepository.findAllById([
      { id: product.id },
    ]);

    expect(foundProduct[0]).toEqual(
      expect.objectContaining({
        quantity: 40,
      }),
    );
  });
});

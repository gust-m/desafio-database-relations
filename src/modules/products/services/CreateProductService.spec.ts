import AppError from '@shared/errors/AppError';
import CreateProductService from './CreateProductService';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';

let fakeProductsRepository: FakeProductsRepository;
let createProduct: CreateProductService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProduct = new CreateProductService(fakeProductsRepository);
  });

  it('should be able to create a new product', async () => {
    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    expect(product).toEqual(
      expect.objectContaining({
        name: 'Produto 01',
        price: 500,
        quantity: 50,
      }),
    );
  });

  it('should not be able to create a new product with same name from another', async () => {
    const product = await createProduct.execute({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    expect(product).toEqual(
      expect.objectContaining({
        name: 'Produto 01',
        price: 500,
        quantity: 50,
      }),
    );

    await expect(
      createProduct.execute({
        name: 'Produto 01',
        price: 500,
        quantity: 50,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

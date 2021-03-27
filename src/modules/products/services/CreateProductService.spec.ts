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
      name: 'Keyboard',
      price: 100,
      quantity: 5,
    });

    expect(product).toHaveProperty('name');
    expect(product.name).toBe('Keyboard');
    expect(product.quantity).toBe(5);
  });

  it('should not be able to create a new product with same name from another', async () => {
    await createProduct.execute({
      name: 'Keyboard',
      price: 100,
      quantity: 5,
    });

    await expect(
      createProduct.execute({
        name: 'Keyboard',
        price: 100,
        quantity: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

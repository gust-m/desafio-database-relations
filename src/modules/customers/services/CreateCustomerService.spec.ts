import AppError from '@shared/errors/AppError';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';

let fakeCustomerRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomerRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    expect(customer).toEqual(
      expect.objectContaining({
        name: 'Rocketseat',
        email: 'oi@rocketseat.com.br',
      }),
    );
  });

  it('should not be able to create a new customer with same email from another', async () => {
    const customer = await createCustomer.execute({
      name: 'Rocketseat',
      email: 'oi@rocketseat.com.br',
    });

    expect(customer).toEqual(
      expect.objectContaining({
        name: 'Rocketseat',
        email: 'oi@rocketseat.com.br',
      }),
    );

    await expect(
      createCustomer.execute({
        name: 'Rocketseat',
        email: 'oi@rocketseat.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

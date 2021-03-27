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
      name: 'Gustavo',
      email: 'teste@hotmail.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('Gustavo');
  });

  it('should not be able to create a new customer with same email from another', async () => {
    await createCustomer.execute({
      name: 'Gustavo',
      email: 'teste@hotmail.com',
    });

    await expect(
      createCustomer.execute({
        name: 'Gustavo',
        email: 'teste@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

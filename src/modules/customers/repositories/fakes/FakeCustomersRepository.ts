import { uuid } from 'uuidv4';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, {
      id: uuid(),
      name,
      email,
    });

    this.customers.push(customer);

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomerById = this.customers.find(
      customer => customer.id === id,
    );

    return findCustomerById;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomerByEmail = this.customers.find(
      customer => customer.email === email,
    );

    return findCustomerByEmail;
  }
}

export default FakeCustomersRepository;

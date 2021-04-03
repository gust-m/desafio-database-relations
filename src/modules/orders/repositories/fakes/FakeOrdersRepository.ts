import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '@modules/orders/infra/typeorm/entities/Order';

class OrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, {
      customer,
      order_products: products,
    });

    this.orders.push(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.orders.find(orderRep => id === orderRep.id);

    return order;
  }
}

export default OrdersRepository;

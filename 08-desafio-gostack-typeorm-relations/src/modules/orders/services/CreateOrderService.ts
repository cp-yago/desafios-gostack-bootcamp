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
      throw new AppError(`Customer with id ${customer_id} does not exist`);
    }

    const productsOrder = await this.productsRepository.findAllById(
      products.map(product => {
        return { id: product.id };
      }),
    );

    if (productsOrder.length < 1) {
      throw new AppError('Products in list does not exist');
    }

    products.forEach(({ id, quantity }) => {
      const indexProduct = productsOrder.findIndex(
        product => product.id === id,
      );

      if (quantity > productsOrder[indexProduct].quantity) {
        throw new AppError(
          `Quantity of ${productsOrder[indexProduct].name} insufficient in stock`,
        );
      }
    });

    await this.productsRepository.updateQuantity(products);

    const newAddProducts = productsOrder.map(product => ({
      product_id: product.id,
      price: product.price,
      quantity:
        products[products.findIndex(data => data.id === product.id)].quantity,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: newAddProducts,
    });

    return order;
  }
}

export default CreateOrderService;

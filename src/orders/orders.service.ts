import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderDto: Prisma.OrderCreateInput): Promise<Order> {
    return this.databaseService.order.create({ data: createOrderDto });
  }

  findAll(): Promise<Order[]> {
    return this.databaseService.order.findMany();
  }

  async findOne(id: number): Promise<Order | null> {
    const order = await this.databaseService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: Prisma.OrderUpdateInput): Promise<Order> {
    const existingOrder = await this.findOne(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.databaseService.order.update({ where: { id }, data: updateOrderDto });
  }

  async remove(id: number): Promise<Order> {
    const existingOrder = await this.findOne(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.databaseService.order.delete({ where: { id } });
  }
}

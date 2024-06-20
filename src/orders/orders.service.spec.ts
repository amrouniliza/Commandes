import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let databaseService: DatabaseService;

  const mockOrder: Order = {
    id: 1,
    orderNumber: 'ORD123',
    dateOrdered: new Date(),
    clientId: 1,
    distributorId: 1,
    status: 'Pending',
    totalAmount: 100.0,
    deliveryAddress: '123 Main St',
    paymentMethod: 'Credit Card',
    expectedDelivery: new Date(),
    actualDelivery: new Date(),
    comments: 'Test order',
  };

  const mockDatabaseService = {
    order: {
      create: jest.fn().mockResolvedValue(mockOrder),
      findMany: jest.fn().mockResolvedValue([mockOrder]),
      findUnique: jest.fn().mockResolvedValue(mockOrder),
      update: jest.fn().mockResolvedValue(mockOrder),
      delete: jest.fn().mockResolvedValue(mockOrder),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: Prisma.OrderCreateInput = {
        orderNumber: 'ORD123',
        dateOrdered: new Date(),
        clientId: 1,
        distributorId: 1,
        status: 'Pending',
        totalAmount: 100.0,
        deliveryAddress: '123 Main St',
        paymentMethod: 'Credit Card',
        expectedDelivery: new Date(),
        actualDelivery: new Date(),
        comments: 'Test order',
      };

      expect(await service.create(createOrderDto)).toBe(mockOrder);
      expect(mockDatabaseService.order.create).toHaveBeenCalledWith({ data: createOrderDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      expect(await service.findAll()).toStrictEqual([mockOrder]);
      expect(mockDatabaseService.order.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      expect(await service.findOne(1)).toStrictEqual(mockOrder);
      expect(mockDatabaseService.order.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockDatabaseService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing order', async () => {
      const updateOrderDto: Prisma.OrderUpdateInput = {
        status: 'Completed',
      };

      mockDatabaseService.order.findUnique.mockResolvedValue(mockOrder);
      mockDatabaseService.order.update.mockResolvedValue({
        ...mockOrder,
        ...updateOrderDto,
      });

      expect(await service.update(1, updateOrderDto)).toStrictEqual({
        ...mockOrder,
        ...updateOrderDto,
      });
      expect(mockDatabaseService.order.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateOrderDto });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockDatabaseService.order.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { status: 'Completed' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an order', async () => {
      mockDatabaseService.order.findUnique.mockResolvedValue(mockOrder);

      expect(await service.remove(1)).toStrictEqual(mockOrder);
      expect(mockDatabaseService.order.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockDatabaseService.order.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

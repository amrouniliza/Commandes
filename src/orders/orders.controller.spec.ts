import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(dto => {
      return {
        id: Date.now(),
        ...dto
      };
    }),
    findAll: jest.fn(() => {
      return [];
    }),
    findOne: jest.fn(id => {
      return { id, name: 'Test Order' };
    }),
    update: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
    remove: jest.fn(id => {
      return { id };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService
        }
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const createOrderDto: Prisma.OrderCreateInput = {
      orderNumber: '123',
      clientId: 456, 
      distributorId: 789,
      status: 'pending',
      totalAmount: 0, 
      deliveryAddress: '', 
      paymentMethod: '', 
    };
    expect(await controller.create(createOrderDto)).toEqual({
      id: expect.any(Number),
      ...createOrderDto
    });
    expect(service.create).toHaveBeenCalledWith(createOrderDto);
  });

  it('should return all orders', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one order', async () => {
    const id = '1';
    expect(await controller.findOne(id)).toEqual({
      id: +id,
      name: 'Test Order'
    });
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('should update an order', async () => {
    const id = '1';
    const updateOrderDto: Prisma.OrderCreateInput = {
      orderNumber: '123',
      clientId: 456, 
      distributorId: 789, 
      status: 'pending',
      totalAmount: 0, 
      deliveryAddress: '', 
      paymentMethod: '', 
    };
    expect(await controller.update(id, updateOrderDto)).toEqual({
      id: +id,
      ...updateOrderDto
    });
    expect(service.update).toHaveBeenCalledWith(+id, updateOrderDto);
  });

  it('should remove an order', async () => {
    const id = '1';
    expect(await controller.remove(id)).toEqual({ id: +id });
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const orders = [];
  const orderItems = [];

  for (let i = 0; i < 10; i++) {
    const orderNumber = `ORD-${faker.random.alphaNumeric(8)}`;
    const dateOrdered = faker.date.past();
    const clientId = faker.datatype.number({ min: 1, max: 10 }); // Assuming 10 clients exist
    const distributorId = faker.datatype.number({ min: 1, max: 5 }); // Assuming 5 distributors exist
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const totalAmount = faker.datatype.float({ min: 10, max: 500, precision: 0.01 });
    const deliveryAddress = faker.address.streetAddress();
    const paymentMethods = ['credit card', 'cash', 'paypal'];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const expectedDelivery = faker.date.future();
    const actualDelivery = faker.date.between(dateOrdered, new Date());
    const comments = faker.lorem.sentence();

    const order = await prisma.order.upsert({
      where: { orderNumber },
      update: {},
      create: {
        orderNumber,
        dateOrdered,
        clientId,
        distributorId,
        status,
        totalAmount,
        deliveryAddress,
        paymentMethod,
        expectedDelivery,
        actualDelivery,
        comments,
      },
    });

    orders.push(order);

    const numOrderItems = faker.datatype.number({ min: 1, max: 5 }); // Number of order items per order

    for (let j = 0; j < numOrderItems; j++) {
      const productId = faker.datatype.number({ min: 1, max: 20 }); // Assuming 20 products exist
      const quantity = faker.datatype.number({ min: 1, max: 10 }); // Random quantity

      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
        },
      });

      orderItems.push(orderItem);
    }
  }

  console.log('Inserted orders:', orders.length);
  console.log('Inserted order items:', orderItems.length);
}

main()
  .catch((error) => {
    console.error('Error seeding data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

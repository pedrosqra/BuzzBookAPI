import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { setupApp, closeApp } from './setup';
import {
  AuthDto,
  SignupDto
} from '../src/auth/dto';
import { CreateBookDto } from '../src/book/dto';
import { CreateCategoryDto } from '../src/category/dto';
import {
  CreateOrderDto,
  EditOrderDto
} from '../src/order/dto';

describe('Order e2e', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let bookId: number;
  let categoryId: number;
  let orderId: number;

  beforeAll(async () => {
    const context = await setupApp();
    app = context.app;

    const adminSignupDto: SignupDto = {
      email: 'admin@example.com',
      password: 'Admin1234$',
      firstName: 'Admin',
      lastName: 'User',
      street: 'Sample Street',
      district: 'Sample District',
      postalCode: '58429-014',
      role: 'ADMIN'
    };

    await pactum
      .spec()
      .post('auth/signup')
      .withBody(adminSignupDto)
      .expectStatus(201);

    const adminSigninDto: AuthDto = {
      email: 'admin@example.com',
      password: 'Admin1234$'
    };

    const adminSigninResponse = await pactum
      .spec()
      .post('auth/signin')
      .withBody(adminSigninDto)
      .expectStatus(200);

    adminToken =
      adminSigninResponse.body.accessToken;

    const userSignupDto: SignupDto = {
      email: 'user@example.com',
      password: 'User1234$',
      firstName: 'User',
      lastName: 'Test',
      street: 'Sample Street',
      district: 'Sample District',
      postalCode: '58429-014',
      role: 'USER'
    };

    await pactum
      .spec()
      .post('auth/signup')
      .withBody(userSignupDto)
      .expectStatus(201);

    const userSigninDto: AuthDto = {
      email: 'user@example.com',
      password: 'User1234$'
    };

    const userSigninResponse = await pactum
      .spec()
      .post('auth/signin')
      .withBody(userSigninDto)
      .expectStatus(200);

    userToken =
      userSigninResponse.body.accessToken;

    const categoryDto: CreateCategoryDto = {
      name: 'Sample Category'
    };

    const categoryResponse = await pactum
      .spec()
      .post('category')
      .withBearerToken(adminToken)
      .withBody(categoryDto)
      .expectStatus(201);

    categoryId = categoryResponse.body.data.id;

    const bookDto: CreateBookDto = {
      title: 'Sample Book',
      author: 'Sample Author',
      description: 'Sample Description',
      price: 19.99,
      quantity: 100,
      categoryId
    };

    const bookResponse = await pactum
      .spec()
      .post('books')
      .withBearerToken(adminToken)
      .withBody(bookDto)
      .expectStatus(201);

    bookId = bookResponse.body.data.id;
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('Create Order', () => {
    it('should create an order as admin', async () => {
      const createOrderDto: CreateOrderDto = {
        bookId,
        quantity: 3
      };

      const order = await pactum
        .spec()
        .post('orders')
        .withBearerToken(adminToken)
        .withBody(createOrderDto)
        .expectStatus(201);
      orderId = order.body.data.id;
    });

    it('should create an order as user', async () => {
      const createOrderDto: CreateOrderDto = {
        bookId,
        quantity: 1
      };

      await pactum
        .spec()
        .post('orders')
        .withBearerToken(userToken)
        .withBody(createOrderDto)
        .expectStatus(201);
    });

    it('should fail to delete an order as user who does not own it', async () => {
      await pactum
        .spec()
        .delete(`orders/${orderId}`)
        .withBearerToken(userToken)
        .expectStatus(403);
    });

    it('should delete an order as admin', async () => {
      await pactum
        .spec()
        .delete(`orders/${orderId}`)
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should fail to create an order with insufficient quantity', async () => {
      const createOrderDto: CreateOrderDto = {
        bookId,
        quantity: 2000
      };

      await pactum
        .spec()
        .post('orders')
        .withBearerToken(adminToken)
        .withBody(createOrderDto)
        .expectStatus(400);
    });
  });

  describe('Get Orders', () => {
    let orderId: number;

    beforeEach(async () => {
      const createOrderDto: CreateOrderDto = {
        bookId,
        quantity: 3
      };

      const createOrderResponse = await pactum
        .spec()
        .post('orders')
        .withBearerToken(adminToken)
        .withBody(createOrderDto)
        .expectStatus(201);

      orderId = createOrderResponse.body.data.id;

      await pactum
        .spec()
        .patch(`orders/${orderId}/confirm`)
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should get all orders as admin', async () => {
      const response = await pactum
        .spec()
        .get('orders')
        .withBearerToken(adminToken)
        .expectStatus(200);

      expect(
        response.body.data.length
      ).toBeGreaterThan(0);
    });

    it('should fail to get all orders as user', async () => {
      await pactum
        .spec()
        .get('orders')
        .withBearerToken(userToken)
        .expectStatus(401);
    });

    it('should get an order by id as admin', async () => {
      const response = await pactum
        .spec()
        .get(`orders/${orderId}`)
        .withBearerToken(adminToken)
        .expectStatus(200);

      expect(response.body.data.id).toBe(orderId);
    });

    it('should fail to get an order by id as user who does not own it', async () => {
      await pactum
        .spec()
        .get(`orders/${orderId}`)
        .withBearerToken(userToken)
        .expectStatus(403);
    });
  });

  describe('Edit Order', () => {
    let orderId: number;

    it('should edit an order as admin', async () => {
      const createOrderDto: CreateOrderDto = {
        bookId,
        quantity: 3
      };
      const createOrderResponse = await pactum
        .spec()
        .post('orders')
        .withBearerToken(adminToken)
        .withBody(createOrderDto);
      orderId = createOrderResponse.body.data.id;
      const editOrderDto: EditOrderDto = {
        quantity: 5
      };

      await pactum
        .spec()
        .patch(`orders/${orderId}`)
        .withBearerToken(adminToken)
        .withBody(editOrderDto)
        .expectStatus(200);
    });

    it('should fail to edit an order as user who does not own it', async () => {
      const editOrderDto: EditOrderDto = {
        quantity: 5
      };

      await pactum
        .spec()
        .patch(`orders/${orderId}`)
        .withBearerToken(userToken)
        .withBody(editOrderDto)
        .expectStatus(403);
    });
  });
});

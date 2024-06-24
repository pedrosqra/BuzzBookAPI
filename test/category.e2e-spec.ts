import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { setupApp, closeApp } from './setup';
import {
  AuthDto,
  SignupDto
} from '../src/auth/dto';
import {
  CreateCategoryDto,
  EditCategoryDto
} from '../src/category/dto';

describe('Category e2e', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let categoryId: number;

  beforeAll(async () => {
    const context = await setupApp();
    app = context.app;

    const adminSignupDto: SignupDto = {
      email: 'admin@example.com',
      password: 'Admin1234$',
      firstName: 'Admin',
      lastName: 'User',
      street: 'Admin Street',
      district: 'Admin District',
      postalCode: '58429-014',
      role: 'ADMIN'
    };

    await pactum
      .spec()
      .post('auth/signup')
      .withJson(adminSignupDto)
      .expectStatus(201);

    const adminSigninDto: AuthDto = {
      email: 'admin@example.com',
      password: 'Admin1234$'
    };

    const adminResponse = await pactum
      .spec()
      .post('auth/signin')
      .withJson(adminSigninDto)
      .expectStatus(200);

    adminToken = adminResponse.body.accessToken;

    const userSignupDto: SignupDto = {
      email: 'user@example.com',
      password: 'User1234$',
      firstName: 'User',
      lastName: 'Test',
      street: 'User Street',
      district: 'User District',
      postalCode: '58429-014',
      role: 'USER'
    };

    await pactum
      .spec()
      .post('auth/signup')
      .withJson(userSignupDto)
      .expectStatus(201);

    const userSigninDto: AuthDto = {
      email: 'user@example.com',
      password: 'User1234$'
    };

    const userResponse = await pactum
      .spec()
      .post('auth/signin')
      .withJson(userSigninDto)
      .expectStatus(200);

    userToken = userResponse.body.accessToken;

    const categoryDto: CreateCategoryDto = {
      name: 'Sample Category'
    };

    const categoryResponse = await pactum
      .spec()
      .post('category')
      .withBearerToken(adminToken)
      .withJson(categoryDto)
      .expectStatus(201);

    categoryId = categoryResponse.body.data.id;
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('Create Category', () => {
    it('should create a category as admin', async () => {
      const dto: CreateCategoryDto = {
        name: 'Another Category'
      };

      const response = await pactum
        .spec()
        .post('category')
        .withBearerToken(adminToken)
        .withJson(dto)
        .expectStatus(201);

      categoryId = response.body.data.id;
    });

    it('should fail to create a category as user', async () => {
      const dto: CreateCategoryDto = {
        name: 'Another Category'
      };

      await pactum
        .spec()
        .post('category')
        .withBearerToken(userToken)
        .withJson(dto)
        .expectStatus(401);
    });
  });

  describe('Get Categories', () => {
    it('should get all categories as admin', () => {
      return pactum
        .spec()
        .get('category')
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should get a category by id as admin', () => {
      return pactum
        .spec()
        .get(`category/${categoryId}`)
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should get all categories as user', () => {
      return pactum
        .spec()
        .get('category')
        .withBearerToken(userToken)
        .expectStatus(200);
    });

    it('should get a category by id as user', () => {
      return pactum
        .spec()
        .get(`category/${categoryId}`)
        .withBearerToken(userToken)
        .expectStatus(200);
    });
  });

  describe('Edit Category', () => {
    it('should edit a category as admin', () => {
      const dto: EditCategoryDto = {
        name: 'Updated Category Name'
      };

      return pactum
        .spec()
        .patch(`category/${categoryId}`)
        .withBearerToken(adminToken)
        .withJson(dto)
        .expectStatus(200);
    });

    it('should fail to edit a category as user', () => {
      const dto: EditCategoryDto = {
        name: 'Updated Category Name'
      };

      return pactum
        .spec()
        .patch(`category/${categoryId}`)
        .withBearerToken(userToken)
        .withJson(dto)
        .expectStatus(401);
    });
  });

  describe('Delete Category', () => {
    it('should delete a category as admin', () => {
      return pactum
        .spec()
        .delete(`category/${categoryId}`)
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should fail to delete a category as user', () => {
      return pactum
        .spec()
        .delete(`category/${categoryId}`)
        .withBearerToken(userToken)
        .expectStatus(401);
    });
  });
});

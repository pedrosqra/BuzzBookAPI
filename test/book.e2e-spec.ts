import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { setupApp, closeApp } from './setup';
import {
  AuthDto,
  SignupDto
} from '../src/auth/dto';
import {
  CreateBookDto,
  EditBookDto
} from '../src/book/dto';
import { CreateCategoryDto } from '../src/category/dto';

describe('Book e2e', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let bookId: number;
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
      .withBody(adminSignupDto)
      .expectStatus(201);

    const adminSigninDto: AuthDto = {
      email: 'admin@example.com',
      password: 'Admin1234$'
    };

    const adminResponse = await pactum
      .spec()
      .post('auth/signin')
      .withBody(adminSigninDto)
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
      .withBody(userSignupDto)
      .expectStatus(201);

    const userSigninDto: AuthDto = {
      email: 'user@example.com',
      password: 'User1234$'
    };

    const userResponse = await pactum
      .spec()
      .post('auth/signin')
      .withBody(userSigninDto)
      .expectStatus(200);

    userToken = userResponse.body.accessToken;
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
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('Create Book', () => {
    it('should create a book as admin', async () => {
      const dto: CreateBookDto = {
        title: 'Sample Book',
        author: 'Sample Author',
        description: 'Sample Description',
        price: 19.99,
        quantity: 10,
        categoryId: categoryId
      };

      const response = await pactum
        .spec()
        .post('books')
        .withBearerToken(adminToken)
        .withBody(dto)
        .expectStatus(201);

      bookId = response.body.data.id;
    });

    it('should fail to create a book as user', () => {
      const dto: CreateBookDto = {
        title: 'Sample Book',
        author: 'Sample Author',
        description: 'Sample Description',
        price: 19.99,
        quantity: 10,
        categoryId: categoryId
      };

      return pactum
        .spec()
        .post('books')
        .withBearerToken(userToken)
        .withBody(dto)
        .expectStatus(401);
    });
  });

  describe('Get Books', () => {
    it('should get all books', () => {
      return pactum
        .spec()
        .get('books')
        .withBearerToken(userToken)
        .expectStatus(200);
    });

    it('should get a book by id', () => {
      return pactum
        .spec()
        .get(`books/${bookId}`)
        .withBearerToken(userToken)
        .expectStatus(200);
    });

    it('should get books by category', () => {
      return pactum
        .spec()
        .get(`books/category/${categoryId}`)
        .withBearerToken(userToken)
        .expectStatus(200);
    });

    it('should search books by title', () => {
      return pactum
        .spec()
        .get('books/search')
        .withBearerToken(userToken)
        .withQueryParams('title', 'Sample Book')
        .expectStatus(200);
    });
  });

  describe('Edit Book', () => {
    it('should edit a book as admin', () => {
      const dto: EditBookDto = {
        title: 'Updated Book Title'
      };

      return pactum
        .spec()
        .patch(`books/${bookId}`)
        .withBearerToken(adminToken)
        .withBody(dto)
        .expectStatus(200);
    });

    it('should fail to edit a book as user', () => {
      const dto: EditBookDto = {
        title: 'Updated Book Title'
      };

      return pactum
        .spec()
        .patch(`books/${bookId}`)
        .withBearerToken(userToken)
        .withBody(dto)
        .expectStatus(401);
    });
  });

  describe('Delete Book', () => {
    it('should delete a book as admin', () => {
      return pactum
        .spec()
        .delete(`books/${bookId}`)
        .withBearerToken(adminToken)
        .expectStatus(200);
    });

    it('should fail to delete a book as user', () => {
      return pactum
        .spec()
        .delete(`books/${bookId}`)
        .withBearerToken(userToken)
        .expectStatus(401);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { setupApp, closeApp } from './setup';
import {
  AuthDto,
  SignupDto
} from '../src/auth/dto';

describe('User E2E Tests', () => {
  let app: INestApplication;
  let token: string;
  let userIdOne: number;
  let token2: string;
  let userIdTwo: number;
  let token3: string;
  let userIdThree: number;

  beforeAll(async () => {
    const context = await setupApp();
    app = context.app;
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('User Signup and Signin', () => {
    it('should signup a standard user', async () => {
      const signupDto: SignupDto = {
        email: 'user@example.com',
        password: 'S4f3pa22w0rd$',
        firstName: 'User',
        lastName: 'Test',
        street: '42nd street',
        district: 'Downtown',
        postalCode: '58429-015',
        role: 'ADMIN'
      };

      await pactum
        .spec()
        .post('auth/signup')
        .withBody(signupDto)
        .expectStatus(201);
    });

    it('should signin user', async () => {
      const signinDto: AuthDto = {
        email: 'user@example.com',
        password: 'S4f3pa22w0rd$'
      };

      const response = await pactum
        .spec()
        .post('auth/signin')
        .withBody(signinDto)
        .expectStatus(200)
        .stores('token', 'accessToken');

      token = response.body.accessToken;
      userIdOne = response.body.userId;
    });

    it('should signup another standard user', async () => {
      const signupDto: SignupDto = {
        email: 'user2@example.com',
        password: 'S4f3pa22w0rd$',
        firstName: 'User2',
        lastName: 'Test2',
        street: '43rd street',
        district: 'Uptown',
        postalCode: '58429-016',
        role: 'USER'
      };

      await pactum
        .spec()
        .post('auth/signup')
        .withBody(signupDto)
        .expectStatus(201);
    });

    it('should signin the second user', async () => {
      const signinDto: AuthDto = {
        email: 'user2@example.com',
        password: 'S4f3pa22w0rd$'
      };

      const response = await pactum
        .spec()
        .post('auth/signin')
        .withBody(signinDto)
        .expectStatus(200)
        .stores('token2', 'accessToken');

      token2 = response.body.accessToken;
      userIdTwo = response.body.userId;
    });

    it('should signup yet another standard user', async () => {
      const signupDto: SignupDto = {
        email: 'user3@example.com',
        password: 'S4f3pa22w0rd$',
        firstName: 'User3',
        lastName: 'Test3',
        street: '44th street',
        district: 'Midtown',
        postalCode: '58429-017',
        role: 'USER'
      };

      await pactum
        .spec()
        .post('auth/signup')
        .withBody(signupDto)
        .expectStatus(201);
    });

    it('should signin the third user', async () => {
      const signinDto: AuthDto = {
        email: 'user3@example.com',
        password: 'S4f3pa22w0rd$'
      };

      const response = await pactum
        .spec()
        .post('auth/signin')
        .withBody(signinDto)
        .expectStatus(200)
        .stores('token3', 'accessToken');

      token3 = response.body.accessToken;
      userIdThree = response.body.userId;
    });
  });

  describe('User Get By Id', () => {
    it('should get a user by id if role is ADMIN', async () => {
      await pactum
        .spec()
        .get(`users/${userIdOne}`)
        .withBearerToken(token)
        .expectStatus(200);
    });

    it('should NOT  get a user by id if role is USER', async () => {
      await pactum
        .spec()
        .get(`users/${userIdTwo}`)
        .withBearerToken(token2)
        .expectStatus(401);
    });

    it('should fail to get a user by non-existing id if ADMIN', async () => {
      await pactum
        .spec()
        .get('users/9999')
        .withBearerToken(token)
        .expectStatus(404);
    });

    it('should not allow to get user by id with token from other user', async () => {
      await pactum
        .spec()
        .get(`users/${userIdOne}`)
        .withBearerToken(token2)
        .expectStatus(401);
    });
  });

  describe('User Edit', () => {
    let userId: number;

    beforeAll(async () => {
      const userResponse = await pactum
        .spec()
        .get('users/me')
        .withBearerToken(token)
        .expectStatus(200);

      userId = userResponse.body.id;
    });

    it('should edit a user', async () => {
      const editUserDto = {
        firstName: 'UpdatedFirstName'
      };

      await pactum
        .spec()
        .patch(`users/`)
        .withBearerToken(token)
        .withBody(editUserDto)
        .expectStatus(200);
    });

    it('should fail to edit a user with invalid email', async () => {
      const invalidDto = {
        email: 'invalid-email'
      };

      await pactum
        .spec()
        .patch(`users/`)
        .withBearerToken(token)
        .withBody(invalidDto)
        .expectStatus(400);
    });

    it('should fail to edit a user with invalid first name', async () => {
      const invalidDto = {
        firstName: ''
      };

      await pactum
        .spec()
        .patch(`users/`)
        .withBearerToken(token)
        .withBody(invalidDto)
        .expectStatus(400);
    });

    it('should fail to edit a user with invalid last name', async () => {
      const invalidDto = {
        lastName: ''
      };

      await pactum
        .spec()
        .patch(`users/`)
        .withBearerToken(token)
        .withBody(invalidDto)
        .expectStatus(400);
    });
  });

  describe('User Delete', () => {
    it('should delete a user', async () => {
      await pactum
        .spec()
        .delete(`users/`)
        .withBearerToken(token)
        .expectStatus(200);
    });

    it('should delete a user', async () => {
      await pactum
        .spec()
        .delete(`users/`)
        .withBearerToken(token2)
        .expectStatus(200);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { setupApp, closeApp } from './setup';
import {
  AuthDto,
  SignupDto
} from '../src/auth/dto';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const context = await setupApp();
    app = context.app;
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup a standard user', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });

      it('should NOT signup a user with bad email', async () => {
        const dto: SignupDto = {
          email: 'user@.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with unsafe password', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with empty first name', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: '',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with empty last name', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: '',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with empty street', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with empty district', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: '',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should NOT signup a user with bad postal code', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-5'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(400);
      });

      it('should signup an ADMIN user', async () => {
        const dto: SignupDto = {
          email: 'admin@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'Admin',
          lastName: 'Test',
          street: '5th Avenue',
          district: 'Central',
          postalCode: '58429-015',
          role: 'ADMIN'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });

      it('should NOT signup a user with taken credentials', async () => {
        const dto: SignupDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$',
          firstName: 'User',
          lastName: 'Test',
          street: '42nd street',
          district: 'Downtown',
          postalCode: '58429-015'
        };

        await pactum
          .spec()
          .post('auth/signup')
          .withJson(dto)
          .expectStatus(403);
      });
    });

    describe('Signin', () => {
      it('should signin', async () => {
        const dto: AuthDto = {
          email: 'user@example.com',
          password: 'S4f3pa22w0rd$'
        };

        await pactum
          .spec()
          .post('auth/signin')
          .withJson(dto)
          .expectStatus(200);
      });

      it('should NOT signin with wrong email', async () => {
        const dto: AuthDto = {
          email: 'user@other.com',
          password: 'S4f3pa22w0rd$'
        };

        await pactum
          .spec()
          .post('auth/signin')
          .withJson(dto)
          .expectStatus(403);
      });

      it('should NOT signin with wrong password', async () => {
        const dto: AuthDto = {
          email: 'user@example.com',
          password: 'S4f32w0rd$'
        };

        await pactum
          .spec()
          .post('auth/signin')
          .withJson(dto)
          .expectStatus(403);
      });
    });
  });
});

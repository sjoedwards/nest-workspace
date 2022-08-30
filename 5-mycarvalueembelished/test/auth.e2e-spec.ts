import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Secret, decode, verify } from 'jsonwebtoken';

describe('Authentication System', () => {
  let app: INestApplication;

  const EMAIL = 'test9@test.com';

  beforeEach(async () => {
    // Still creating an app module! It skips the main.ts file
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('signs up as a new user and gets the currently logged in user', async () => {
    const EMAIL = 'test@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: '1234' });

    expect(response.status).toBe(201);
    const accessToken = response.body.access_token;

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(body.email).toEqual(EMAIL);
  });
});

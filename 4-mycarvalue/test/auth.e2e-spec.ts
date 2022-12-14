import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: '1234' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(EMAIL);
      });
  });

  it('signs up as a new user and gets the currently logged in user', async () => {
    const EMAIL = 'test@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: '1234' });

    expect(response.status).toBe(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(EMAIL);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';
import { ReportDTO } from 'src/reports/dtos/report.dto';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { UsersService } from '../src/users/users.service';

describe('Authentication System', () => {
  let app: INestApplication;

  const EMAIL = 'test9@test.com';

  let accessToken: string;

  beforeEach(async () => {
    // Still creating an app module! It skips the main.ts file
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: '1234' });

    accessToken = signupResponse.body.access_token;
  });

  const getCurrentUser = async (): Promise<User> => {
    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Authorization', `Bearer ${accessToken}`);

    return body;
  };

  const postReport = async (
    reportPayload: CreateReportDto,
  ): Promise<request.Response> => {
    return await request(app.getHttpServer())
      .post(`/reports/`)
      .send(reportPayload)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
  };

  it('gets the currently logged in user', async () => {
    const body = await getCurrentUser();
    expect(body.email).toEqual(EMAIL);
  });

  it('gets a user by id', async () => {
    const currentUser = await getCurrentUser();

    const { body } = await request(app.getHttpServer())
      .get(`/users/${currentUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(body.email).toEqual(EMAIL);
  });

  it('deletes a user by id', async () => {
    const currentUser = await getCurrentUser();
    await request(app.getHttpServer())
      .delete(`/users/${currentUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const currentUserAfterDelete = await getCurrentUser();
    expect(currentUserAfterDelete.email).toBeUndefined();
  });

  it('updates a user by id', async () => {
    const NEW_EMAIL = 'test2@test.com';
    const currentUser = await getCurrentUser();
    await request(app.getHttpServer())
      .patch(`/users/${currentUser.id}`)
      .send({ email: NEW_EMAIL })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const currentUserAfterDelete = await getCurrentUser();
    expect(currentUserAfterDelete.email).toEqual(NEW_EMAIL);
  });

  it('posts a new report to a user', async () => {
    const reportPayload: CreateReportDto = {
      make: 'toyota',
      model: 'test',
      year: 2040,
      mileage: 10000,
      lng: 0,
      lat: 0,
      price: 10000,
    };

    const postResponse = await postReport(reportPayload);

    await request(app.getHttpServer())
      .get(`/reports/${postResponse.body.id}`)
      .send(reportPayload)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('authorises a report if the user is an admin ', async () => {
    const reportPayload: CreateReportDto = {
      make: 'toyota',
      model: 'test',
      year: 2040,
      mileage: 10000,
      lng: 0,
      lat: 0,
      price: 10000,
    };
    postReport(reportPayload);
    const currentUser = await getCurrentUser();
    await request(app.getHttpServer())
      .patch(`/reports/${currentUser.id}`)
      .send({ approved: true })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('denies report authoristaion if the user is not an admin ', async () => {
    const usersService = app.get(UsersService);
    const currentUser = await getCurrentUser();
    await usersService.update(currentUser.id, { admin: false });

    await request(app.getHttpServer())
      .patch(`/reports/${currentUser.id}`)
      .send({ approved: true })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});

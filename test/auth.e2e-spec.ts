import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth test (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let adminUser: Object = {
    email: 'ahmed@gmail.com',
    password: 'Aa123456789@',
  };
  let access_token = '';
  it('/ (POST) Login as admin', () => {
    return request(app.getHttpServer())
      .post('/signin')
      .send(adminUser)
      .expect(201)
      .then((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
        access_token = res.body.access_token;
      });
  });

  it('/ (POST) Create organization without token', () => {
    return request(app.getHttpServer())
      .post('/organization')
      .send({})
      .expect(401);
  });

  it('/ (POST) Create organization without token and without data', () => {
    return request(app.getHttpServer())
      .post('/organization')
      .auth(access_token, { type: 'bearer' })
      .send({})
      .expect(500);
  });

  let readOnlyUser: Object = {
    email: 'tarek@gmail.com',
    password: 'Aa123456789@',
  };
let access_token_readonly="";
  it('/ (POST) Login as read-only', () => {
    return request(app.getHttpServer())
      .post('/signin')
      .send(readOnlyUser)
      .expect(201)
      .then((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
        access_token_readonly = res.body.access_token;
      });
  });

  let organizaiton = {
    name: 'org 3',
    description: 'org default description',
  };
  it('/ (POST) Create organization without token and without data', () => {
    return request(app.getHttpServer())
      .post('/organization')
      .auth(access_token_readonly, { type: 'bearer' })
      .send(organizaiton)
      .expect(401)
      
  });
});

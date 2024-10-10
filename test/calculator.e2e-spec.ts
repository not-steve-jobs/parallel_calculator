import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CalculatorController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the correct result for a valid expression', async () => {
    const response = await request(app.getHttpServer())
      .post('/evaluate')
      .send({ expression: '(10+10)/10+1' })
      .expect(200);

    expect(response.body.result).toBe(3);
  });

  it('should return a validation error for an invalid expression', async () => {
    const response = await request(app.getHttpServer())
      .post('/evaluate')
      .send({ expression: '(10+10)/10++1' })
      .expect(400);

    expect(response.body.message).toContain('Invalid expression');
  });

  it('should return a validation error for missing expression', async () => {
    const response = await request(app.getHttpServer())
      .post('/evaluate')
      .send({ expression: '' })
      .expect(400);

    expect(response.body.message).toContain('Invalid expression');
  });

  it('should return a validation error for division by zero', async () => {
    const response = await request(app.getHttpServer())
      .post('/evaluate')
      .send({ expression: '10/0' })
      .expect(400);

    expect(response.body.message).toContain('Invalid expression');
  });
});

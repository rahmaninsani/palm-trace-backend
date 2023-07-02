import supertest from 'supertest';

import web from '../src/applications/web.js';
import { removeTestUser } from './test-util.js';
import logger from '../src/applications/logging.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it('should can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      role: 'koperasi',
      nama: 'Koperasi Test',
      alamat: 'Test',
      nomorTelepon: '123',
      email: 'test@example.com',
      password: 'test',
    });

    expect(result.status).toBe(200);
    expect(result.body.data.koperasi.nama).toBe('Koperasi Test');
    expect(result.body.data.email).toBe('test@example.com');
    expect(result.body.data.role).toBe('koperasi');
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/users').send({
      role: '',
      nama: '',
      alamat: '',
      nomorTelepon: '',
      email: '',
      password: '',
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if email already registered', async () => {
    let result = await supertest(web).post('/api/users').send({
      role: 'koperasi',
      nama: 'Koperasi Test',
      alamat: 'Test',
      nomorTelepon: '123',
      email: 'test@example.com',
      password: 'test',
    });

    logger.info(result.body);

    result = await supertest(web).post('/api/users').send({
      role: 'koperasi',
      nama: 'Koperasi Test',
      alamat: 'Test',
      nomorTelepon: '123',
      email: 'test@example.com',
      password: 'test',
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

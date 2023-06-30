import supertest from 'supertest';

import web from '../src/applications/web.js';
import { removeTestUser } from './test-util.js';

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
});

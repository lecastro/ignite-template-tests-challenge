import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
const user = { name: "test", email: "test@example5023.com", password: "123456" };

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


  it('should be able to get a balance', async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const sessions =
      await request(app)
        .post("/api/v1/sessions")
        .send({
          email: user.email,
          password: user.password
        });

    const { token } = sessions.body;

    const getBalance = await request(app)
      .get("/api/v1/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(getBalance.status).toBe(200);
  });
});

import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
const user = { name: "test", email: "test@example.com", password: "123456" };

describe('init session', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should init session user', async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const response =
      await request(app)
        .post("/api/v1/sessions")
        .send({
          email: user.email,
          password: user.password
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.name).toEqual(user.name);
    expect(response.body.user.email).toEqual(user.email);
    expect(response.body).toHaveProperty("token");
  });
});

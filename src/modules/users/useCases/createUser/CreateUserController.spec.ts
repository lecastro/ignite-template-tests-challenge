import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
const user = { name: "test", email: "test@example.com", password: "123456" };

describe("create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should create nem user', async () => {
    const response =
      await request(app)
        .post("/api/v1/users")
        .send({
          name: user.name,
          email: user.email,
          password: user.password
        });

    expect(response.status).toBe(201);
  });
});

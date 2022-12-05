import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;
const user = { name: "test", email: "test@example123.com", password: "123456" };

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a statement operation", async () => {
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

    const createDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    const { id } = createDeposit.body;

    const getStatementOperation = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(getStatementOperation.status).toBe(200);
  });
});

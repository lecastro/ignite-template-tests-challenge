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

  it("should not be able to create a new withdraw statement with insufficient funds", async () => {
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

    await request(app)
      .post("/api/v1/deposit")
      .send({
        amount: 50,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    const createWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "Withdraw test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(createWithdraw.status).toBe(400);
  });

  it("should be able to create a new deposit statement", async () => {
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

    expect(createDeposit.status).toBe(201);
  });

  it("should be able to create a new withdraw statement", async () => {
    const sessions =
      await request(app)
        .post("/api/v1/sessions")
        .send({
          email: user.email,
          password: user.password
        });

    const { token } = sessions.body;

    await request(app)
      .post("/api/v1/deposit")
      .send({
        amount: 50,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    const createWithdraw = await request(app)
      .post("/api/v1/withdraw")
      .send({
        amount: 10,
        description: "Withdraw test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(createWithdraw.status).toBe(201);
  });
});

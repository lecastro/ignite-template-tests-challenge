import "reflect-metadata";
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe('authenticate user', () => {
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('should authentica new session', async () => {
    const user = { name: "test", email: "test@example.com", password: "123456" };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const
      session = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      });

    expect(user.name).toMatch(session.user.name);
    expect(user.email).toMatch(session.user.email);
    expect(session).toHaveProperty('token');
  });
})

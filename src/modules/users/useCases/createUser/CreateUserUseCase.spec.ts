import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

describe("created new user", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should create new user", async () => {
    const user = { name: "test", email: "test@example.com", password: "123456" };

    const { name, email } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    expect(user).toMatchObject({ name, email });
  })
})

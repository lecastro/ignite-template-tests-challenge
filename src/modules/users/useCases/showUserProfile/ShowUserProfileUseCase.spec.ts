import "reflect-metadata";
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

describe('profile', () => {
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('get profile', async () => {
    const user = { name: "test", email: "test@example.com", password: "123456" };

    const { id } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const profile = await showUserProfileUseCase.execute(String(id));

    expect(user).toMatchObject({ name: profile.name, email: profile.email });

  });
});

import "reflect-metadata";
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

describe('get balance', () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  });

  it('create balance', async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = { name: "test", email: "test@example.com", password: "123456" };
    const deposit1 = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };
    const deposit2 = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };
    const deposit3 = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };

    const { id } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    await createStatementUseCase.execute({
      user_id: String(id),
      type: deposit1.type,
      amount: deposit1.amount,
      description: deposit1.description
    });

    await createStatementUseCase.execute({
      user_id: String(id),
      type: deposit2.type,
      amount: deposit2.amount,
      description: deposit2.description
    });

    await createStatementUseCase.execute({
      user_id: String(id),
      type: deposit3.type,
      amount: deposit3.amount,
      description: deposit3.description
    });

    const getBalance =
      await getBalanceUseCase.execute({ user_id: String(id) });

    expect(getBalance.balance).toEqual(300);
  });
});

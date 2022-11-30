import "reflect-metadata";
import { GetBalanceUseCase } from './../getBalance/GetBalanceUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';

describe('deposit', () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

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

  it('create deposit', async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = { name: "test", email: "test@example.com", password: "123456" };
    const deposit = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };

    const { id } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const result =
      await createStatementUseCase.execute({
        user_id: String(id),
        type: deposit.type,
        amount: deposit.amount,
        description: deposit.description
      });

    expect(result.amount).toEqual(deposit.amount);
    expect(result.description).toEqual(deposit.description);
    expect(result.type).toEqual(deposit.type);
  });

  it('create withdraw', async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = { name: "test", email: "test@example.com", password: "123456" };
    const deposit = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };
    const withdraw = { type: OperationType.WITHDRAW, amount: 10, description: 'send test' };

    const { id } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    await createStatementUseCase.execute({
      user_id: String(id),
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    });

    await createStatementUseCase.execute({
      user_id: String(id),
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description
    });

    const getBalance =
      await getBalanceUseCase.execute({ user_id: String(id) });

    expect(getBalance.balance).toEqual(90);
  });
});

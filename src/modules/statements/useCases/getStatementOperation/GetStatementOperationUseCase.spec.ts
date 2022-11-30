import "reflect-metadata";
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

describe('get statements', () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('should list statements by ids', async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = { name: "test", email: "test@example.com", password: "123456" };
    const deposit1 = { type: OperationType.DEPOSIT, amount: 100, description: 'send test' };

    const { id } =
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const statement =
      await createStatementUseCase.execute({
        user_id: String(id),
        type: deposit1.type,
        amount: deposit1.amount,
        description: deposit1.description
      });

    const
      result = await getStatementOperationUseCase.execute({
        user_id: String(id),
        statement_id: String(statement.id)

      });

    expect(result).toEqual({
      id: statement.id,
      user_id: id,
      type: deposit1.type,
      amount: deposit1.amount,
      description: deposit1.description
    });
  });

});

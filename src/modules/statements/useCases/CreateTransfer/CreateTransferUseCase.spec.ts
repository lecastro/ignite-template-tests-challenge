import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import CreateTransferCaseUse from './CreateTransferUseCase';

describe('transfer', () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createTransferCaseUse: CreateTransferCaseUse;

  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createTransferCaseUse = new CreateTransferCaseUse(inMemoryUsersRepository, inMemoryStatementsRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('create transfer balance between accounts', async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
      TRANSFER = 'transfer'
    }

    const deposit = { type: OperationType.DEPOSIT, amount: 200, description: 'send test' };
    const withdraw = { type: OperationType.WITHDRAW, amount: 100, description: 'send test' };
    const transferValue = { type: OperationType.TRANSFER, "amount": 100, "description": "Descrição da transferência" };

    const userIsSent =
      await createUserUseCase.execute({
        name: 'user1',
        email: 'test2@example.com',
        password: '123456'
      });

    const userWhoIsReceiving =
      await createUserUseCase.execute({
        name: 'user2',
        email: 'test3@example.com',
        password: '123456'
      });

    await createStatementUseCase.execute({
      user_id: String(userIsSent.id),
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    });

    const transfer =
      await createTransferCaseUse.execute({
        user_id: String(userWhoIsReceiving.id),
        sender_id: String(userIsSent.id),
        amount: transferValue.amount,
        description: transferValue.description,
        type: transferValue.type,
      });

    await createStatementUseCase.execute({
      user_id: String(userIsSent.id),
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description
    });

    expect(transfer).toHaveProperty('user_id');
    expect(transfer).toHaveProperty('sender_id');
    expect(transfer).toHaveProperty('type');
    expect(transfer).toHaveProperty('amount');
    expect(transfer).toHaveProperty('description');
  });
});

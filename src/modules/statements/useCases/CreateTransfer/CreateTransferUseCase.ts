import { ICreateTransferDTO } from './ICreateTranserDTO';
import { TransferError } from './TransferError';
import { GetBalanceError } from './../getBalance/GetBalanceError';
import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from './../../repositories/IStatementsRepository';
import { IUsersRepository } from './../../../users/repositories/IUsersRepository';

@injectable()
export default class CreateTransferCaseUse {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) { }

  async execute({ user_id, sender_id, type, amount, description }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetBalanceError();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true
    });

    if (balance > amount) {
      throw new TransferError();
    }

    const statement = await this.statementsRepository.createTransfer({
      user_id, sender_id, type, amount, description
    });

    return statement;
  }
}

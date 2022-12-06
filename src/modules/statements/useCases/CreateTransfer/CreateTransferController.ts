import { Request, Response } from 'express';

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    //const { statement_id } = request.params;

    console.log(user_id);
  }
}

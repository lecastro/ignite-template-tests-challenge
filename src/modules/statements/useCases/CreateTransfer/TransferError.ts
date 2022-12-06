import { AppError } from './../../../../shared/errors/AppError';

export class TransferError extends AppError {
  constructor() {
    super('you have no balance', 404);
  }
}

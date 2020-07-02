import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';

// import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const isuuid = isUuid(id);

    if (!isuuid) {
      throw new AppError('Esse id não é válido');
    }

    const transaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Esse ID não existe');
    } else {
      await transactionsRepository.remove(transaction);
    }

    // const response = await transactionsRepository.find();

    // return response;
  }
}

export default DeleteTransactionService;

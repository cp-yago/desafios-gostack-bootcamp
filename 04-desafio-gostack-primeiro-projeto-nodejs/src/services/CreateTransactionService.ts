import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    if (transaction.type === 'outcome' && transaction.value > total) {
      throw Error('Sorry, outcome is bigger than total');
    }

    return transaction;
  }
}

export default CreateTransactionService;

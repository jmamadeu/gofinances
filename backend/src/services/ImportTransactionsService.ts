import path from 'path';

import Transaction from '../models/Transaction';

import parseCSV from '../utils/parseCSV';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const csvPath = path.resolve(__dirname, '..', '..', 'tmp', file);

    const transactions: Transaction[] = [];

    const transactionsList = await parseCSV(csvPath);

    await Promise.all(
      transactionsList.map(async lineTransaction => {
        const trans = await createTransactionService.execute(lineTransaction);

        transactions.push(trans);
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;

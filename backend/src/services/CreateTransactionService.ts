import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

export interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    ...transactionData
  }: CreateTransactionDTO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const transactionRepositoryBalance = new TransactionsRepository();

    if (
      transactionData.type === 'outcome' &&
      transactionData.value >
        (await transactionRepositoryBalance.getBalance()).total
    ) {
      throw new AppError('Error, balance invalid!');
    }

    let categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryExists = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryExists);
    }

    const transaction = transactionRepository.create({
      ...transactionData,
      category: categoryExists,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transations = await getRepository(Transaction).find();

    const newBalance = transations.reduce(
      (balance, transation): Balance => {
        if (transation.type === 'income')
          balance.income += Number(transation.value);
        else balance.outcome += Number(transation.value);

        balance.total = balance.income - balance.outcome;

        return balance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return newBalance;
  }
}

export default TransactionsRepository;

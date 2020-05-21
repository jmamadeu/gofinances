import { Router } from 'express';
import multer from 'multer';

import { getRepository } from 'typeorm';
import multerConfig from '../configs/multer';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer({ storage: multerConfig });

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = new TransactionsRepository();

  const balance = await transactionsRepository.getBalance();

  const transactions = await getRepository(Transaction).find();

  return response.json({
    balance,
    transactions,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionsService = new CreateTransactionService();

  const transaction = await transactionsService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionsService = new DeleteTransactionService();

  await transactionsService.execute(request.params.id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(
      request.file.filename,
    );

    return response.json(transactions);
  },
);

export default transactionsRouter;

import fs from 'fs';
import csvParse from 'csv-parse';

import { CreateTransactionDTO } from '../services/CreateTransactionService';

export default async function loadCSV(
  filepath: string,
): Promise<CreateTransactionDTO[]> {
  const readCSVStream = fs.createReadStream(filepath);
  const transactionslines: CreateTransactionDTO[] = [];

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  parseCSV.on('data', line => {
    const [title, type, value, category] = line.map((cell: string) =>
      cell.trim(),
    );

    transactionslines.push({ title, type, value, category });
  });

  await new Promise(resolve => parseCSV.on('end', resolve));

  return transactionslines;
}

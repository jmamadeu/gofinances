import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import Category from './Category';

@Entity({ name: 'transactions' })
class Transaction {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('varchar')
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal')
  value: number;

  @ManyToOne(() => Category, category => category.transactions, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}

export default Transaction;

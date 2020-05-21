import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Transaction from './Transaction';

@Entity({ name: 'categories' })
class Category {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('varchar')
  title: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}

export default Category;

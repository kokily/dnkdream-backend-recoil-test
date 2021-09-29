import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  body!: string;

  @Column('text')
  name!: string;

  @Column('text')
  @IsEmail()
  email!: string;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ type: 'boolean', default: false })
  isConfirm!: boolean;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

// src/entity/Product.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "./category";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @Column()
  quantity: number;

  @Column("decimal")
  price: number;

  @Column({ nullable: true })
  supplierInfo: string;

  @Column()
  dateAdded: Date;

  @Column()
  lastUpdated: Date;
}

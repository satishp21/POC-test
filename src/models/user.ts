// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string; // Store hashed passwords in production

  @Column()
  role: string; // 'admin' or 'user'
}

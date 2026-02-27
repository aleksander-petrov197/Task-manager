import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'PENDING' })
  status: string = 'PENDING'


  @Column({type: 'date', nullable: true})
  dueDate: string
  @Column({default: 0})
  position: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User
}
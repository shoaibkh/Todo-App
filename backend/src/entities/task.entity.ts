import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { TaskStatus } from '../utils/task.enum';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    title: string;


    @Column({ nullable: true })
    description?: string;


    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
    status: TaskStatus;


    @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo?: User;


    @Column({ nullable: true })
    assignedToId?: string;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;
}
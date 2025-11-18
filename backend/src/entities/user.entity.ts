import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: string;


    @Column({ unique: true })
    email: string;


    @Column()
    password: string;


    @Column({ nullable: true })
    fullName?: string;


    @Column('simple-array', { default: 'User' })
    roles: string[];


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @OneToMany(() => Task, (task) => task.assignedTo)
    tasks?: Task[];
}
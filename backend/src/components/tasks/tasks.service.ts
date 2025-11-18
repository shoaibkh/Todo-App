import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { TasksGateway } from './tasks.gateway';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private tasksRepo: Repository<Task>,
        private usersService: UsersService,
        private eventsService: EventsService,
        private tasksGateway: TasksGateway,
    ) { }


    async create(dto: CreateTaskDto) {
        try {
            const task = this.tasksRepo.create(dto as any);
            return await this.tasksRepo.save(task);
        } catch (error) {
            throw new NotFoundException(`Error creating task: ${error.message}`);
        }
    }


    async findAll() {
        try {
            return await this.tasksRepo.find({ relations: ['assignedTo'] });
        } catch (error) {
            throw new NotFoundException(`Error finding all tasks: ${error.message}`);
        }
    }


    async findOne(id: string) {
        try {
            const task = await this.tasksRepo.findOne({ where: { id }, relations: ['assignedTo'] });
            if (!task) throw new NotFoundException('Task not found');
            return task;
        } catch (error) {
            throw new NotFoundException(`Error finding task by id ${id}: ${error.message}`);
        }
    }


    async update(id: string, dto: UpdateTaskDto) {
        try {
            await this.tasksRepo.update(id, dto as any);
            const task = await this.findOne(id);
            // emit update event
            this.eventsService.createLog({ type: 'TASK_UPDATED', userId: task.assignedToId, payload: { taskId: id } }).catch(() => null);
            this.tasksGateway.notifyTaskUpdated(task);
            return task;
        } catch (error) {
            throw new NotFoundException(`Error updating task by id ${id}: ${error.message}`);
        }
    }


    async remove(id: string) {
        try {
            const task = await this.findOne(id);
            await this.tasksRepo.remove(task);
            return { deleted: true };
        } catch (error) {
            throw new NotFoundException(`Error removing task by id ${id}: ${error.message}`);
        }
    }


    async assignTask(taskId: string, userId: string) {
        try {
            const user = await this.usersService.findById(userId);
            const task = await this.findOne(taskId);
            task.assignedTo = user as any;
            task.assignedToId = user.id;
            await this.tasksRepo.save(task);

            // Log to Mongo
            await this.eventsService.createLog({ type: 'TASK_ASSIGNED', userId: user.id, payload: { taskId } });

            // Notify via websocket
            this.tasksGateway.notifyTaskAssigned(task);

            return task;
        } catch (error) {
            throw new NotFoundException(`Error assigning task to user: ${error.message}`);
        }
    }
}
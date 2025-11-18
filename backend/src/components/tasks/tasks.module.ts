import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { TasksGateway } from './tasks.gateway';


@Module({
    imports: [TypeOrmModule.forFeature([Task]), UsersModule, EventsModule],
    providers: [TasksService, TasksGateway],
    controllers: [TasksController],
    exports: [TasksService],
})
export class TasksModule { }
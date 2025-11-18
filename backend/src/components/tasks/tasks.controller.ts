import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { JwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { Roles } from '../../authentication/roles.decorator';
import { RolesGuard } from '../../authentication/roles.guard';
import { Role } from '../../utils/roles.enum';


@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    constructor(private tasksService: TasksService) { }


    @Post()
    @Roles(Role.Admin)
    async create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto);
    }


    @Get()
    async findAll() {
        return this.tasksService.findAll();
    }


    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(id, dto);
    }


    @Delete(':id')
    @Roles(Role.Admin)
    async remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }


    @Put(':id/assign/:userId')
    @Roles(Role.Admin)
    async assign(@Param('id') id: string, @Param('userId') userId: string) {
        return this.tasksService.assignTask(id, userId);
    }
}
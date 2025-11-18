import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Task } from '../../entities/task.entity';


@WebSocketGateway({ namespace: '/tasks', cors: true })
export class TasksGateway {
    @WebSocketServer()
    server: Server;


    notifyTaskAssigned(task: Task) {
        // emit to a specific user room if you use rooms: e.g. `user:${task.assignedToId}`
        if (task.assignedToId) this.server.to(`user:${task.assignedToId}`).emit('taskAssigned', task);
        // also broadcast
        this.server.emit('taskAssigned', task);
    }


    notifyTaskUpdated(task: Task) {
        if (task.assignedToId) this.server.to(`user:${task.assignedToId}`).emit('taskUpdated', task);
        this.server.emit('taskUpdated', task);
    }
}
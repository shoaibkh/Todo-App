import { IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../utils/task.enum';


export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;


    @IsOptional()
    @IsString()
    description?: string;


    @IsOptional()
    status?: TaskStatus;
}
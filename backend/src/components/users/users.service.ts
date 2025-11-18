import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) { }


    async create(dto: RegisterDto): Promise<Partial<User>> {
        try {
            const hashed = await bcrypt.hash(dto.password, 10);
            const roles = ['User'];
            const user = this.usersRepo.create({ email: dto.email, password: hashed, fullName: dto.fullName, roles });
            const saved = await this.usersRepo.save(user);
            delete saved.password;
            return saved;
        } catch (error) {
            throw new NotFoundException(`Error creating user: ${error.message}`);
        }
    }


    async findByEmail(email: string) {
        try {
            return await this.usersRepo.findOne({ where: { email } });
        } catch (error) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
    }


    async findById(id: string) {
        try {
            const user = await this.usersRepo.findOne({ where: { id } });
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (error) {
            throw new NotFoundException(`Error finding user by id ${id}: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await this.usersRepo.find({ where: { roles: 'User' } });
        } catch (error) {
            throw new NotFoundException(`Error finding users: ${error.message}`);
        }
    }


    async updateProfile(id: string, payload: Partial<User>): Promise<Partial<User>> {
        try {
            await this.usersRepo.update(id, payload);
            const user = await this.findById(id);
            delete user.password;
            return user;
        } catch (error) {
            throw new NotFoundException(`Error updating user profile: ${error.message}`);
        }
    }
    
}
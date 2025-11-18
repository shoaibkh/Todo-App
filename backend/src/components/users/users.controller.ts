import { Controller, Post, Body, UseGuards, Req, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { UpdateUserDto } from './dto/update.user.dto';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }


    @Post('register')
    async register(@Body() dto: RegisterDto) {
        try {
            const user = await this.usersService.create(dto);
            return await this.authService.login(user);
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }


    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const validated = await this.authService.validateUser(dto.email, dto.password);
            if (!validated) throw new Error('Invalid credentials');
            return this.authService.login(validated);
        } catch (error) {
            throw new Error('Error logging in: ' + error.message);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
        try {
            const user = await this.usersService.updateProfile(req.user.id, dto);
            return await this.authService.login(user);
        } catch (error) {
            throw new Error('Error updating profile: ' + error.message);
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.usersService.findAll();
        } catch (error) {
            throw new Error('Error finding all users: ' + error.message);
        }
    }
}
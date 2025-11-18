import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }


    async validateUser(email: string, pass: string) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) return null;
            const matched = await bcrypt.compare(pass, user.password);
            if (matched) {
                const { password, ...result } = user;
                return result;
            }
        } catch (error) {
            throw new Error(`Error validating user: ${error.message}`);
        }
        return null;
    }


    async login(user: any) {
        try {
            const payload = { email: user.email, sub: user.id, roles: user.roles, fullName: user.fullName };
            return { access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'supersecretkey' }) };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }
}
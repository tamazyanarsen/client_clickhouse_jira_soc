import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }

    private async validateUser(userData: User): Promise<User> {
        return await this.userService.findByEmail(userData.email);
    }

    public async login(user: User): Promise<any | { status: number }> {
        return this.validateUser(user).then((userData) => {
            console.log(user);
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            console.log(user.password, userData.password);
            if (!userData || user.password !== userData.password) {
                return { status: 404 };
            }
            const payload = `${userData.name}${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: 3600,
                access_token: accessToken,
                user_id: payload,
                status: 200,
            };

        });
    }

    public async register(user: User): Promise<any> {
        return this.userService.create(user);
    }

    public validateAccessToken(token: string): boolean{
        try{
            console.log(this.jwtService.verify(token));
            return true;
        } catch (e) {
            return false;
        }
    }
}

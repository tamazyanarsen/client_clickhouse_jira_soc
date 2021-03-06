import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './user.entity';
export declare function validateAccessToken(accessToken: string, jwtService: JwtService): boolean;
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    private validateUser;
    login(user: User): Promise<any | {
        status: number;
    }>;
    register(user: User): Promise<any>;
}

import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(user: User): Promise<any>;
    register(user: User): Promise<any>;
    validateToken(accessToken: string): boolean;
    test(accessToken: string): any;
}

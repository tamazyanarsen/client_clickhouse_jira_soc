import { AuthService } from '../auth.service';
import { User } from '../user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: User): Promise<any>;
    register(user: User): Promise<any>;
    validateToken(accessToken: string): boolean;
}

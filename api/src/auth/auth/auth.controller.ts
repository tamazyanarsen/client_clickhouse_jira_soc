import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(@Body() user: User): Promise<any> {
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }

    @Get('validate/:access_token')
    validateToken(@Param('access_token') accessToken: string): boolean {
        console.log(accessToken);
        return this.authService.validateAccessToken(accessToken);
    }
}

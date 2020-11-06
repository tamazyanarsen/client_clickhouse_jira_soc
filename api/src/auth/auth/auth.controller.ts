import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common';
import {AuthService, validateAccessToken} from '../auth.service';
import {User} from '../user.entity';
import {JwtService} from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly jwtService: JwtService,
    ) {
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

    // @Post('validatetest')
    // @ValidateAccessToken(this.jwtService, 0)
    // test(@Headers('token') accessToken: string): any {
    //     return accessToken;
    // }

    @Post('validatetest')
    test(@Headers('authorization') accessToken: string): any {
        if (validateAccessToken(accessToken, this.jwtService)){
            return accessToken;
        } else {
            return {status: 401};
        }
    }
}

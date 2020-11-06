import {Headers, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from './user.service';
import {User} from './user.entity';
import * as crypto from 'crypto';

// export function ValidateAccessTokenDecor(
//         target: any,
//         methodName: string,
//         descriptor?: PropertyDescriptor,
//     ) {
//         try {
//             const originalMethod = descriptor.value;
//             descriptor.value = (...args: any[]) => {
//                 const jwtService: JwtService = args.filter((el) => {
//                     return el instanceof JwtService;
//                 })[0];
//                 const token: string = args.filter((el) => {
//                     return typeof el === 'string';
//                 })[0];
//                 jwtService.verify(token);
//                 return originalMethod;
//             };
//         } catch (e) {
//             descriptor.value = (...args: any[]) => {
//                 return {status: 401};
//             };
//         }
//     }

export function validateAccessToken(accessToken: string, jwtService: JwtService): boolean {
    try {
        jwtService.verify(accessToken);
        return true;
    } catch (e) {
        return false;
    }
}

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
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            if (!userData || user.password !== userData.password) {
                return {status: 401};
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

}

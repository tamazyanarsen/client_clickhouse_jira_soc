import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        try {
            this.create({ email: 'admin@admin.ru', password: 'admin' } as User).then();
        } catch (e) {
            console.log(e);
        }
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async findById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async create(user: User): Promise<{ id, name }> {
        user.password = crypto.createHmac('sha256', user.password).digest('hex');
        const resultUser = await this.userRepository.save(user);
        return { id: resultUser.id, name: resultUser.name };
    }
}

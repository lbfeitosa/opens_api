import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/user.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUserByPassword(loginAttempt: LoginUserDto) {
        const userToAttempt = await this.usersService.findOneByEmail(
            loginAttempt.email,
        );
        const isMatch = await bcrypt.compare(
            loginAttempt.password,
            userToAttempt.password,
        );
        
        if (isMatch) {
            return this.createJwtPayload(userToAttempt);
        } else {
            throw new UnauthorizedException();
        }
    }

    createJwtPayload(user: any) {
        const data: any = {
            id: user._id,
            email: user.email,
            name: user.name,
            master: user.isMaster
        };

        const jwt = this.jwtService.sign(data, { secret: user.isMaster ? process.env.MASTER_SECRET : process.env.DEFAULT_SECRET });

        return {
            user: data,
            expiresIn: 3600,
            accessToken: jwt,
        };
    }

    async validateUserByJwt(payload: any) {
        const user = await this.usersService.findOneByEmail(payload.email);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }    
}

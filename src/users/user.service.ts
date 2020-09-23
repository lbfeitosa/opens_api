import { User } from './user.interface';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, Users } from './user.dto';

@Injectable()
export class UserService {

    constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto) {
        if (await this.findOneByEmail(createUserDto.email)) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Usuário/email já existe',
            }, HttpStatus.FORBIDDEN);
        } else {
            createUserDto.password = await this.createNewPasswordHash(createUserDto.password);
            return await new this.userModel(createUserDto).save();
        }

    }

    async findOneByEmail(email): Promise<any> {
        return await this.userModel.findOne({ email }).lean().exec();
    }

    async update(userID: string, userDto: User): Promise<User> {
        if (userDto.password) {
          userDto.password = await this.createNewPasswordHash(userDto.password);
        }
        return await this.userModel.findByIdAndUpdate(userID, { $set: userDto }, {
            new: true, useFindAndModify: false, 
        });
    }

    async deleteById(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }

    async getById(userId: string): Promise<Users> {
        return await this.userModel.findById(userId).lean().exec();
    }

    async createNewPasswordHash(pass) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(pass, salt);
    }
}

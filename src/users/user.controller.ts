import { User } from './user.interface';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('master'))
  @Post()
  async create(@Body() create: CreateUserDto) {
      return await this.userService.create(create);
  }
  
  @UseGuards(AuthGuard(['default_user','master']) )
  @Put('/:id')
  async update(@Request() req, @Param('id') id: string, @Body() update: User) {
      return (req.user._id == id || req.user.isMaster) ? await this.userService.update(id, update) : {};
  }

  @UseGuards(AuthGuard('master'))
  @Delete('/:id')
  async delete(@Param('id') id: string) {
      return await this.userService.deleteById(id);
  }

  @UseGuards(AuthGuard(['default_user','master']))
  @Get('/:id')
  async get(@Request() req, @Param('id') id: string) {
      return (req.user._id == id || req.user.isMaster) ? await this.userService.getById(id) : {};
  }  

}

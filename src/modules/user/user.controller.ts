import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ListUsersDTO } from './dto/ListUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { HashPasswordPipe } from 'src/resources/pipes/hashPassword';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthenticationGuard)
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(
    @Body() { password, ...dataOfUser }: CreateUserDTO,
    @Body('password', HashPasswordPipe) hashedPassword: string,
  ) {
    const userCreated = await this.userService.createUser({
      ...dataOfUser,
      password: hashedPassword,
    });

    return {
      message: 'usuário criado com sucesso',
      user: new ListUsersDTO(userCreated.id, userCreated.name),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async listUsers() {
    const usersSaved = await this.userService.listUsers();

    return {
      mensagem: 'Usuários obtidos com sucesso.',
      users: usersSaved,
    };
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() newData: UpdateUserDTO) {
    const userUpdated = await this.userService.updateUser(id, newData);

    return {
      message: 'usuário atualizado com sucesso',
      user: userUpdated,
    };
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    const userRemoved = await this.userService.deleteUser(id);

    return {
      message: 'usuário removido com suceso',
      user: userRemoved,
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Req() req) {
    const user = req.user;
    if (user.role === UserRole.DOCTOR) {
      return this.usersService.findAll(user._id);
    }
    if (user.role === UserRole.ADMIN) {
      return this.usersService.findAll(undefined, true);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    // Aquí se permite actualizar loveLanguagesTestEnabled
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('assign/:patientId/:doctorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async assignPatientToDoctor(@Param('patientId') patientId: string, @Param('doctorId') doctorId: string) {
    return this.usersService.assignPatientToDoctor(patientId, doctorId);
  }

  @Patch('assign-all/:doctorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async assignAllPatientsToDoctor(@Param('doctorId') doctorId: string) {
    return this.usersService.assignAllPatientsToDoctor(doctorId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

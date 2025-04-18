import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, phone, password, cedula, role } = createUserDto;
    
    const existingUser = await this.userModel.findOne({ cedula }).exec();
    if (existingUser) {
      console.log('Usuario existente encontrado:', {
        cedula: existingUser.cedula,
        phone: existingUser.phone
      });
      throw new ConflictException('Ya existe un usuario registrado con este número de cédula');
    }
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const createdUser = new this.userModel({
        name,
        phone,
        cedula,
        password: hashedPassword,
        role,
      });

      return await createdUser.save();
    } catch (error) {
      console.log('Error al crear usuario:', error);
      throw error;
    }
  }

  async findAll() {
    const patients = await this.userModel.find({ role: 'patient' }).exec();
    if (!patients.length) {
      throw new NotFoundException('No se encontraron pacientes');
    }
    return patients;
  }

  async findByPhone(phone: string) {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByCedula(cedula: string) {
    return this.userModel.findOne({ cedula }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findOne({ _id: id, role: 'patient' }).exec();
    if (!user) {
      throw new NotFoundException('Usuario paciente no encontrado');
    }
    return user;
  }

  async update(id: string, updateUserDto: any) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}

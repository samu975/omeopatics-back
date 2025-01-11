import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any, requestingUser: UserDocument) {
    if (requestingUser.role !== 'admin') {
      throw new UnauthorizedException(
        'Solo administradores pueden crear usuarios',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findAll(requestingUser: UserDocument) {
    if (requestingUser.role !== 'admin') {
      throw new UnauthorizedException(
        'Solo administradores pueden ver todos los usuarios',
      );
    }
    return this.userModel.find().exec();
  }

  async findByPhone(phone: string) {
    return this.userModel.findOne({ phone }).exec();
  }

  async update(id: string, updateUserDto: any, requestingUser: UserDocument) {
    if (requestingUser.role !== 'admin') {
      throw new UnauthorizedException(
        'Solo administradores pueden actualizar usuarios',
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string, requestingUser: UserDocument) {
    if (requestingUser.role !== 'admin') {
      throw new UnauthorizedException(
        'Solo administradores pueden eliminar usuarios',
      );
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }
}

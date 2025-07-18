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
    const { name, phone, password, cedula, role, loveLanguagesTestEnabled, doctorId } = createUserDto;
    
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
      let assignedDoctorId = doctorId;
      if (role === 'patient' && (!doctorId || doctorId.trim() === '')) {
        assignedDoctorId = '686c35713783f191a976446e';
      }
      const createdUser = new this.userModel({
        name,
        phone,
        cedula,
        password: hashedPassword,
        role,
        loveLanguagesTestEnabled: loveLanguagesTestEnabled ?? false,
        doctorId: assignedDoctorId && assignedDoctorId.trim() !== '' ? assignedDoctorId : undefined,
      });

      return await createdUser.save();
    } catch (error) {
      console.log('Error al crear usuario:', error);
      throw error;
    }
  }

  async findAll(doctorId?: string, isAdmin?: boolean) {
    if (isAdmin) {
      // Devuelve todos los usuarios (pacientes y doctores)
      return this.userModel.find({}).exec();
    }
    const filter: any = { role: 'patient' };
    if (doctorId) {
      filter.doctorId = doctorId;
    }
    const patients = await this.userModel.find(filter).exec();
    if (!patients.length) {
      throw new NotFoundException('No se encontraron pacientes');
    }
    return patients;
  }

  async assignPatientToDoctor(patientId: string, doctorId: string) {
    // Asigna el paciente al doctor
    return this.userModel.findByIdAndUpdate(
      patientId,
      { doctorId },
      { new: true }
    ).exec();
  }

  async assignAllPatientsToDoctor(doctorId: string) {
    try {
      // Primero, obtenemos todos los pacientes
      const allPatients = await this.userModel.find({ role: 'patient' }).exec();
      
      let updatedCount = 0;
      
      // Iteramos sobre cada paciente y verificamos su doctorId
      for (const patient of allPatients) {
        const currentDoctorId = patient.doctorId;
        
        // Si no tiene doctorId, o es una cadena vacía, o es null, lo asignamos
        if (!currentDoctorId || 
            currentDoctorId === '' || 
            currentDoctorId === null || 
            currentDoctorId === undefined) {
          
          await this.userModel.findByIdAndUpdate(
            patient._id,
            { doctorId }
          ).exec();
          
          updatedCount++;
        }
      }
      
      return {
        message: `Se asignaron ${updatedCount} pacientes al doctor`,
        modifiedCount: updatedCount
      };
    } catch (error) {
      console.error('Error en assignAllPatientsToDoctor:', error);
      throw error;
    }
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

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historial } from '../schemas/historial.schema';
import { User } from '../schemas/user.schema';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { UpdateSesionTrabajadaDto } from './dto/update-sesion-trabajada.dto';
import { UserRole } from '../users/dto/create-user.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectModel(Historial.name) private historialModel: Model<Historial>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createHistorialDto: CreateHistorialDto, currentUser: any) {
    // Verificar que el usuario actual sea Admin o Doctor
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden crear historiales');
    }

    const patient = await this.userModel.findById(createHistorialDto.patient);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Si no se proporcionan sesiones trabajadas, inicializar como array vacío
    const historialData = {
      ...createHistorialDto,
      sesionesTrabajadas: createHistorialDto.sesionesTrabajadas || []
    };

    const newHistorial = new this.historialModel(historialData);
    const savedHistorial = await newHistorial.save();

    // Agregar el historial al paciente
    await this.userModel.findByIdAndUpdate(
      createHistorialDto.patient,
      { $push: { historial: savedHistorial._id } },
      { new: true }
    );

    return this.historialModel
      .findById(savedHistorial._id)
      .populate('patient', 'name phone cedula')
      .exec();
  }

  async findAll(currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden ver todos los historiales');
    }

    return this.historialModel
      .find()
      .populate('patient', 'name phone cedula')
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async findByPatientId(patientId: string, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden ver historiales');
    }

    const patient = await this.userModel.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.historialModel
      .find({ patient: patientId })
      .populate('patient', 'name phone cedula')
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async findOne(id: string, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden ver historiales');
    }

    const historial = await this.historialModel
      .findById(id)
      .populate('patient', 'name phone cedula')
      .exec();

    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    return historial;
  }

  async update(id: string, updateHistorialDto: UpdateHistorialDto, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden actualizar historiales');
    }

    const historial = await this.historialModel.findById(id);
    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    const updatedHistorial = await this.historialModel
      .findByIdAndUpdate(id, updateHistorialDto, { new: true })
      .populate('patient', 'name phone cedula')
      .exec();

    return updatedHistorial;
  }

  async remove(id: string, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden eliminar historiales');
    }

    const historial = await this.historialModel.findById(id);
    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    // Remover el historial del paciente
    await this.userModel.findByIdAndUpdate(
      historial.patient,
      { $pull: { historial: id } }
    );

    await this.historialModel.findByIdAndDelete(id);

    return {
      message: 'Historial eliminado correctamente',
      historial
    };
  }

  async findByPatient(patientId: string, user: any) {
    return await this.findByPatientId(patientId, user);
  }

  // Nuevo método para agregar una sesión trabajada a un historial existente
  async addSesionTrabajada(historialId: string, sesionData: any, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden agregar sesiones');
    }

    const historial = await this.historialModel.findById(historialId);
    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    const updatedHistorial = await this.historialModel
      .findByIdAndUpdate(
        historialId,
        { $push: { sesionesTrabajadas: sesionData } },
        { new: true }
      )
      .populate('patient', 'name phone cedula')
      .exec();

    return updatedHistorial;
  }

  // Método para editar una sesión trabajada específica
  async editSesionTrabajada(historialId: string, sesionIndex: number, updateSesionDto: UpdateSesionTrabajadaDto, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden editar sesiones');
    }

    const historial = await this.historialModel.findById(historialId);
    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    // Verificar que el índice de la sesión sea válido
    if (sesionIndex < 0 || sesionIndex >= historial.sesionesTrabajadas.length) {
      throw new NotFoundException('Índice de sesión inválido');
    }

    // Obtener la sesión original para devolverla en la respuesta
    const sesionOriginal = historial.sesionesTrabajadas[sesionIndex];

    // Actualizar la sesión específica usando $set con el índice
    const updatedHistorial = await this.historialModel
      .findByIdAndUpdate(
        historialId,
        { 
          $set: { 
            [`sesionesTrabajadas.${sesionIndex}`]: {
              fechaSesion: updateSesionDto.fechaSesion,
              queSeHizo: updateSesionDto.queSeHizo,
              recomendacionesProximaSesion: updateSesionDto.recomendacionesProximaSesion
            }
          } 
        },
        { new: true }
      )
      .populate('patient', 'name phone cedula')
      .exec();

    return {
      message: 'Sesión editada correctamente',
      sesionOriginal,
      sesionActualizada: updatedHistorial.sesionesTrabajadas[sesionIndex],
      historial: updatedHistorial
    };
  }

  // Método para eliminar una sesión trabajada específica
  async removeSesionTrabajada(historialId: string, sesionIndex: number, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('Solo administradores y doctores pueden eliminar sesiones');
    }

    const historial = await this.historialModel.findById(historialId);
    if (!historial) {
      throw new NotFoundException('Historial no encontrado');
    }

    // Verificar que el índice de la sesión sea válido
    if (sesionIndex < 0 || sesionIndex >= historial.sesionesTrabajadas.length) {
      throw new NotFoundException('Índice de sesión inválido');
    }

    // Obtener la sesión que se va a eliminar para devolverla en la respuesta
    const sesionEliminada = historial.sesionesTrabajadas[sesionIndex];

    // Eliminar la sesión usando $pull con el índice específico
    const updatedHistorial = await this.historialModel
      .findByIdAndUpdate(
        historialId,
        { $pull: { sesionesTrabajadas: { $in: [sesionEliminada] } } },
        { new: true }
      )
      .populate('patient', 'name phone cedula')
      .exec();

    return {
      message: 'Sesión eliminada correctamente',
      sesionEliminada,
      historial: updatedHistorial
    };
  }
} 
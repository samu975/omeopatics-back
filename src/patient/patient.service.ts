import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from '../schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const createdPatient = new this.patientModel(createPatientDto);
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }
    return patient;
  }

  async findByEmail(email: string): Promise<Patient> {
    const patient = await this.patientModel.find({ email }).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with email ${email} not found`);
    }
    return patient[0];
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const existingPatient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto)
      .exec();
    if (!existingPatient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }
    return existingPatient;
  }

  async remove(id: string): Promise<Patient> {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!deletedPatient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }
    return deletedPatient;
  }
}

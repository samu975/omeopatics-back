import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from '../schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  async findAll() {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string) {
    return this.doctorModel.findById(id).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.doctorModel.findByIdAndDelete(id).exec();
  }
}

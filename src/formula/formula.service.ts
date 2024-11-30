import { Injectable } from '@nestjs/common';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';
import { Model } from 'mongoose';
import {
  MedicalFormula,
  MedicalFormulaDocument,
} from 'src/schemas/medicalFormule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from 'src/schemas/patient.schema';

@Injectable()
export class FormulaService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    @InjectModel(MedicalFormula.name)
    private readonly formulaModel: Model<MedicalFormulaDocument>,
  ) {}
  async create(createFormulaDto: CreateFormulaDto) {
    const createdFormula = new this.formulaModel(createFormulaDto);
    return await createdFormula.save();
  }

  async findAllPatientFormula(id: string) {
    const patient = await this.patientModel.findById(id).exec();
    return await this.formulaModel.find({
      patient: patient,
    });
  }

  async findOne(id: string) {
    const formula = await this.formulaModel.findById(id).exec();
    return formula;
  }

  async update(id: string, updateFormulaDto: UpdateFormulaDto) {
    const existingFormula = await this.formulaModel
      .findByIdAndUpdate(id, updateFormulaDto)
      .exec();
    return existingFormula;
  }

  async remove(id: string) {
    const deletedFormula = await this.formulaModel.findByIdAndDelete(id).exec();
    return deletedFormula;
  }
}

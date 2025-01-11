import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Formula, FormulaDocument } from '../schemas/formula.schema';

@Injectable()
export class FormulasService {
  constructor(
    @InjectModel(Formula.name) private formulaModel: Model<FormulaDocument>
  ) {}

  async create(createFormulaDto: any, userRole: string) {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo administradores pueden crear fórmulas');
    }
    const formula = new this.formulaModel(createFormulaDto);
    return formula.save();
  }

  async findAll() {
    return this.formulaModel.find().exec();
  }

  async findOne(id: string) {
    const formula = await this.formulaModel.findById(id).exec();
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }
    return formula;
  }

  async addFollowUp(id: string, followUpDto: any, userRole: string) {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo administradores pueden agregar seguimientos');
    }
    
    const formula = await this.formulaModel.findById(id);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    formula.followUps.push(followUpDto);
    return formula.save();
  }

  async addAnswer(id: string, followUpIndex: number, answerDto: any) {
    const formula = await this.formulaModel.findById(id);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    if (!formula.followUps[followUpIndex]) {
      throw new NotFoundException('Seguimiento no encontrado');
    }

    formula.followUps[followUpIndex].answers.push({
      ...answerDto,
      createdAt: new Date()
    });

    return formula.save();
  }
} 
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Formula } from '../schemas/formula.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class FormulasService {
  constructor(
    @InjectModel(Formula.name) private formulaModel: Model<Formula>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createFormulaForUser(userId: string, createFormulaDto: {
    name: string;
    description: string;
    questions: any[];
  }) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const newFormula = new this.formulaModel({
      name: createFormulaDto.name,
      description: createFormulaDto.description,
      questions: createFormulaDto.questions,
      user: userId,
      answers: [],
    });

    const savedFormula = await newFormula.save();

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { asignedFormulas: savedFormula._id }
      },
      { new: true }
    );

    return savedFormula;
  }

  async findAll() {
    return this.formulaModel
      .find()
      .populate('user')
      .exec();
  }

  async findByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.formulaModel.find({ user: userId })
      .populate('user', 'name phone role')
      .select('name description questions answers createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    const formula = await this.formulaModel
      .findById(id)
      .populate('user', 'name phone role')
      .select('name description questions answers createdAt')
      .exec();

    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    return formula;
  }

  async addAnswer(formulaId: string, answer: any) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    formula.answers.push(answer);
    return formula.save();
  }

  async updateFormula(
    formulaId: string,
    updateFormulaDto: {
      name?: string;
      description?: string;
      questions?: any[];
    }
  ) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    if (updateFormulaDto.name) {
      formula.name = updateFormulaDto.name;
    }
    if (updateFormulaDto.description) {
      formula.description = updateFormulaDto.description;
    }
    if (updateFormulaDto.questions) {
      formula.questions = updateFormulaDto.questions;
    }

    const updatedFormula = await formula.save();

    return this.formulaModel
      .findById(updatedFormula._id)
      .populate('user', 'name phone role')
      .select('name description questions answers createdAt')
      .exec();
  }

  async deleteFormula(formulaId: string) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    // Primero eliminamos la referencia de la fórmula en el usuario
    await this.userModel.findByIdAndUpdate(
      formula.user,
      {
        $pull: { asignedFormulas: formulaId }
      }
    );

    // Luego eliminamos la fórmula
    const deletedFormula = await this.formulaModel.findByIdAndDelete(formulaId);

    return {
      message: 'Fórmula eliminada correctamente',
      formula: deletedFormula
    };
  }
} 
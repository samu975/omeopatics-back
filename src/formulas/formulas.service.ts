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

  async addAnswer(formulaId: string, answersDto: { answers: Array<{
      question: string;
      type: 'abierta' | 'multiple' | 'unica';
      answer: string[];
    }>}) {
      const formula = await this.formulaModel.findById(formulaId);
      if (!formula) {
        throw new NotFoundException('Fórmula no encontrada');
      }
  
      const { answers } = answersDto;
      
      if (!Array.isArray(answers)) {
        throw new NotFoundException('El formato de las respuestas es inválido');
      }
  
      for (const answer of answers) {
        if (!answer.question || !answer.type || !Array.isArray(answer.answer)) {
          throw new NotFoundException('Formato de respuesta inválido');
        }
  
        const matchingQuestion = formula.questions.find(
          (q: any) => q.title === answer.question && q.type === answer.type
        );
  
        if (!matchingQuestion) {
          throw new NotFoundException(`La pregunta "${answer.question}" no existe en esta fórmula o el tipo no coincide`);
        }
  
        if ((answer.type === 'abierta' || answer.type === 'unica') && answer.answer.length !== 1) {
          throw new Error(`La pregunta "${answer.question}" debe tener una única respuesta`);
        }
  
        const newAnswer = {
          question: matchingQuestion,
          type: answer.type,
          answer: answer.answer,
          createdAt: new Date()
        };
  
        formula.answers.push(newAnswer);
      }
  
      const updatedFormula = await formula.save();
  
      return this.formulaModel
        .findById(updatedFormula._id)
        .populate('user', 'name phone role')
        .select('name description questions answers createdAt')
        .exec();
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

    await this.userModel.findByIdAndUpdate(
      formula.user,
      {
        $pull: { asignedFormulas: formulaId }
      }
    );

    const deletedFormula = await this.formulaModel.findByIdAndDelete(formulaId);

    return {
      message: 'Fórmula eliminada correctamente',
      formula: deletedFormula
    };
  }
}
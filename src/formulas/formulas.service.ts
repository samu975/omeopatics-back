import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Formula } from '../schemas/formula.schema';
import { User } from '../schemas/user.schema';
import { QuestionBank } from '../schemas/questionBank.schema';
import { FollowUpResponse } from '../schemas/followUpResponse.schema';
import { CreateFormulaDto } from './dto/create-formula.dto';

@Injectable()
export class FormulasService {
  constructor(
    @InjectModel(Formula.name) private formulaModel: Model<Formula>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(QuestionBank.name) private questionBankModel: Model<QuestionBank>,
    @InjectModel(FollowUpResponse.name) private followUpResponseModel: Model<FollowUpResponse>,
  ) {}

  async createFormulaForUser(userId: string, createFormulaDto: {
    name: string;
    description: string;
    dosis: string;
    followUpQuestionBankId?: string;
    hasFollowUpNotifications?: boolean;
  }) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let followUpQuestionBank = null;
    if (createFormulaDto.followUpQuestionBankId) {
      followUpQuestionBank = await this.questionBankModel.findById(createFormulaDto.followUpQuestionBankId);
      if (!followUpQuestionBank) {
        throw new NotFoundException('Banco de preguntas no encontrado');
      }
    }

    const newFormula = new this.formulaModel({
      name: createFormulaDto.name,
      description: createFormulaDto.description,
      dosis: createFormulaDto.dosis,
      user: userId,
      followUpQuestionBank: followUpQuestionBank?._id,
      hasFollowUpNotifications: createFormulaDto.hasFollowUpNotifications || false,
    });

    const savedFormula = await newFormula.save();

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { asignedFormulas: savedFormula._id }
      },
      { new: true }
    );

    return this.formulaModel
      .findById(savedFormula._id)
      .populate('user', 'name phone role')
      .populate('followUpQuestionBank')
      .exec();
  }

  async findAll() {
    return this.formulaModel
      .find()
      .populate('user')
      .populate('followUpQuestionBank')
      .exec();
  }

  async findByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.formulaModel.find({ user: userId })
      .populate('user', 'name phone role')
      .populate('followUpQuestionBank')
      .select('name description dosis followUpQuestionBank hasFollowUpNotifications createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    const formula = await this.formulaModel
      .findById(id)
      .populate('user', 'name phone role')
      .populate('followUpQuestionBank')
      .select('name description dosis followUpQuestionBank hasFollowUpNotifications createdAt')
      .exec();

    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    return formula;
  }

  async addFollowUpResponse(formulaId: string, answersDto: { answers: Array<{
      questionId: number;
      type: 'abierta' | 'multiple' | 'unica';
      answer: string[];
    }>}) {
      const formula = await this.formulaModel
        .findById(formulaId)
        .populate('followUpQuestionBank')
        .exec();
        
      if (!formula) {
        throw new NotFoundException('Fórmula no encontrada');
      }

      if (!formula.followUpQuestionBank) {
        throw new NotFoundException('Esta fórmula no tiene banco de preguntas de seguimiento asignado');
      }

      const { answers } = answersDto;
      
      if (!Array.isArray(answers)) {
        throw new NotFoundException('El formato de las respuestas es inválido');
      }

      const processedAnswers = [];

      for (const answer of answers) {
        if (!answer.questionId || !answer.type || !Array.isArray(answer.answer)) {
          throw new NotFoundException('Formato de respuesta inválido');
        }

        const matchingQuestion = formula.followUpQuestionBank.questions.find(
          (q: any) => q.id === answer.questionId && q.type === answer.type
        );

        if (!matchingQuestion) {
          throw new NotFoundException(`La pregunta con ID "${answer.questionId}" no existe en este banco de preguntas o el tipo no coincide`);
        }

        if ((answer.type === 'abierta' || answer.type === 'unica') && answer.answer.length !== 1) {
          throw new Error(`La pregunta con ID "${answer.questionId}" debe tener una única respuesta`);
        }

        processedAnswers.push({
          question: matchingQuestion,
          type: answer.type,
          answer: answer.answer,
          createdAt: new Date()
        });
      }

      const newFollowUpResponse = new this.followUpResponseModel({
        patient: formula.user,
        formula: formulaId,
        questionBank: formula.followUpQuestionBank._id,
        answers: processedAnswers,
        responseDate: new Date()
      });

      const savedResponse = await newFollowUpResponse.save();

      return this.followUpResponseModel
        .findById(savedResponse._id)
        .populate('patient', 'name phone cedula')
        .populate('formula', 'name description')
        .populate('questionBank', 'name description')
        .exec();
    }

  async getFollowUpResponses(formulaId: string) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    return this.followUpResponseModel
      .find({ formula: formulaId })
      .populate('patient', 'name phone cedula')
      .populate('formula', 'name description')
      .populate('questionBank', 'name description')
      .sort({ responseDate: -1 })
      .exec();
  }

  async updateFormula(
    formulaId: string,
    updateFormulaDto: {
      name?: string;
      description?: string;
      dosis?: string;
      followUpQuestionBankId?: string;
      hasFollowUpNotifications?: boolean;
    }
  ) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    if (updateFormulaDto.followUpQuestionBankId) {
      const questionBank = await this.questionBankModel.findById(updateFormulaDto.followUpQuestionBankId);
      if (!questionBank) {
        throw new NotFoundException('Banco de preguntas no encontrado');
      }
      formula.followUpQuestionBank = updateFormulaDto.followUpQuestionBankId as any;
    }

    if (updateFormulaDto.name) formula.name = updateFormulaDto.name;
    if (updateFormulaDto.description) formula.description = updateFormulaDto.description;
    if (updateFormulaDto.dosis) formula.dosis = updateFormulaDto.dosis;
    if (updateFormulaDto.hasFollowUpNotifications !== undefined) {
      formula.hasFollowUpNotifications = updateFormulaDto.hasFollowUpNotifications;
    }

    const updatedFormula = await formula.save();

    return this.formulaModel
      .findById(updatedFormula._id)
      .populate('user', 'name phone role')
      .populate('followUpQuestionBank')
      .exec();
  }

  async deleteFormula(formulaId: string) {
    const formula = await this.formulaModel.findById(formulaId);
    if (!formula) {
      throw new NotFoundException('Fórmula no encontrada');
    }

    // Eliminar todas las respuestas de seguimiento relacionadas
    await this.followUpResponseModel.deleteMany({ formula: formulaId });

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

  async create(createFormulaDto: CreateFormulaDto) {
    // Lógica para crear la fórmula
    return await this.formulaModel.create(createFormulaDto);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionBank } from '../schemas/questionBank.schema';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@Injectable()
export class QuestionBanksService {
  constructor(
    @InjectModel(QuestionBank.name) private questionBankModel: Model<QuestionBank>,
  ) {}

  async create(createQuestionBankDto: CreateQuestionBankDto) {
    const newQuestionBank = new this.questionBankModel(createQuestionBankDto);
    return newQuestionBank.save();
  }

  async findAll() {
    return this.questionBankModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActive() {
    return this.questionBankModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const questionBank = await this.questionBankModel.findById(id).exec();
    if (!questionBank) {
      throw new NotFoundException('Banco de preguntas no encontrado');
    }
    return questionBank;
  }

  async update(id: string, updateQuestionBankDto: UpdateQuestionBankDto) {
    const questionBank = await this.questionBankModel.findById(id);
    if (!questionBank) {
      throw new NotFoundException('Banco de preguntas no encontrado');
    }

    const updatedQuestionBank = await this.questionBankModel
      .findByIdAndUpdate(id, updateQuestionBankDto, { new: true })
      .exec();

    return updatedQuestionBank;
  }

  async remove(id: string) {
    const questionBank = await this.questionBankModel.findById(id);
    if (!questionBank) {
      throw new NotFoundException('Banco de preguntas no encontrado');
    }

    await this.questionBankModel.findByIdAndDelete(id);

    return {
      message: 'Banco de preguntas eliminado correctamente',
      questionBank
    };
  }

  async addQuestion(id: string, question: any) {
    const questionBank = await this.questionBankModel.findById(id);
    if (!questionBank) {
      throw new NotFoundException('Banco de preguntas no encontrado');
    }

    questionBank.questions.push(question);
    return questionBank.save();
  }

  async removeQuestion(id: string, questionId: number) {
    const questionBank = await this.questionBankModel.findById(id);
    if (!questionBank) {
      throw new NotFoundException('Banco de preguntas no encontrado');
    }

    questionBank.questions = questionBank.questions.filter(q => q.id !== questionId);
    return questionBank.save();
  }
} 
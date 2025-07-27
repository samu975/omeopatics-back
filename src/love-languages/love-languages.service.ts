import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoveLanguageTest } from '../schemas/loveLanguageTest.schema';
import { User } from '../schemas/user.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoveLanguagesService {
  constructor(
    @InjectModel(LoveLanguageTest.name) private loveLanguageTestModel: Model<LoveLanguageTest>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  getQuestions() {
    const questionsPath = path.join(__dirname, '../../love-languages-questions.json');
    if (!fs.existsSync(questionsPath)) {
      throw new NotFoundException('Cuestionario no encontrado');
    }
    const data = fs.readFileSync(questionsPath, 'utf8');
    return JSON.parse(data);
  }

  async saveCategoryAnswers(userId: string, categoryData: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.loveLanguagesTestEnabled) throw new ForbiddenException('Test no habilitado para este usuario');
    
    let test = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!test) {
        test = new this.loveLanguageTestModel({ 
            user: userId, 
            answers: [], 
            scores: [],
            isCompleted: false 
        });
        await test.save();
    }
    const existingCategoryIndex = test.answers.findIndex(
        (cat: any) => cat.categoria === categoryData.categoria
    );

    let updatedAnswers;
    if (existingCategoryIndex >= 0) {
        console.log('Actualizando categoría existente en índice:', existingCategoryIndex);
        updatedAnswers = [...test.answers];
        updatedAnswers[existingCategoryIndex] = categoryData;
    } else {
        console.log('Agregando nueva categoría');
        updatedAnswers = [...test.answers, categoryData];
    }

    const questions = this.getQuestions();
    const isCompleted = updatedAnswers.length === questions.length;

    const updatedTest = await this.loveLanguageTestModel.findByIdAndUpdate(
        test._id,
        {
            answers: updatedAnswers,
            isCompleted: isCompleted
        },
        { new: true }
    );

    if (!updatedTest) {
        throw new Error('Error al actualizar el test. El test no fue encontrado.');
    }

    return updatedTest;
}
  async saveAnswers(userId: string, answers: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.loveLanguagesTestEnabled) throw new ForbiddenException('Test no habilitado para este usuario');
    let test = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!test) {
      test = new this.loveLanguageTestModel({ user: userId, answers: [], scores: [], isCompleted: false });
    }
    // answers debe ser un array de objetos: { categoria, recibirAmor: [números], expresarAmor: [números] }
    test.answers = answers;
    // Calcular puntajes por cada subgrupo y total por categoría
    test.scores = answers.map((cat: any) => {
      const recibir = Array.isArray(cat.recibirAmor) ? cat.recibirAmor.reduce((a, b) => a + b, 0) : 0;
      const expresar = Array.isArray(cat.expresarAmor) ? cat.expresarAmor.reduce((a, b) => a + b, 0) : 0;
      return { categoria: cat.categoria, recibirAmor: recibir, expresarAmor: expresar, total: recibir + expresar };
    });
    
    // Verificar si ha completado todas las categorías
    const questions = this.getQuestions();
    test.isCompleted = answers.length === questions.length;
    
    await test.save();
    return test;
  }

  async resetAnswers(userId: string) {
    const test = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!test) throw new NotFoundException('No hay test para este usuario');
    test.answers = [];
    test.scores = [];
    test.isCompleted = false;
    await test.save();
    return test;
  }

  async getResults(userId: string) {
    const test = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!test) throw new NotFoundException('No hay test para este usuario');
    if (!test.isCompleted) {
      return { scores: [], isCompleted: false };
    }
    // Calcular puntajes en base a las respuestas actuales
    const scores = test.answers.map((cat: any) => {
      const recibir = Array.isArray(cat.recibirAmor) ? cat.recibirAmor.reduce((a, b) => a + b, 0) : 0;
      const expresar = Array.isArray(cat.expresarAmor) ? cat.expresarAmor.reduce((a, b) => a + b, 0) : 0;
      return { categoria: cat.categoria, recibirAmor: recibir, expresarAmor: expresar, total: recibir + expresar };
    });
    return { scores, isCompleted: true };
  }

  async getProgress(userId: string) {
    const test = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!test) {
      return { 
        answers: [], 
        isCompleted: false, 
        progress: 0,
        totalCategories: 5 
      };
    }
    
    const questions = this.getQuestions();
    const progress = Math.round((test.answers.length / questions.length) * 100);
    
    return {
      answers: test.answers,
      isCompleted: test.isCompleted,
      progress: progress,
      totalCategories: questions.length,
      completedCategories: test.answers.length
    };
  }
} 
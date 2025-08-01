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
        updatedAnswers = [...test.answers];
        updatedAnswers[existingCategoryIndex] = categoryData;
    } else {
        updatedAnswers = [...test.answers, categoryData];
    }

    // Calcular puntajes por cada subgrupo y total por categoría
    const updatedScores = updatedAnswers.map((cat: any) => {
      const recibir = Array.isArray(cat.recibirAmor) ? cat.recibirAmor.reduce((a, b) => a + b, 0) : 0;
      const expresar = Array.isArray(cat.expresarAmor) ? cat.expresarAmor.reduce((a, b) => a + b, 0) : 0;
      return { categoria: cat.categoria, recibirAmor: recibir, expresarAmor: expresar, total: recibir + expresar };
    });

    const questions = this.getQuestions();
    const isCompleted = updatedAnswers.length === questions.length;

    const updatedTest = await this.loveLanguageTestModel.findByIdAndUpdate(
        test._id,
        {
            answers: updatedAnswers,
            scores: updatedScores,
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
      await test.save();
    }
    // answers debe ser un array de objetos: { categoria, recibirAmor: [números], expresarAmor: [números] }
    const updatedAnswers = answers;
    // Calcular puntajes por cada subgrupo y total por categoría
    const updatedScores = updatedAnswers.map((cat: any) => {
      const recibir = Array.isArray(cat.recibirAmor) ? cat.recibirAmor.reduce((a, b) => a + b, 0) : 0;
      const expresar = Array.isArray(cat.expresarAmor) ? cat.expresarAmor.reduce((a, b) => a + b, 0) : 0;
      return { categoria: cat.categoria, recibirAmor: recibir, expresarAmor: expresar, total: recibir + expresar };
    });
    // Verificar si ha completado todas las categorías
    const questions = this.getQuestions();
    const isCompleted = updatedAnswers.length === questions.length;
    const updatedTest = await this.loveLanguageTestModel.findByIdAndUpdate(
      test._id,
      {
        answers: updatedAnswers,
        scores: updatedScores,
        isCompleted: isCompleted
      },
      { new: true }
    );
    if (!updatedTest) {
      throw new Error('Error al actualizar el test. El test no fue encontrado.');
    }
    return updatedTest;
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

  // Comparar resultados de lenguaje del amor entre usuario y pareja
  async compareWithPartner(userId: string, partnerCedula: string) {
    // Buscar usuario actual
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.loveLanguagesTestEnabled) throw new ForbiddenException('Test no habilitado para este usuario');

    // Buscar pareja por cedula
    const partner = await this.userModel.findOne({ cedula: partnerCedula });
    if (!partner) {
      throw new NotFoundException('Pareja no encontrada');
    }
    if (!partner.loveLanguagesTestEnabled) throw new ForbiddenException('Test no habilitado para la pareja');

    // Buscar test de usuario
    const userTest = await this.loveLanguageTestModel.findOne({ user: userId });
    if (!userTest || !userTest.isCompleted) {
      throw new NotFoundException('El usuario no ha completado el test de lenguaje del amor');
    }
    // Buscar test de pareja
    const partnerTest = await this.loveLanguageTestModel.findOne({ user: partner._id });

    // Si los scores están vacíos, los calculo dinámicamente
    const calculateScores = (answers: any[]) => {
      if (!answers || !Array.isArray(answers)) return [];
      return answers.map((cat: any) => {
        const recibir = Array.isArray(cat.recibirAmor) ? cat.recibirAmor.reduce((a, b) => a + b, 0) : 0;
        const expresar = Array.isArray(cat.expresarAmor) ? cat.expresarAmor.reduce((a, b) => a + b, 0) : 0;
        return { categoria: cat.categoria, recibirAmor: recibir, expresarAmor: expresar };
      });
    };

    const userScores = (userTest.scores && userTest.scores.length > 0)
      ? userTest.scores
      : calculateScores(userTest.answers);
    const partnerScores = (partnerTest.scores && partnerTest.scores.length > 0)
      ? partnerTest.scores
      : calculateScores(partnerTest.answers);

    // Retornar ambos resultados
    return {
      user: {
        id: user._id,
        nombre: user.get('nombre'),
        cedula: user.get('cedula'),
        scores: userScores,
      },
      partner: {
        id: partner._id,
        nombre: partner.get('nombre'),
        cedula: partner.get('cedula'),
        scores: partnerScores,
      }
    };
  }
}
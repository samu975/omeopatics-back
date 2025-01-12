import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { FormulasService } from './formulas.service';

@Controller('formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Get()
  findAll() {
    return this.formulasService.findAll();
  }

  @Get('user/:userId')
  async getFormulasByUserId(@Param('userId') userId: string) {
    return this.formulasService.findByUserId(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.formulasService.findById(id);
  }

  @Post(':id/followup')
  async createFormula(
    @Param('id') userId: string,
    @Body() createFormulaDto: {
      name: string;
      description: string;
      questions: any[];
    }
  ) {
    return this.formulasService.createFormulaForUser(userId, createFormulaDto);
  }

  @Post(':id/answer')
  async addAnswer(
    @Param('id') formulaId: string,
    @Body() answerDto: {
      question: any;
      type: 'abierta' | 'multiple' | 'unica';
      answer: string[];
    }
  ) {
    return this.formulasService.addAnswer(formulaId, answerDto);
  }

  @Patch(':id')
  async updateFormula(
    @Param('id') formulaId: string,
    @Body() updateFormulaDto: {
      name?: string;
      description?: string;
      questions?: any[];
    }
  ) {
    return this.formulasService.updateFormula(formulaId, updateFormulaDto);
  }

  @Delete(':id')
  async deleteFormula(@Param('id') formulaId: string) {
    return this.formulasService.deleteFormula(formulaId);
  }
} 
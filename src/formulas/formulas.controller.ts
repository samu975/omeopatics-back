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
      dosis: string;
      followUpQuestionBankId?: string;
      hasFollowUpNotifications?: boolean;
    }
  ) {
    return this.formulasService.createFormulaForUser(userId, createFormulaDto);
  }

  @Post(':id/followup-response')
  async addFollowUpResponse(
    @Param('id') formulaId: string,
    @Body() answersDto: {
      answers: Array<{
        questionId: number;
        type: 'abierta' | 'multiple' | 'unica';
        answer: string[];
      }>
    }
  ) {
    return this.formulasService.addFollowUpResponse(formulaId, answersDto);
  }

  @Get(':id/followup-responses')
  async getFollowUpResponses(@Param('id') formulaId: string) {
    return this.formulasService.getFollowUpResponses(formulaId);
  }

  @Patch(':id')
  async updateFormula(
    @Param('id') formulaId: string,
    @Body() updateFormulaDto: {
      name?: string;
      description?: string;
      dosis?: string;
      followUpQuestionBankId?: string;
      hasFollowUpNotifications?: boolean;
    }
  ) {
    return this.formulasService.updateFormula(formulaId, updateFormulaDto);
  }

  @Delete(':id')
  async deleteFormula(@Param('id') formulaId: string) {
    return this.formulasService.deleteFormula(formulaId);
  }
}
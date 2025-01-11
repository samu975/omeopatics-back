import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('formulas')
@UseGuards(JwtStrategy, RolesGuard)
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Post()
  @Roles('admin')
  create(@Body() createFormulaDto: any, @Request() req) {
    return this.formulasService.create(createFormulaDto, req.user.role);
  }

  @Get()
  findAll() {
    return this.formulasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulasService.findOne(id);
  }

  @Post(':id/followup')
  @Roles('admin')
  addFollowUp(
    @Param('id') id: string,
    @Body() followUpDto: any,
    @Request() req
  ) {
    return this.formulasService.addFollowUp(id, followUpDto, req.user.role);
  }

  @Post(':id/followup/:index/answer')
  @Roles('patient')
  addAnswer(
    @Param('id') id: string,
    @Param('index') index: number,
    @Body() answerDto: any
  ) {
    return this.formulasService.addAnswer(id, index, answerDto);
  }
} 
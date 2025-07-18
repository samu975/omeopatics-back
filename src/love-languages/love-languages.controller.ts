import { Controller, Get, Post, Body, Req, UseGuards, Patch } from '@nestjs/common';
import { LoveLanguagesService } from './love-languages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('love-languages')
export class LoveLanguagesController {
  constructor(private readonly loveLanguagesService: LoveLanguagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'patient')
  @Get('questions')
  getQuestions(@Req() req) {
    // Solo doctores o pacientes habilitados pueden ver las preguntas
    if (req.user.role === 'patient' && !req.user.loveLanguagesTestEnabled) {
      return { error: 'No autorizado' };
    }
    return this.loveLanguagesService.getQuestions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Post('answers')
  saveAnswers(@Req() req, @Body() body) {
    return this.loveLanguagesService.saveAnswers(req.user.userId, body.answers);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Patch('reset')
  resetAnswers(@Req() req) {
    return this.loveLanguagesService.resetAnswers(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Get('results')
  getResults(@Req() req) {
    return this.loveLanguagesService.getResults(req.user.userId);
  }
} 
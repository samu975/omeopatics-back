import { Controller, Get, Post, Body, Req, UseGuards, Patch } from '@nestjs/common';
import { LoveLanguagesService } from './love-languages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompareWithPartnerDto } from './dto/compare-with-partner.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Love Languages')
@Controller('love-languages')
export class LoveLanguagesController {
  constructor(private readonly loveLanguagesService: LoveLanguagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'patient')
  @Get('questions')
  @ApiResponse({ status: 200, description: 'Preguntas obtenidas exitosamente.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
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
  @ApiBody({ type: [String] })
  @ApiResponse({ status: 201, description: 'Respuestas guardadas exitosamente.' })
  saveAnswers(@Req() req, @Body() body) {
    return this.loveLanguagesService.saveAnswers(req.user._id, body.answers);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Post('category-answers')
  @ApiBody({ type: Object })
  @ApiResponse({ status: 201, description: 'Respuestas de categoría guardadas exitosamente.' })
  saveCategoryAnswers(@Req() req, @Body() body) {
    return this.loveLanguagesService.saveCategoryAnswers(req.user._id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Get('progress')
  @ApiResponse({ status: 200, description: 'Progreso obtenido exitosamente.' })
  getProgress(@Req() req) {
    return this.loveLanguagesService.getProgress(req.user._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Patch('reset')
  @ApiResponse({ status: 200, description: 'Respuestas reiniciadas exitosamente.' })
  resetAnswers(@Req() req) {
    return this.loveLanguagesService.resetAnswers(req.user._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Get('results')
  @ApiResponse({ status: 200, description: 'Resultados obtenidos exitosamente.' })
  getResults(@Req() req) {
    return this.loveLanguagesService.getResults(req.user._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Post('compare-with-partner')
  @ApiBody({ type: CompareWithPartnerDto, examples: {
    ejemplo: {
      value: { partnerCedula: '1234567890' },
      description: 'Cédula de la pareja a comparar.'
    }
  }})
  @ApiResponse({ status: 200, description: 'Resultados de ambos tests', schema: {
    example: {
      user: {
        id: 'usuarioId',
        nombre: 'Juan',
        cedula: '123456789',
        scores: [
          { categoria: 'Palabras de afirmación', recibirAmor: 10, expresarAmor: 8, total: 18 },
          // ...
        ]
      },
      partner: {
        id: 'parejaId',
        nombre: 'Ana',
        cedula: '1234567890',
        scores: [
          { categoria: 'Palabras de afirmación', recibirAmor: 7, expresarAmor: 9, total: 16 },
          // ...
        ]
      }
    }
  }})
  @ApiResponse({ status: 404, description: 'La pareja aún no ha realizado el test de lenguaje del amor' })
  async compareWithPartner(@Req() req, @Body() body: CompareWithPartnerDto) {
    // El userId se toma del token, la cedula de la pareja viene en el body
    return await this.loveLanguagesService.compareWithPartner(req.user._id, body.partnerCedula);
  }
}
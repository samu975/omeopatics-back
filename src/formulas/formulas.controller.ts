import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FormulasService } from './formulas.service';

@ApiTags('Formulas')
@ApiBearerAuth('JWT-auth')
@Controller('formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @ApiOperation({
    summary: 'Obtener todas las fórmulas',
    description: 'Devuelve una lista de todas las fórmulas médicas en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fórmulas obtenida exitosamente',
  })
  @Get()
  findAll() {
    return this.formulasService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener fórmulas de un usuario',
    description: 'Devuelve todas las fórmulas asignadas a un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Fórmulas del usuario obtenidas exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Get('user/:userId')
  async getFormulasByUserId(@Param('userId') userId: string) {
    return this.formulasService.findByUserId(userId);
  }

  @ApiOperation({
    summary: 'Obtener fórmula por ID',
    description: 'Devuelve los detalles de una fórmula específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la fórmula',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Fórmula encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Fórmula no encontrada',
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.formulasService.findById(id);
  }

  @ApiOperation({
    summary: 'Crear fórmula para usuario',
    description: 'Crea una nueva fórmula médica y la asigna a un usuario específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario al que se asignará la fórmula',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Acetaminofén 500mg' },
        description: { type: 'string', example: 'Analgésico para dolor de cabeza' },
        dosis: { type: 'string', example: '1 tableta cada 8 horas' },
        followUpQuestionBankId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        hasFollowUpNotifications: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Fórmula creada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o banco de preguntas no encontrado',
  })
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

  @ApiOperation({
    summary: 'Agregar respuesta de seguimiento',
    description: 'Permite a un paciente responder las preguntas de seguimiento de una fórmula',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la fórmula',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              questionId: { type: 'number', example: 1 },
              type: { type: 'string', enum: ['abierta', 'multiple', 'unica'], example: 'unica' },
              answer: { type: 'array', items: { type: 'string' }, example: ['Muy bien'] },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Respuesta de seguimiento agregada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fórmula no encontrada o sin banco de preguntas asignado',
  })
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

  @ApiOperation({
    summary: 'Obtener respuestas de seguimiento',
    description: 'Devuelve todas las respuestas de seguimiento de una fórmula específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la fórmula',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Respuestas de seguimiento obtenidas exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fórmula no encontrada',
  })
  @Get(':id/followup-responses')
  async getFollowUpResponses(@Param('id') formulaId: string) {
    return this.formulasService.getFollowUpResponses(formulaId);
  }

  @ApiOperation({
    summary: 'Actualizar fórmula',
    description: 'Actualiza los datos de una fórmula existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la fórmula a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Acetaminofén 500mg' },
        description: { type: 'string', example: 'Analgésico para dolor de cabeza' },
        dosis: { type: 'string', example: '1 tableta cada 8 horas' },
        followUpQuestionBankId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        hasFollowUpNotifications: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Fórmula actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fórmula no encontrada',
  })
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

  @ApiOperation({
    summary: 'Eliminar fórmula',
    description: 'Elimina una fórmula del sistema y todas sus respuestas de seguimiento asociadas',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la fórmula a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Fórmula eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fórmula no encontrada',
  })
  @Delete(':id')
  async deleteFormula(@Param('id') formulaId: string) {
    return this.formulasService.deleteFormula(formulaId);
  }
}
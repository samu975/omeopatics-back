import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionBanksService } from './question-banks.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@ApiTags('Question Banks')
@ApiBearerAuth('JWT-auth')
@Controller('question-banks')
export class QuestionBanksController {
  constructor(private readonly questionBanksService: QuestionBanksService) {}

  @ApiOperation({
    summary: 'Crear banco de preguntas',
    description: 'Crea un nuevo banco de preguntas para seguimiento de pacientes',
  })
  @ApiBody({ type: CreateQuestionBankDto })
  @ApiResponse({
    status: 201,
    description: 'Banco de preguntas creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @Post()
  create(@Body() createQuestionBankDto: CreateQuestionBankDto) {
    return this.questionBanksService.create(createQuestionBankDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los bancos de preguntas',
    description: 'Devuelve una lista de todos los bancos de preguntas en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de bancos de preguntas obtenida exitosamente',
  })
  @Get()
  findAll() {
    return this.questionBanksService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener bancos de preguntas activos',
    description: 'Devuelve solo los bancos de preguntas que están marcados como activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de bancos de preguntas activos obtenida exitosamente',
  })
  @Get('active')
  findActive() {
    return this.questionBanksService.findActive();
  }

  @ApiOperation({
    summary: 'Obtener banco de preguntas por ID',
    description: 'Devuelve los detalles de un banco de preguntas específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del banco de preguntas',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Banco de preguntas encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Banco de preguntas no encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBanksService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar banco de preguntas',
    description: 'Actualiza los datos de un banco de preguntas existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del banco de preguntas a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateQuestionBankDto })
  @ApiResponse({
    status: 200,
    description: 'Banco de preguntas actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Banco de preguntas no encontrado',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionBankDto: UpdateQuestionBankDto) {
    return this.questionBanksService.update(id, updateQuestionBankDto);
  }

  @ApiOperation({
    summary: 'Eliminar banco de preguntas',
    description: 'Elimina un banco de preguntas del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del banco de preguntas a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Banco de preguntas eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Banco de preguntas no encontrado',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionBanksService.remove(id);
  }

  @ApiOperation({
    summary: 'Agregar pregunta al banco',
    description: 'Agrega una nueva pregunta a un banco de preguntas existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del banco de preguntas',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: '¿Cómo se siente hoy?' },
        type: { type: 'string', enum: ['abierta', 'multiple', 'unica'], example: 'unica' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              text: { type: 'string', example: 'Muy bien' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Pregunta agregada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Banco de preguntas no encontrado',
  })
  @Post(':id/questions')
  addQuestion(@Param('id') id: string, @Body() question: any) {
    return this.questionBanksService.addQuestion(id, question);
  }

  @ApiOperation({
    summary: 'Eliminar pregunta del banco',
    description: 'Elimina una pregunta específica de un banco de preguntas',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del banco de preguntas',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'questionId',
    description: 'ID de la pregunta a eliminar',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Pregunta eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Banco de preguntas no encontrado',
  })
  @Delete(':id/questions/:questionId')
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: number) {
    return this.questionBanksService.removeQuestion(id, questionId);
  }
} 
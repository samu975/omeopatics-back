import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { HistorialService } from './historial.service';
import { CreateHistorialDto, SesionTrabajadaDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Historial')
@ApiBearerAuth('JWT-auth')
@Controller('historial')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @ApiOperation({
    summary: 'Crear nuevo historial médico',
    description: 'Crea un nuevo historial médico para un paciente. Solo accesible por Admin y Doctor.',
  })
  @ApiBody({ type: CreateHistorialDto })
  @ApiResponse({
    status: 201,
    description: 'Historial médico creado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden crear historiales',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
  })
  @Post()
  create(@Body() createHistorialDto: CreateHistorialDto, @Request() req) {
    return this.historialService.create(createHistorialDto, req.user);
  }

  @ApiOperation({
    summary: 'Obtener todos los historiales médicos',
    description: 'Devuelve una lista de todos los historiales médicos. Solo accesible por Admin y Doctor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de historiales médicos obtenida exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden ver historiales',
  })
  @Get()
  findAll(@Request() req) {
    return this.historialService.findAll(req.user);
  }

  @ApiOperation({
    summary: 'Obtener historial médico de un paciente específico',
    description: 'Devuelve el historial médico completo de un paciente específico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'patientId',
    description: 'ID del paciente',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial del paciente obtenido exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden ver historiales',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
  })
  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string, @Request() req) {
    return this.historialService.findByPatientId(patientId, req.user);
  }

  @ApiOperation({
    summary: 'Obtener historial médico específico',
    description: 'Devuelve un historial médico específico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial encontrado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden ver historiales',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial no encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.historialService.findOne(id, req.user);
  }

  @ApiOperation({
    summary: 'Actualizar historial médico',
    description: 'Actualiza un historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateHistorialDto })
  @ApiResponse({
    status: 200,
    description: 'Historial actualizado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden actualizar historiales',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial no encontrado',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialDto: UpdateHistorialDto, @Request() req) {
    return this.historialService.update(id, updateHistorialDto, req.user);
  }

  @ApiOperation({
    summary: 'Agregar sesión trabajada al historial',
    description: 'Agrega una nueva sesión trabajada a un historial médico existente. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: SesionTrabajadaDto })
  @ApiResponse({
    status: 200,
    description: 'Sesión agregada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden agregar sesiones',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial no encontrado',
  })
  @Post(':id/sesiones')
  addSesionTrabajada(@Param('id') id: string, @Body() sesionData: SesionTrabajadaDto, @Request() req) {
    return this.historialService.addSesionTrabajada(id, sesionData, req.user);
  }

  @ApiOperation({
    summary: 'Eliminar sesión trabajada del historial',
    description: 'Elimina una sesión trabajada específica de un historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'sesionIndex',
    description: 'Índice de la sesión a eliminar (0-based)',
    example: '0',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión eliminada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden eliminar sesiones',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial no encontrado o índice de sesión inválido',
  })
  @Delete(':id/sesiones/:sesionIndex')
  removeSesionTrabajada(@Param('id') id: string, @Param('sesionIndex') sesionIndex: string, @Request() req) {
    const index = parseInt(sesionIndex, 10);
    if (isNaN(index) || index < 0) {
      throw new Error('Índice de sesión debe ser un número válido mayor o igual a 0');
    }
    return this.historialService.removeSesionTrabajada(id, index, req.user);
  }

  @ApiOperation({
    summary: 'Eliminar historial médico',
    description: 'Elimina un historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial eliminado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden eliminar historiales',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial no encontrado',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.historialService.remove(id, req.user);
  }
} 
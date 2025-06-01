import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
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
    description: 'Crea un nuevo registro en el historial médico de un paciente. Solo accesible por Admin y Doctor.',
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
    description: 'Lista de historiales obtenida exitosamente',
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
    summary: 'Obtener historial médico por paciente',
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
  findByPatientId(@Param('patientId') patientId: string, @Request() req) {
    return this.historialService.findByPatientId(patientId, req.user);
  }

  @ApiOperation({
    summary: 'Obtener historial médico específico',
    description: 'Devuelve un registro específico del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial médico',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial médico encontrado',
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
    description: 'Actualiza un registro del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial médico a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateHistorialDto })
  @ApiResponse({
    status: 200,
    description: 'Historial médico actualizado exitosamente',
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
    summary: 'Eliminar historial médico',
    description: 'Elimina un registro del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del historial médico a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial médico eliminado exitosamente',
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
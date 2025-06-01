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
    summary: 'Crear nuevo registro en historial médico',
    description: 'Crea un nuevo registro en el historial médico de un paciente. Solo accesible por Admin y Doctor.',
  })
  @ApiBody({ type: CreateHistorialDto })
  @ApiResponse({
    status: 201,
    description: 'Registro de historial creado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden crear registros',
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
    summary: 'Obtener todos los registros del historial',
    description: 'Devuelve una lista de todos los registros del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros del historial obtenida exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden ver registros',
  })
  @Get()
  findAll(@Request() req) {
    return this.historialService.findAll(req.user);
  }

  @ApiOperation({
    summary: 'Obtener historial de un paciente específico',
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
    summary: 'Obtener registro específico del historial',
    description: 'Devuelve un registro específico del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden ver registros',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.historialService.findOne(id, req.user);
  }

  @ApiOperation({
    summary: 'Actualizar registro del historial',
    description: 'Actualiza un registro del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateHistorialDto })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden actualizar registros',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialDto: UpdateHistorialDto, @Request() req) {
    return this.historialService.update(id, updateHistorialDto, req.user);
  }

  @ApiOperation({
    summary: 'Eliminar registro del historial',
    description: 'Elimina un registro del historial médico. Solo accesible por Admin y Doctor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del registro',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro eliminado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo Admin y Doctor pueden eliminar registros',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.historialService.remove(id, req.user);
  }
} 
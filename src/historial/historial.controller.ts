import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('historial')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  create(@Body() createHistorialDto: CreateHistorialDto, @Request() req) {
    return this.historialService.create(createHistorialDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.historialService.findAll(req.user);
  }

  @Get('patient/:patientId')
  findByPatientId(@Param('patientId') patientId: string, @Request() req) {
    return this.historialService.findByPatientId(patientId, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.historialService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialDto: UpdateHistorialDto, @Request() req) {
    return this.historialService.update(id, updateHistorialDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.historialService.remove(id, req.user);
  }
} 
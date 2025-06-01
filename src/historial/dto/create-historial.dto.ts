import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateHistorialDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  patient: string;

  @ApiProperty({
    description: 'Motivo principal de la consulta médica',
    example: 'Dolor de cabeza persistente y fiebre',
  })
  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @ApiProperty({
    description: 'Antecedentes médicos relevantes del paciente',
    example: 'Hipertensión arterial, diabetes tipo 2',
  })
  @IsString()
  @IsNotEmpty()
  antecedentes: string;

  @ApiProperty({
    description: 'Detalles específicos del diagnóstico y examen físico',
    example: 'Paciente presenta cefalea tensional, signos vitales estables',
  })
  @IsString()
  @IsNotEmpty()
  detalles: string;

  @ApiProperty({
    description: 'Tratamiento médico recomendado',
    example: 'Acetaminofén 500mg cada 8 horas, reposo, hidratación',
  })
  @IsString()
  @IsNotEmpty()
  tratamientoASeguir: string;

  @ApiProperty({
    description: 'Fecha de creación del historial (opcional, se asigna automáticamente)',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaCreacion?: Date;
} 
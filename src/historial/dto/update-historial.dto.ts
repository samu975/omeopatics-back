import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UpdateHistorialDto {
  @ApiProperty({
    description: 'Objetivo principal de la terapia',
    example: 'Reducir la ansiedad y mejorar el manejo del estrés',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  objetivoDeTerapia?: string;

  @ApiProperty({
    description: 'Tratamiento médico recomendado',
    example: 'Terapia cognitivo-conductual semanal, ejercicios de relajación diarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tratamientoASeguir?: string;

  @ApiProperty({
    description: 'Fecha de creación del historial (opcional)',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaCreacion?: Date;
} 
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SesionTrabajadaDto {
  @ApiProperty({
    description: 'Fecha de la sesión',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaSesion: Date;

  @ApiProperty({
    description: 'Descripción de lo que se hizo en la sesión',
    example: 'Se realizó terapia de relajación y ejercicios de respiración',
  })
  @IsString()
  @IsNotEmpty()
  queSeHizo: string;

  @ApiProperty({
    description: 'Recomendaciones para la próxima sesión',
    example: 'Continuar con ejercicios de respiración en casa, practicar meditación 10 minutos diarios',
  })
  @IsString()
  @IsNotEmpty()
  recomendacionesProximaSesion: string;
}

export class CreateHistorialDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  patient: string;

  @ApiProperty({
    description: 'Objetivo principal de la terapia',
    example: 'Reducir la ansiedad y mejorar el manejo del estrés',
  })
  @IsString()
  @IsNotEmpty()
  objetivoDeTerapia: string;

  @ApiProperty({
    description: 'Array de sesiones trabajadas con el paciente',
    type: [SesionTrabajadaDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SesionTrabajadaDto)
  sesionesTrabajadas?: SesionTrabajadaDto[];

  @ApiProperty({
    description: 'Tratamiento médico recomendado',
    example: 'Terapia cognitivo-conductual semanal, ejercicios de relajación diarios',
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
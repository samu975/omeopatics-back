import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateHistorialDto {
  @IsString()
  @IsNotEmpty()
  patient: string;

  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @IsString()
  @IsNotEmpty()
  antecedentes: string;

  @IsString()
  @IsNotEmpty()
  detalles: string;

  @IsString()
  @IsNotEmpty()
  tratamientoASeguir: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: Date;
} 
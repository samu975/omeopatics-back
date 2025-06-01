import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @ApiProperty({
    description: 'ID único de la opción',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Texto de la opción',
    example: 'Muy bien',
  })
  text: string;
}

class QuestionDto {
  @ApiProperty({
    description: 'ID único de la pregunta',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Título de la pregunta',
    example: '¿Cómo se siente hoy?',
  })
  title: string;

  @ApiProperty({
    description: 'Tipo de pregunta',
    enum: ['abierta', 'multiple', 'unica'],
    example: 'unica',
  })
  type: 'abierta' | 'multiple' | 'unica';

  @ApiProperty({
    description: 'Opciones disponibles (solo para preguntas de tipo múltiple o única)',
    type: [OptionDto],
    required: false,
  })
  options?: OptionDto[];
}

export class CreateQuestionBankDto {
  @ApiProperty({
    description: 'Nombre del banco de preguntas',
    example: 'Seguimiento Post-Operatorio',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del propósito del banco de preguntas',
    example: 'Preguntas para el seguimiento de pacientes después de cirugía',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Lista de preguntas del banco',
    type: [QuestionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];

  @ApiProperty({
    description: 'Indica si el banco de preguntas está activo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 
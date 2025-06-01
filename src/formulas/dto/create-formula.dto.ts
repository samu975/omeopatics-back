import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateFormulaDto {
  @ApiProperty({
    description: 'Nombre de la fórmula médica',
    example: 'Fórmula de IMC',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción de la fórmula',
    example: 'Cálculo del Índice de Masa Corporal',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Fórmula matemática',
    example: 'peso / (altura^2)',
  })
  @IsString()
  @IsNotEmpty()
  formula: string;

  @ApiPropertyOptional({
    description: 'ID del banco de preguntas para seguimiento (opcional)',
    example: '64a7b8c9d1e2f3a4b5c6d7e8',
  })
  @IsOptional()
  @IsMongoId()
  followUpQuestionBankId?: string;

  @ApiProperty({
    description: 'Indica si se deben enviar notificaciones de seguimiento',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFollowUpNotifications?: boolean;
} 
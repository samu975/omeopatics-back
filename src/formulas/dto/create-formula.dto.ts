import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFormulaDto {
  @ApiProperty({
    description: 'Nombre de la fórmula médica',
    example: 'Acetaminofén 500mg',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada de la fórmula',
    example: 'Analgésico y antipirético para el tratamiento del dolor y la fiebre',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Dosis y frecuencia de administración',
    example: '1 tableta cada 8 horas por 5 días',
  })
  @IsString()
  @IsNotEmpty()
  dosis: string;

  @ApiProperty({
    description: 'ID del banco de preguntas para seguimiento (opcional)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsString()
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
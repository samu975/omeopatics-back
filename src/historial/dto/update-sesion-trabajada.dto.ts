import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateSesionTrabajadaDto {
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
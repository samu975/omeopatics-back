import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export enum UserRole {
  PATIENT = 'patient',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+57 300 123 4567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Número de cédula único del usuario',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.PATIENT,
    default: UserRole.PATIENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Habilita el test de lenguajes del amor para el usuario', default: false })
  @IsOptional()
  @IsBoolean()
  loveLanguagesTestEnabled?: boolean;

  @ApiPropertyOptional({ description: 'ID del doctor asignado al paciente', example: '665f1b2c3a4d5e6f7a8b9c0d' })
  @IsOptional()
  @IsString()
  doctorId?: string;
} 
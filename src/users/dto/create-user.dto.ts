import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  PATIENT = 'patient',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 
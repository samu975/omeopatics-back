import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  PATIENT = 'patient',
  ADMIN = 'admin',
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

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 
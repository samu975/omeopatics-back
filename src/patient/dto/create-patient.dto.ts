import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('CO', { message: 'Phone number must be valid' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  age?: number;
  address?: string;
}

import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateQuestionBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  questions?: Array<{
    id: number;
    title: string;
    type: 'abierta' | 'multiple' | 'unica';
    options?: Array<{
      id: number;
      text: string;
    }>;
  }>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 
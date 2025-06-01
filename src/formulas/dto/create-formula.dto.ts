import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFormulaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  dosis: string;

  @IsOptional()
  @IsString()
  followUpQuestionBankId?: string;

  @IsOptional()
  @IsBoolean()
  hasFollowUpNotifications?: boolean;
} 
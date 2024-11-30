import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/patient.schema';

export class CreateFormulaDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid date' })
  date: Date;

  @IsNotEmpty({ message: 'Medicine name is required' })
  @IsString({ message: 'Medicine name must be a string' })
  medicineName: string;

  @IsNotEmpty({ message: 'Dosis is required' })
  @IsString({ message: 'Dosis must be a string' })
  dosis: string;

  @IsNotEmpty({ message: 'Doctor is required' })
  doctor: Doctor;

  @IsNotEmpty({ message: 'Patient is required' })
  patient: Patient;
}

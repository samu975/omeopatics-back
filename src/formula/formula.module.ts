import { Module } from '@nestjs/common';
import { FormulaService } from './formula.service';
import { FormulaController } from './formula.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalFormula,
  MedicalFormulaSchema,
} from 'src/schemas/medicalFormule.schema';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalFormula.name, schema: MedicalFormulaSchema },
    ]),
    PatientModule,
  ],
  controllers: [FormulaController],
  providers: [FormulaService],
  exports: [FormulaService],
})
export class FormulaModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formula, FormulaSchema } from '../schemas/formula.schema';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Formula.name, schema: FormulaSchema }])
  ],
  providers: [FormulasService],
  controllers: [FormulasController],
  exports: [FormulasService]
})
export class FormulasModule {} 
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { Formula, FormulaSchema } from '../schemas/formula.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formula.name, schema: FormulaSchema },
      { name: User.name, schema: UserSchema }
    ]),
    AuthModule,
  ],
  controllers: [FormulasController],
  providers: [FormulasService],
})
export class FormulasModule {} 
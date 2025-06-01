import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { Formula, FormulaSchema } from '../schemas/formula.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { QuestionBank, QuestionBankSchema } from '../schemas/questionBank.schema';
import { FollowUpResponse, FollowUpResponseSchema } from '../schemas/followUpResponse.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formula.name, schema: FormulaSchema },
      { name: User.name, schema: UserSchema },
      { name: QuestionBank.name, schema: QuestionBankSchema },
      { name: FollowUpResponse.name, schema: FollowUpResponseSchema }
    ]),
    AuthModule,
  ],
  controllers: [FormulasController],
  providers: [FormulasService],
})
export class FormulasModule {} 
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBanksService } from './question-banks.service';
import { QuestionBanksController } from './question-banks.controller';
import { QuestionBank, QuestionBankSchema } from '../schemas/questionBank.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionBank.name, schema: QuestionBankSchema }
    ]),
  ],
  controllers: [QuestionBanksController],
  providers: [QuestionBanksService],
  exports: [QuestionBanksService],
})
export class QuestionBanksModule {} 
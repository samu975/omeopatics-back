import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './question.schema';

@Schema()
export class Answer {
  @Prop({ type: QuestionSchema, required: true })
  question: Question;

  @Prop({ required: true, enum: ['abierta', 'multiple', 'unica'] })
  type: 'abierta' | 'multiple' | 'unica';

  @Prop({ type: [String], required: true })
  answer: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

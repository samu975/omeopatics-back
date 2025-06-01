import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question, QuestionSchema } from './question.schema';

@Schema({ timestamps: true })
export class QuestionBank extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];

  @Prop({ default: true })
  isActive: boolean;
}

export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank); 
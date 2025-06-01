import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Formula } from './formula.schema';
import { QuestionBank } from './questionBank.schema';
import { Answer, AnswerSchema } from './answer.schema';

@Schema({ timestamps: true })
export class FollowUpResponse extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  patient: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Formula', required: true })
  formula: Formula;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'QuestionBank', required: true })
  questionBank: QuestionBank;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop({ default: Date.now })
  responseDate: Date;
}

export const FollowUpResponseSchema = SchemaFactory.createForClass(FollowUpResponse); 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Answer, AnswerSchema } from './answer.schema';

@Schema({ timestamps: true })
export class Formula extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Array, required: true })
  questions: any[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];
}

export const FormulaSchema = SchemaFactory.createForClass(Formula); 
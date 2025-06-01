import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { QuestionBank } from './questionBank.schema';

@Schema({ timestamps: true })
export class Formula extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true})
  dosis: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'QuestionBank', required: false })
  followUpQuestionBank?: QuestionBank;

  @Prop({ default: false })
  hasFollowUpNotifications: boolean;
}

export const FormulaSchema = SchemaFactory.createForClass(Formula); 
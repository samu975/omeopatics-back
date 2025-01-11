import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './answer.schema';

@Schema()
export class FollowUp {
  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FollowUpSchema = SchemaFactory.createForClass(FollowUp); 
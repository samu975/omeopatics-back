import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FollowUp, FollowUpSchema } from './followup.schema';

export type FormulaDocument = Formula & Document;

@Schema()
export class Formula {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [FollowUpSchema], default: [] })
  followUps: FollowUp[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FormulaSchema = SchemaFactory.createForClass(Formula); 
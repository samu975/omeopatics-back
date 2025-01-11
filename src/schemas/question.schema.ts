import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Option, OptionSchema } from './option.schema';

@Schema()
export class Question {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['abierta', 'multiple', 'unica'] })
  type: 'abierta' | 'multiple' | 'unica';

  @Prop({ type: [OptionSchema] })
  options?: Option[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

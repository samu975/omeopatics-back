import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Option {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  text: string;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

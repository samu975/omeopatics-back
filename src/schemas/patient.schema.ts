import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  password: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

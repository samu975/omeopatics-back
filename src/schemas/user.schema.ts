import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Formula } from './formula.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['admin', 'patient'], default: 'patient' })
  role: 'admin' | 'patient';

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Formula' }] })
  asignedFormulas: Formula[];
}

export const UserSchema = SchemaFactory.createForClass(User);

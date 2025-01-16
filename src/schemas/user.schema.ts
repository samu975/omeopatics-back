import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../users/dto/create-user.dto';
import { Formula } from './formula.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  cedula: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Formula' }] })
  asignedFormulas: Formula[];
}

export const UserSchema = SchemaFactory.createForClass(User);

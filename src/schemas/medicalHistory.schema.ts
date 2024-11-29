import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from './patient.schema';
import { Doctor } from './doctor.schema';

export type MedicalHistoryDocument = HydratedDocument<MedicalHistory>;

@Schema()
export class MedicalHistory {
  @Prop()
  date: Date;

  @Prop()
  description: string;

  @Prop({ required: true })
  diagnostic: string;

  @Prop()
  treatment: string;

  @Prop()
  prescription: string;

  @Prop()
  notes: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctor: Doctor;
}

export const MedicalHistorySchema =
  SchemaFactory.createForClass(MedicalHistory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from './patient.schema';
import { Doctor } from './doctor.schema';

export type MedicalFormulaDocument = HydratedDocument<MedicalFormula>;

@Schema()
export class MedicalFormula {
  @Prop()
  date: Date;

  @Prop()
  medicineName: string;

  @Prop()
  dosis: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctor: Doctor;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient;
}

export const MedicalFormulaSchema =
  SchemaFactory.createForClass(MedicalFormula);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Historial extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  patient: User;

  @Prop({ required: true })
  motivoConsulta: string;

  @Prop({ required: true })
  antecedentes: string;

  @Prop({ required: true })
  detalles: string;

  @Prop({ required: true })
  tratamientoASeguir: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const HistorialSchema = SchemaFactory.createForClass(Historial); 
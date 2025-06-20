import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

// Esquema para las sesiones trabajadas
@Schema({ _id: false })
export class SesionTrabajada {
  @Prop({ required: true })
  fechaSesion: Date;

  @Prop({ required: true })
  queSeHizo: string;

  @Prop({ required: true })
  recomendacionesProximaSesion: string;
}

export const SesionTrabajadaSchema = SchemaFactory.createForClass(SesionTrabajada);

@Schema({ timestamps: true })
export class Historial extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  patient: User;

  @Prop({ required: true })
  objetivoDeTerapia: string;

  @Prop({ type: [SesionTrabajadaSchema], default: [] })
  sesionesTrabajadas: SesionTrabajada[];

  @Prop({ required: true })
  tratamientoASeguir: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const HistorialSchema = SchemaFactory.createForClass(Historial); 
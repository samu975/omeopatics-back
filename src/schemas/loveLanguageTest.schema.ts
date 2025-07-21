import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class LoveLanguageTest extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: Array, default: [] })
  answers: Array<{
    group: number;
    answers: number[]; // índice de la respuesta seleccionada por pregunta
  }>;

  @Prop({ type: Array, default: [] })
  scores: number[]; // Puntuación por grupo

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean; // Indica si el usuario ha completado todas las categorías
}

export const LoveLanguageTestSchema = SchemaFactory.createForClass(LoveLanguageTest); 
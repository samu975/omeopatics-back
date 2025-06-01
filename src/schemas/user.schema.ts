import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../users/dto/create-user.dto';
import { Formula } from './formula.schema';
import { Historial } from './historial.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  cedula: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Formula' }] })
  asignedFormulas: Formula[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Historial' }], default: [] })
  historial: Historial[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Agregar esto después de crear el esquema
UserSchema.index({ cedula: 1 }, { unique: true });
// Eliminar cualquier otro índice único que pueda existir
UserSchema.index({ phone: 1 }, { unique: false });

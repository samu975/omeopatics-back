import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { FormulaModule } from './formula/formula.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PatientModule,
    AuthModule,
    FormulaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

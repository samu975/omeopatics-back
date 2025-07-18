import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormulasModule } from './formulas/formulas.module';
import { HistorialModule } from './historial/historial.module';
import { QuestionBanksModule } from './question-banks/question-banks.module';
import { LoveLanguagesModule } from './love-languages/love-languages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    FormulasModule,
    HistorialModule,
    QuestionBanksModule,
    LoveLanguagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

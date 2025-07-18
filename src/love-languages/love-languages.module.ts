import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoveLanguagesService } from './love-languages.service';
import { LoveLanguagesController } from './love-languages.controller';
import { LoveLanguageTest, LoveLanguageTestSchema } from '../schemas/loveLanguageTest.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoveLanguageTest.name, schema: LoveLanguageTestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [LoveLanguagesController],
  providers: [LoveLanguagesService],
})
export class LoveLanguagesModule {} 
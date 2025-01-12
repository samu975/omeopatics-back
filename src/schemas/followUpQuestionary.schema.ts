import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Question } from "./question.schema";

@Schema()
export class FollowUpQuestionary {
  @Prop()
  questions: Question[];
}

export const FollowUpQuestionarySchema = SchemaFactory.createForClass(FollowUpQuestionary);

export class CreateFollowUpQuestionaryDto {
  questions: {
    id: number;
    title: string;
    type: 'abierta' | 'multiple' | 'unica';
    options?: Array<{
      id: number;
      text: string;
    }>;
  }[];
} 
export class CreateAnswerDto {
  question: {
    id: number;
    title: string;
    type: 'abierta' | 'multiple' | 'unica';
  };
  type: 'abierta' | 'multiple' | 'unica';
  answer: string[];
} 
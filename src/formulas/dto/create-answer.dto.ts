export class CreateAnswerDto {
  question: string;
  type: 'abierta' | 'multiple' | 'unica';
  answer: string | string[];
}
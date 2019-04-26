import { Answer } from "./answer";

export class Question {
    id: number;
    quizId: number;
    text: string;
    
    answers: Answer[];
}
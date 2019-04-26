import { Question } from "./question";
import { Result } from "./result";

export class Quiz {
    id: number;
    userId: string;
    title: string;
    description: string;
    likeCount: number;
    viewCount: number;
    liked: boolean;
    published: boolean;

    questions: Question[];
    results: Result[];
}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Question } from "../models/question";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class QuestionService {
    constructor(private http: HttpClient) { }

    getQuestions(quizId: number): Observable<Question[]> {
        return this.http.get<Question[]>(`api/question/All/${quizId}`);
    }

    // CRUD
    getQuestion(questionId: number): Observable<Question> {
        return this.http.get<Question>(`api/question/${questionId}`);
    }

    createQuestion(question: Question): Observable<Question> {
        return this.http.post<Question>('api/question', question);
    }
    
    editQuestion(question: Question): Observable<Question> {
        return this.http.put<Question>('api/question', question);
    }

    deleteQuestion(questionId: number): Observable<any> {
        return this.http.delete(`api/question/${questionId}`);
    }
}
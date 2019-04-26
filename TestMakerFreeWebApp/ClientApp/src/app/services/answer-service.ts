import { Injectable } from "@angular/core";
import { Answer } from "../models/answer";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class AnswerService {
    constructor(private http: HttpClient) { }

    getAnswers(questionId: number): Observable<Answer[]> {
        return this.http.get<Answer[]>(`api/answer/all/${questionId}`);
    }

    // CRUD
    getAnswer(answerId: number): Observable<Answer> {
        return this.http.get<Answer>(`api/answer/${answerId}`);
    }

    createAnswer(answer: Answer): Observable<Answer> {
        return this.http.post<Answer>('api/answer', answer);
    }

    updateAnswer(answer: Answer): Observable<Answer> {
        return this.http.put<Answer>('api/answer', answer);
    }

    deleteAnswer(answerId: number): Observable<any> {
        return this.http.delete(`api/answer/${answerId}`);
    }
}
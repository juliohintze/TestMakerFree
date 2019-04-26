import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Quiz } from "../models/quiz";
import { Observable, of } from "rxjs";
import { QuizSearchRequest } from "../models/quiz-search";
import { SearchResponse } from "../models/search-response";
import { AuthService } from "./auth-service";
import { switchMap, catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    search(quizSearchRequest: QuizSearchRequest): Observable<SearchResponse<Quiz>> {
        let r = quizSearchRequest;
        let params = new HttpParams()
            .set('orderBy', r.orderBy);

        if (r.title)           params = params.set('title', r.title);
        if (r.userId)          params = params.set('userId', r.userId);
        if (isFinite(r.num))   params = params.set('num', r.num.toString());
        if (isFinite(r.page))  params = params.set('page', r.page.toString());

        return this.http.get<SearchResponse<Quiz>>('api/quiz', { params: params });
    }

    getYourQuizzes(quizSearchRequest: QuizSearchRequest): Observable<SearchResponse<Quiz>> {
        let { num, page, title } = quizSearchRequest;
        let params = new HttpParams();

        if (title)          params = params.set('title', title);
        if (isFinite(num))  params = params.set('num', num.toString());
        if (isFinite(page)) params = params.set('page', page.toString());

        return this.http.get<SearchResponse<Quiz>>('api/quiz/made', { params: params });
    }

    getLikedQuizzes(quizSearchRequest: QuizSearchRequest): Observable<SearchResponse<Quiz>> {
        let { num, page, title } = quizSearchRequest;
        let params = new HttpParams();

        if (title)          params = params.set('title', title);
        if (isFinite(num))  params = params.set('num', num.toString());
        if (isFinite(page)) params = params.set('page', page.toString());

        return this.http.get<SearchResponse<Quiz>>('api/quiz/like', { params: params });
    }

    getTakenQuizzes(quizSearchRequest: QuizSearchRequest): Observable<SearchResponse<Quiz>> {
        let { num, page, title } = quizSearchRequest;
        let params = new HttpParams();

        if (title)          params = params.set('title', title);
        if (isFinite(num))  params = params.set('num', num.toString());
        if (isFinite(page)) params = params.set('page', page.toString());

        return this.http.get<SearchResponse<Quiz>>('api/quiz/take', { params: params });
    }

    likeQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.put<Quiz>(`api/quiz/like`, quiz);
    }
    
    takeQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.put<Quiz>(`api/quiz/take`, quiz);
    }

    getQuizCount(userId: string): Observable<number> {
        return this.http.get<any>(`api/quiz/count`, { params: { userId: userId } })
            .pipe(
                switchMap(res => of(res.quizCount)),
                catchError(() => of(0))
            )
    }

    togglePublish(id: number): Observable<Quiz> {
        return this.http.put<Quiz>(`api/quiz/publish/${id}`, null);
    }

    // CRUD
    getQuiz(id: number, deep = false): Observable<Quiz> {
        let params = new HttpParams()
            .set('deep', deep.toString());

        return this.http.get<Quiz>(`api/quiz/${id}`, { params: params });
    }

    createQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.post<Quiz>('api/quiz', quiz);
    }

    updateQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.put<Quiz>('api/quiz', quiz);
    }

    deleteQuiz(id: number): Observable<any> {
        return this.http.delete(`api/quiz/${id}`);
    }
}
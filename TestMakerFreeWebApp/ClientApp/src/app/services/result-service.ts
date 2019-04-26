import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Result } from "../models/result";
import { switchMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class ResultService {
    constructor(private http: HttpClient) { }

    getResults(quizId: number): Observable<Result[]> {
        return this.http.get<Result[]>(`api/result/all/${quizId}`).pipe(
            switchMap(res => {
                let newRes = res.sort((a,b) => a.priority - b.priority);

                return of(newRes);
            })
        );
    }

    changePriority(result: Result): Observable<Result[]> {
        return this.http.put<Result[]>('api/result/priority', result).pipe(
            switchMap(res => {
                let newRes = res.sort((a,b) => a.priority - b.priority);

                return of(newRes);
            })
        );
    }

    // CRUD
    getResult(resultId: number): Observable<Result> {
        return this.http.get<Result>(`api/result/${resultId}`);
    }

    createResult(result: Result): Observable<Result> {
        return this.http.post<Result>('api/result', result);
    }

    updateResult(result: Result): Observable<Result> {
        return this.http.put<Result>('api/result', result);
    }

    deleteResult(resultId: number): Observable<any> {
        return this.http.delete(`api/result/${resultId}`);
    }
}
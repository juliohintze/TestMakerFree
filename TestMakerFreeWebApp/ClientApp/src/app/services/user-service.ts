import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { User } from "../models/user";
import { Observable, throwError, of } from "rxjs";
import { Register } from "../models/register";
import { catchError, switchMap } from "rxjs/operators";
import { SearchResponse } from "../models/search-response";
import { ChangePassword } from "../models/change-password";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }

    url = 'api/user';

    searchUsers(search: string, num = 10, page = 1): Observable<SearchResponse<User>> {
        let params = new HttpParams()
            .set('search', search)
            .set('num', num.toString())
            .set('page', page.toString());

        return this.http.get<SearchResponse<User>>(`${this.url}`, { params: params });
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.url}/${id}`);
    }

    createUser(register: Register): Observable<User> {
        return this.http.post<User>(this.url, register)
            .pipe(
                catchError(err => {
                    (window as any).c = err;
                    return throwError(err);
                })
            );
    }

    changePassword(data: ChangePassword): Observable<boolean> {
        return this.http.put(`${this.url}`, data).pipe(
            switchMap(() => {
                return of(true);
            }),
            catchError(() => {
                return of(false);
            })
        );
    }
}
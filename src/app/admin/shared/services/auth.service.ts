import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfases";
import { catchError, Observable, Subject, tap, throwError } from "rxjs";
import { keys } from "src/app/keys/keys";

@Injectable({providedIn: 'root'})
export class AuthService {

    public error$: Subject<string> = new Subject<string>()

    constructor(private http: HttpClient) {}

    get token() : string | null {
        const expDate = new Date(localStorage.getItem('fb-token-exp')!)
        if (new Date() > expDate) {
            this.logout()
            return null
        }
        return localStorage.getItem('fb-token')
    }

    login(user: User) : Observable<any> {
        user.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${keys.apiKey}`, user)
        .pipe(
            tap<any>(this.setToken),
            catchError<any, any>(this.handleError.bind(this))
        )
    }

    logout() {
        this.setToken(null)
    }

    isAuthentificated() : boolean {
        return !!this.token
    }

    private handleError(error: HttpErrorResponse) {
        const {message} = error.error.error
        switch (message) {
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Email not registered!')
                break
            case 'INVALID_PASSWORD':
                this.error$.next('Incorrect Password!')
                break
            case 'INVALID_EMAIL':
                this.error$.next('Incorrect Email!')
                break
        }
        return throwError(error)
    }

    private setToken(response: FbAuthResponse | null) {
        if (response) {
            const expDate = new Date( new Date().getTime() + +response.expiresIn * 1000)
            localStorage.setItem('fb-token', response.idToken)
            localStorage.setItem('fb-token-exp', expDate.toString())
        } else {
            localStorage.clear()
        }        
    }

}
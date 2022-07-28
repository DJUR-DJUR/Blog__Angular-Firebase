import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfases";
import { Observable, tap } from "rxjs";
import { keys } from "src/app/keys/keys";

@Injectable()
export class AuthService {

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
            tap<any>(this.setToken)
        )
    }

    logout() {
        this.setToken(null)
    }

    isAuthentificated() : boolean {
        return !!this.token
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
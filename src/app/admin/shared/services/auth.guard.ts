import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private auth: AuthService,
        private router: Router
        ) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): any //boolean | Observable<boolean> | Promise<boolean>  
        {
            if (this.auth.isAuthentificated()) {
                return true
            } else {
                this.auth.logout()
                this.router.navigate( ['/admin', 'login'], {
                    queryParams: {
                        loginAgain: true
                    }
                })
            }
    }

}
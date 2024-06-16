import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  canActivate() {
    let Role =localStorage.getItem("role");
    if (Role =="ADMIN" ){
      return true
    }
    alert("YOU DONT HAVE ADMIN  RIGHTS")
    return false;
  }
  
}

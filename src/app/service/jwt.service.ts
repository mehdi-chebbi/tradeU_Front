import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const BASE_URL =["https://backendtradeu.azurewebsites.net/"]

@Injectable({
  providedIn: 'root'
})
export class JwtService {


 private   BASE_URL ="https://backendtradeu.azurewebsites.net/";


  constructor(private http:HttpClient) { }
  register(signUpRequest:any):Observable<any>{
    return this.http.post(BASE_URL+ 'auth/signup',signUpRequest)

  }


  login(signInRequest:any):Observable<any>{
    return this.http.post(BASE_URL+ 'auth/signin',signInRequest)

  }



  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(BASE_URL+'auth/envoicode', { email }, { responseType: 'text' });
  }

  resetpassword(resetRequest:any):Observable<any>{
    return this.http.post(BASE_URL+'auth/resetpassword',resetRequest,{ responseType: 'text' })
  }




  logout(token: string): Observable<any> {
    return this.http.post(BASE_URL + 'public/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

}



updateProfile(updateRequest: any): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP PUT avec les en-têtes appropriés
    return this.http.post(BASE_URL + 'public/profile', updateRequest, { headers });
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}

retrieveusers(): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Utilisation de backticks pour interpoler la variable token
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return new Observable((observer) => {
      this.http.get(this.BASE_URL + "admin/listUsers", { headers }).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          console.error('Error retrieving biens: ', error);
          observer.error('Error retrieving biens');
        }
      );
    });
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}



deleteUser(userId: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP DELETE avec les en-têtes appropriés
    return this.http.delete(`${this.BASE_URL}admin/delete/${userId}`, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Une erreur est survenue lors de la suppression de l\'utilisateur : ', error);
        return throwError(error);
      })
    );
  } else {
    // Gérer le cas où le token n'est pas présent
    console.error('Token not found');
    return throwError('Token not found');
  }
}

banuser(userId: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP DELETE avec les en-têtes appropriés
    return this.http.post(`${this.BASE_URL}admin/ban/${userId}`, {}, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Une erreur est survenue lors de la ban de l\'utilisateur : ', error);
        return throwError(error);
      })
    );
  } else {
    // Gérer le cas où le token n'est pas présent
    console.error('Token not found');
    return throwError('Token not found');
  }
}


unbanuser(userId: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP DELETE avec les en-têtes appropriés
    return this.http.post(`${this.BASE_URL}admin/unban/${userId}`, {}, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Une erreur est survenue lors de la ban de l\'utilisateur : ', error);
        return throwError(error);
      })
    );
  } else {
    // Gérer le cas où le token n'est pas présent
    console.error('Token not found');
    return throwError('Token not found');
  }
}




}

import { Injectable } from '@angular/core';
const BASE_URL =["https://backendtradeu.azurewebsites.net/"]
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BienserviceService {

  biens: any[] = [];
  private BASE_URL = 'https://backendtradeu.azurewebsites.net/';


  constructor(private http:HttpClient) { }
  trierParPrixCroissant(biens: any[]): any[] {
    return biens.slice().sort((a, b) => a.prix - b.prix);
  }

  trierParPrixDecroissant(biens: any[]): any[] {
    return biens.slice().sort((a, b) => b.prix - a.prix);
  }

  trierParDateAjoutCroissante(biens: any[]): any[] {
    return biens.slice().sort((a, b) => new Date(a.dateAjout).getTime() - new Date(b.dateAjout).getTime());
  }

  trierParDateAjoutDecroissante(biens: any[]): any[] {
    return biens.slice().sort((a, b) => new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime());
  }


 addbien(bienrequest:any):Observable<any>{
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP PUT avec les en-têtes appropriés
    return this.http.post(BASE_URL + 'user/bien/add_bien', bienrequest, { headers });
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}


updateBien(id: number, bien: any): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.BASE_URL}user/bien/update_bien/${id}`, bien, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}


getBienById(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return this.http.get(`${this.BASE_URL}user/bien/get_bien/${id}`, { headers });
  } else {
    // Gérer le cas où le token n'est pas présent
    console.error('Token not found');
    return throwError('Token not found');
  }
}








retrievebiens(): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return new Observable((observer) => {
      this.http.get(this.BASE_URL + 'user/bien/retriveAllbien', { headers }).subscribe(
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

retrievebiensadmin(): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return new Observable((observer) => {
      this.http.get(this.BASE_URL + 'admin/bien/retriveAllbien', { headers }).subscribe(
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

deleteBien(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.BASE_URL}user/bien/delete_bien/${id}`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}


deleteBienadmin(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.BASE_URL}admin/bien/delete_bien_admin/${id}`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}




activerbien(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.BASE_URL}admin/bien/autorisation/${id}`, null, { headers: headers , responseType: 'text'})
      .pipe(
        catchError(this.handleError)
      );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}



desactiverbien(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.BASE_URL}admin/bien/notautorisation/${id}`, null, { headers: headers , responseType: 'text'})
      .pipe(
        catchError(this.handleError)
      );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}





changerEtatAutorisationBien(id: number): Observable<any> {
  const url = `${this.BASE_URL}admin/bien/autorisation/${id}`;
  return this.http.post(url, null);
}


private handleError(error: any) {
  console.error('Error in service:', error);
  return throwError(error);
}


////////////////////////////

getCategories(): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return new Observable((observer) => {
      this.http.get(this.BASE_URL + 'public/retrieve_all_categories', { headers }).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          console.error('Error retrieving categories: ', error);
          observer.error('Error retrieving categories');
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


getBiensParCategorie(idCategorie: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.BASE_URL}retrieve_biens_by_category_id/${idCategorie}`, { headers });
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}


addCategorie(categorie: any): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.BASE_URL}public/add_categorie`, categorie, { headers })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  } else {
    console.error('Token not found');
    throw new Error('Token not found');
  }
}
updatecategorie(id: number, categorie: any): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Spécifiez le type de contenu JSON
    });

    return this.http.post(`${this.BASE_URL}public/update_categorie/${id}`, categorie, { headers: headers });
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}




getcategorieById(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés
    return this.http.get(`${this.BASE_URL}public/categorie/get_categorie/${id}`, { headers });
  } else {
    // Gérer le cas où le token n'est pas présent
    console.error('Token not found');
    return throwError('Token not found');
  }
}





deletecategorie(id: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.BASE_URL}public/delete_categorie/${id}`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  } else {
    // Gérer le cas où le token n'est pas présent
    // Vous pouvez afficher un message d'erreur ou rediriger l'utilisateur vers la page de connexion
    console.error('Token not found');
    return throwError('Token not found');
  }
}
updateBadFeedCount(bienId: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {

  const url = `${this.BASE_URL}user/bien/update-badfeedcountbien/${bienId}`;

  // Set the Authorization header with the bearer token
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token
  });

  return this.http.patch<any>(url, {}, { headers }).pipe(
    catchError(error => {
      return throwError('Failed to update badfeedcount: ' + error.message);
    })
  );}else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}

}

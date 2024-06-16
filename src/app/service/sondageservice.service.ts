import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SondageService {

  private baseUrl = 'https://backendtradeu.azurewebsites.net/Sondagecontroller'; // Replace this with your backend API URL

  constructor(private http: HttpClient) { }

  fetchSAllSondages(): Observable<any> {
    // Retrieve JWT token from local storage
    const token = localStorage.getItem('jwt');

    // Check if token exists
    if (token) {
      // Create HTTP headers with bearer token
      const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

      // Pass headers with the HTTP GET request
      return this.http.get<any>(`${this.baseUrl}/retrieve-All-Sondage`, { headers });
    } else {
      // Handle case where token is not found
      console.error('Token not found');
      // You can choose to return an observable with an error or handle it in another way
      return throwError('Token not found');
    }
  }

  addSondage(sondageData: any): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<any>(`${this.baseUrl}/add-sondage`, sondageData, { headers }).pipe(

            catchError(error => {
                console.error('Error adding sondage:', error);
                return throwError('Error adding sondage');
            })
        );
    } else {
        console.error('Token not found');
        return throwError('Token not found');
    }
}

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get('https://backendtradeu.azurewebsites.net/auth/get-current-user', { headers }).pipe(
        catchError(error => {
          console.error('Error fetching publications:', error);
          return throwError('Error fetching publications');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
}
addSondageAndQuestions(sondageData: any, questions: string[]): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Include questions along with sondageData
    const data = {
      sondage: sondageData,
      questions: questions
    };

    return this.http.post<any>(`${this.baseUrl}/add-sondage-and-questions`, data, { headers }).pipe(
      catchError(error => {
        console.error('Error adding sondage and questions:', error);
        return throwError(error);
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
addUserToSondage(sondageId: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl}/add-participant-to-sondage/${sondageId}`;

    return this.http.post(url, {}, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error adding user to sondage:', error);
        if (error.error && error.error.includes('Duplicate entry')) {
          console.log('User already participated in the sondage');
        }
        return throwError(error);
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
updateSondageStatus(sondageId: number, isActive: boolean): Observable<string> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl}/change-sondage-status/${sondageId}?isActive=${isActive}`;

    return this.http.patch<string>(url, {}, { headers }).pipe(
      catchError(error => {
        console.error('Error updating sondage status:', error);
        return throwError(error);
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
deleteSondage(idSondage: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl}/${idSondage}/delete-sondage`;
    return this.http.delete<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting sondage:', error);
        return throwError('Error deleting sondage:');
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
getParticipantsBySondage(idSondage: number): Observable<any> {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem('jwt');

  // Check if token exists
  if (token) {
    // Create HTTP headers with bearer token
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    // Pass headers with the HTTP GET request
    return this.http.get<any>(`${this.baseUrl}/get-participants-byIdSondage/${idSondage}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user by idsondage:', error);
        return throwError('Error fetching user by idsondage:');
      })
    );

  } else {
    // Handle case where token is not found
    console.error('Token not found');
    // You can choose to return an observable with an error or handle it in another way
    return throwError('Token not found');
  }
}
downloadExcel(): void {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get(`${this.baseUrl}/export-sondages`, { headers, responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error downloading:', error);
        return throwError('Error downloading:');
      })
    ).subscribe((response: Blob) => {
      const blobUrl = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'sondages.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    });
  }
}
downloadExcelForSingleSondage(idSondage: number): void {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get(`${this.baseUrl}/export-single-sondage/${idSondage}`, { headers, responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error downloading:', error);
        return throwError('Error downloading:');
      })
    ).subscribe((response: Blob) => {
      const blobUrl = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'sondage.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    });
  }
}
fetchSondagesEndingWithinNextWeekPeriodically(intervalMs: number): Observable<any[]> {
  return interval(intervalMs).pipe(
    switchMap(() => {
      // Get token from local storage
      const token = localStorage.getItem('jwt');

      // Create headers with Authorization token
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

      // Make HTTP GET request with headers
      return this.http.get<any[]>(`${this.baseUrl}/endingWithinNextWeek`, { headers });
    })
  );
}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GatewayService {
  //private url = 'http://beaugeste.ddns.net';
  private url = 'http://192.168.1.100:3000';

  constructor(
    private http: HttpClient,
    //private messageService: MessageService
    ) { }

  getServerStatus() {
    return this.http.get(this.url + '/')
      .pipe(
        catchError(this.handleError('getServerStatus', false))
      );
  }

  getOnlineMs() {
    return this.http.get(this.url + '/online')
      .pipe(
        catchError(this.handleError('getOnlineMs', []))
      );
  }

  getOfflineMs() {
    return this.http.get(this.url + '/offline')
      .pipe(
        catchError(this.handleError('getOfflineMs', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      //this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantsService {
  private url: string = '';

  constructor(
    private http: HttpClient,
    //private messageService: MessageService
    ) { }

  setPlantsUrl(url: string) {
    this.url = 'http://' + url + ':4000';
  }

  getPlantsStatus() {
    this.checkPlantsUrl();
    return this.http.get(this.url + '/')
      .pipe(
        catchError(this.handleError('openPlants', {}))
      );
  }

  openPlants() {
    this.checkPlantsUrl();
    return this.http.get(this.url + '/activate')
      .pipe(
        catchError(this.handleError('openPlants', {}))
      );
  }

  closePlants() {
    this.checkPlantsUrl();
    return this.http.get(this.url + '/deactivate')
      .pipe(
        catchError(this.handleError('closePlants', {}))
      );
  }

  private checkPlantsUrl() {
    if (!this.url) { throw new Error('No plants url'); }
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
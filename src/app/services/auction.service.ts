import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private static emitter: {
    [eventName: string]: EventEmitter<any>;
  } = {};

  constructor(private httpClient: HttpClient) {}

  static get(eventName: string): EventEmitter<any> {
    if (!this.emitter[eventName]) {
      this.emitter[eventName] = new EventEmitter<any>();
      return this.emitter[eventName];
    }
    return this.emitter[eventName];
  }

  makeOffer(payload: any) {
    return this.httpClient
      .post(`http://10.0.2.196:8080/auction/command/bet`, payload)
      .pipe(catchError(this.handleError));
  }

  statusOffer() {
    const params = `?offerItemId=1646&offerToken=fdff7eeb378c6ed5b0e31d90a728037e`;
    return this.httpClient
      .get(`http://10.0.2.196:8080/auction/command/status${params}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}

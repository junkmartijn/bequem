import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Task } from '../models/task';
import { HeatStatusResponse } from '../models/heat-status-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, takeLast } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeatControlService {

  private heatControlBaseUrl = 'http://demo5335077.mockable.io/';
  private heatControlTasksUrl = this.heatControlBaseUrl + 'api/tasks';
  private heatControlOverrideUrl = 'http://192.168.1.150/overrides?onzin=1&';
  private heatControlStatusUrl = 'http://192.168.1.150/heat_status';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeatStatuses(): Observable<HeatStatusResponse> {
    return this.http.get<HeatStatusResponse>(this.heatControlStatusUrl).pipe(
      tap(_ => this.messageService.add('fetched status')),
      catchError(this.handleHttpError<HeatStatusResponse>('getHeatStatuses')));
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.heatControlTasksUrl)
      .pipe(
        tap(_ => this.messageService.add('fetched tasks')),
        catchError(this.handleHttpError('getTasks', []))
      );
  }

  setPermanentOverride(state: boolean): Observable<string> {
    this.messageService.add(`Permanente override ${state ? "aan" : "uit"} gezet`);

    return this.http.get<string>(this.heatControlOverrideUrl + "permanent=" + state).pipe(
      tap((msg: string) => this.messageService.add(`Permanent override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setPermanentOverride')));
  }

  setTemporaryOverride(state: boolean): Observable<string> {
    this.messageService.add(`Tijdelijke override ${state ? "aan" : "uit"} gezet`);

    return this.http.get<string>(this.heatControlOverrideUrl + "temporary=" + state).pipe(
      tap((msg: string) => this.messageService.add(`Override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setTemporaryOverride')));
  }
  
  addTask(task: Task): Observable<string> {
    this.messageService.add(`addTask called with time ${task.datetime} and action ${task.action}`);

    let newTask = {
      hour: task.datetime.getHours,
      min: task.datetime.getMinutes,
      action: task.action
    }

    return this.http.post<string>(this.heatControlTasksUrl, newTask, httpOptions).pipe(
      tap((msg: string) => this.messageService.add(`Taak toegevoegd, response: ${msg}`)),
      catchError(this.handleHttpError<string>('addTask')));
  }

  private handleHttpError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.add(`${operation} failed: ${error.message}`);

      return of(result as T); // keep app running by returning an empty result.
    };
  }
}

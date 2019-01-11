import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Task } from '../models/task';
import { HeatStatus } from '../models/heat-status';
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
  private heatControlOverridesUrl = this.heatControlBaseUrl + 'api/overrides';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeatStatuses(): HeatStatus[] {
    let status1: HeatStatus = new HeatStatus();
    let status2: HeatStatus = new HeatStatus();
    let status3: HeatStatus = new HeatStatus();
    status1.name = "handmatig: tijdelijk";
    status2.name = "handmatig: permanent";
    status3.name = "verwarming";
    status1.enabled = Math.random() < 0.5;
    status2.enabled = Math.random() < 0.5;
    status3.enabled = Math.random() < 0.5;

    return [status1, status2, status3]
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.heatControlTasksUrl)
      .pipe(
        tap(_ => this.messageService.add('fetched tasks')),
        catchError(this.handleHttpError('getTasks', []))
      );
  }

  setPermanentOverride(state: boolean): void {
    this.messageService.add(`Permanente override aangeroepen`);
  }

  setTemporaryOverride(state: boolean): Observable<string> {
    this.messageService.add(`Tijdelijke override ${state ? "aan" : "uit"} gezet`);

    let x = {
      type: "temporary",
      state: state,
    }

    return this.http.post<string>(this.heatControlOverridesUrl, x, httpOptions).pipe(
      tap((msg: string) => this.messageService.add(`Override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setTemporaryOverride')));
  }


  addTask(task: Task): Observable<string> {
    this.messageService.add(`addTask called with time ${task.datetime} and action ${task.action}`);

    let x = {
      hour: task.datetime.getHours,
      min: task.datetime.getMinutes,
      action: task.action
    }

    return this.http.post<string>(this.heatControlTasksUrl, x, httpOptions).pipe(
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
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Task } from '../models/task';
import { TaskData } from '../models/task-data';
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
  private heatControlTaskUrl = this.heatControlBaseUrl + 'api/task';
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
    return this.http.get<TaskData[]>(this.heatControlTasksUrl)
      .pipe(map(t=>this.TaskMapper(t)),
        tap(_ => this.messageService.add('fetched tasks')),
        catchError(this.handleHttpError('getTasks', []))
      );
  }

  TaskMapper(taskDatas: TaskData[]): Task[] {
    let tasks: Task[];
    for (var i = 0; i < taskDatas.length; i++) {
      let taskData = taskDatas[i];
      let task: Task;
      task.dayOfWeek = taskData.d;
      task.action = taskData.s;
      task.datetime= new Date(0,0,0,taskData.h,taskData.m);
      tasks.push(task);
    }
    return tasks;
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
      d: task.dayOfWeek,
      h: task.datetime.getHours,
      m: task.datetime.getMinutes,
      s: task.action
    }

    return this.http.post<string>(this.heatControlTaskUrl, newTask, httpOptions).pipe(
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

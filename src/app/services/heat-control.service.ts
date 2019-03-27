import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Task } from '../models/task';
import { TaskData } from '../models/task-data';
import { HeatStatus } from '../models/heat-status';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, takeLast } from 'rxjs/operators';
import { DayOfWeek } from '../models/day-of-week';
import { DateTime } from '../models/datetime';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeatControlService {

  //private heatControlBaseUrl = 'http://demo5335077.mockable.io/';
  private heatControlBaseUrl = 'http://192.168.1.206/';
  private heatControlTimeUrl = this.heatControlBaseUrl + 'api/time';
  private heatControlHeatUrl = this.heatControlBaseUrl + 'api/heat';
  private heatControlTaskUrl = this.heatControlBaseUrl + 'api/task';
  private heatControlTasksUrl = this.heatControlBaseUrl + 'api/tasks';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeatStatus(): Observable<HeatStatus> {
    return this.http.get<HeatStatus>(this.heatControlHeatUrl).pipe(
      tap(_ => this.messageService.add('fetched status')),
      catchError(this.handleHttpError<HeatStatus>('getHeatStatuses')));
  }

  getTime(): Observable<DateTime> {
    return this.http.get<DateTime>(this.heatControlTimeUrl).pipe(
      tap(_ => this.messageService.add('fetched time')),
      catchError(this.handleHttpError<DateTime>('getTime')));
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<TaskData[]>(this.heatControlTasksUrl)
      .pipe(map(t => this.TaskMapper(t)),
        tap(_ => this.messageService.add('fetched tasks')),
        catchError(this.handleHttpError('getTasks', []))
      );
  }

  addTask(task: Task): Observable<string> {
    let newTask = {
      d: task.dow,
      h: task.datetime.getHours(),
      m: task.datetime.getMinutes(),
      s: task.action ? 1 : 0
    }

    return this.http.post(this.heatControlTaskUrl, newTask, { responseType: 'text' }).pipe(
      tap((msg: string) => this.messageService.add(`Taak toegevoegd, response: ${msg}`)),
      catchError(this.handleHttpError<string>('addTask')));
  }

  deleteTask(task: Task): Observable<string> {
    let d = task.dow.toString();
    let h = task.datetime.getHours().toString();
    let m = task.datetime.getMinutes().toString();
    let s = task.action.toString();

    return this.http.delete(this.heatControlTaskUrl, { responseType: 'text', params: { d: d, h: h, m: m, s: s } }).pipe(
      tap((msg: string) => this.messageService.add(`Taak verwijderd, response: ${msg}`)),
      catchError(this.handleHttpError<string>('deleteTask')));
  }

  TaskMapper(taskDatas: TaskData[]): Task[] {
    let tasks: Task[] = [];

    for (var i = 0; i < taskDatas.length; i++) {
      let taskData = taskDatas[i];
      let task: Task = new Task(new Date(0, 0, 0, taskData.h, taskData.m), taskData.s, taskData.d);
      // {
      //   dow: taskData.d,
      //   action: taskData.s,
      //   datetime: new Date(0, 0, 0, taskData.h, taskData.m),
      //   datetimeString: `${taskData.h}:${taskData.m}`,
      //   getDow

      // };
      // task.dayOfWeek = taskData.d;
      // task.action = taskData.s;
      // task.datetime= new Date(0,0,0,taskData.h,taskData.m);
      tasks.push(task);
    }
    return tasks;
  }

  setOverride(heatStatus: HeatStatus): Observable<string> {
    this.messageService.add(`Temporary override ${heatStatus.temporary ? "aan" : "uit"} gezet en Permanente override ${heatStatus.permanent ? "aan" : "uit"} gezet`);

    return this.http.post(this.heatControlHeatUrl, heatStatus, { responseType: 'text' }).pipe(
      tap((msg: string) => this.messageService.add(`override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setOverride')));
  }

  private handleHttpError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.add(`${operation} failed: ${error.message}`);

      return of(result as T); // keep app running by returning an empty result.
    };
  }
}

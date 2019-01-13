import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Task } from '../models/task';
import { HeatStatus } from '../models/heat-status';
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
  private heatControlOverridesUrl = this.heatControlBaseUrl + 'api/overrides';

  //private heatControlBaseUrl = 'http://192.168.1.150/';
  //private heatControlTasksUrl = this.heatControlBaseUrl + 'api/tasks';
  //private heatControlOverridesUrl = this.heatControlBaseUrl + 'api/overrides';
  private heatStatusUrl = 'http://192.168.1.150/heat_status';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeatStatuses(): Observable<HeatStatusResponse> {
    //this.http.request("GET", 'http://192.168.1.150/heat_status').subscribe(response => console.log(response));

    return this.http.get<HeatStatusResponse>(this.heatStatusUrl).pipe(
      tap(_ => this.messageService.add('fetched status')),
      catchError(this.handleHttpError('getHeatStatuses', [])))

    //return this.http.get('http://192.168.1.150/heat_status');
    /*.subscribe(res => {
          q = res;
          console.log("sus: " + q);
        }
        );
    
        console.log("end");
    
    
        //console.log(q.heat_status);
    
        console.log("q: " + q['heat_status']);
        //this.http.get(this.heatStatusUrl).subscribe(respons=>x=respons);
    
        //let r: String;
        this.http.get<String>(this.heatStatusUrl).pipe(
          tap(_ => this.messageService.add('fetched status')),
          catchError(this.handleHttpError('getHeatStatuses', []))
        ).subscribe(response => r = response);
    
        // console.log("x: " + x);
        //  console.log("r: " + this.r);
    
        let heat_status = q;
        if (heat_status == 1 || heat_status == 3) {
          status1.enabled = true;
        }
        else if (heat_status == 0 || heat_status == 2) {
          status1.enabled = false;
        }
        else {
          //Error
          status1.enabled = true;
        }
    
        if (heat_status == 2 || heat_status == 3) {
          status2.enabled = true;
        }
        else if (heat_status == 0 || heat_status == 1) {
          status2.enabled = false;
        } else {
          //Error
          status2.enabled = true;
        }
    
    
        //let q = JSON.stringify(y);
        //console.log("q: " + q);
        //let z = r[0];
        //console.log("z: " + z.heat_status);
        //let z = y["heat_status"];
        //console.log(z);
    
    
        status3.enabled = Math.random() < 0.5;
    
        return [status1, status2, status3]
        */
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.heatControlTasksUrl)
      .pipe(
        tap(_ => this.messageService.add('fetched tasks')),
        catchError(this.handleHttpError('getTasks', []))
      );
  }

  setPermanentOverride(state: boolean): Observable<string> {
    this.messageService.add(`Permanente override aangeroepen`);

    this.messageService.add(`Permanente override ${state ? "aan" : "uit"} gezet`);

    let x = {
      type: "permanent",
      state: state,
    }
    console.log("setPermanentOverride is calling " + "http://192.168.1.150/overrides?onzin=1&permanent=" + state)

    return this.http.get<string>("http://192.168.1.150/overrides?onzin=1&permanent=" + state).pipe(
      tap((msg: string) => this.messageService.add(`Permanent override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setPermanentOverride')));
  }

  setTemporaryOverride(state: boolean): Observable<string> {
    this.messageService.add(`Tijdelijke override ${state ? "aan" : "uit"} gezet`);

    let x = {
      type: "temporary",
      state: state,
    }
    console.log("setTemporaryOverride is calling " + "http://192.168.1.150/overrides?onzin=1&temporary=" + state)

    return this.http.get<string>("http://192.168.1.150/overrides?onzin=1&temporary=" + state).pipe(
      tap((msg: string) => this.messageService.add(`Override ingesteld, response: ${msg}`)),
      catchError(this.handleHttpError<string>('setTemporaryOverride')));

    //return this.http.post<string>(this.heatControlOverridesUrl, x, httpOptions).pipe(
    //      tap((msg: string) => this.messageService.add(`Override ingesteld, response: ${msg}`)),
    //catchError(this.handleHttpError<string>('setTemporaryOverride')));
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

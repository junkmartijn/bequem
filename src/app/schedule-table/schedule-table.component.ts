import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../models/task';
import { HeatControlService } from '../services/heat-control.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent implements OnInit {
  @Input() tasks: Task[]
  msg: Observable<string>;

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
  }

  tasksOrdered(){
    return this.tasks.sort((a, b) => a.dow - b.dow || a.datetime.getTime() - b.datetime.getTime());
  }
  
  delete(task: Task): void {
    this.tasks = this.tasks.filter(t => t !== task);
    this.msg =  this.heatControlService.deleteTask(task);
  }
}

import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';
import { Task } from '../models/task';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  newTask: Task = new Task();
  msg: Observable<string>;
  tasks: Task[];

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
    this.getTasks();
    this.newTask.action = false;
  }

  getTasks(): void {
    this.heatControlService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }

  add(): void {
    this.msg = this.heatControlService.addTask({ datetime: this.newTask.datetime, action: this.newTask.action });
  }
}
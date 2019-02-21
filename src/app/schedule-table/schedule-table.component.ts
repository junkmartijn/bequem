import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../models/task';
import { HeatControlService } from '../services/heat-control.service';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent implements OnInit {
  @Input() tasks: Task[]

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
  }
  
  delete(task: Task): void {
    this.tasks = this.tasks.filter(t => t !== task);
    this.heatControlService.deleteTask(task).subscribe();
  }
}

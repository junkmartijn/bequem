import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../models/task';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent implements OnInit {
  @Input() tasks: Task[]

  constructor() { }

  ngOnInit() {
  }
}

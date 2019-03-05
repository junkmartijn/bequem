import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';
import { Task } from '../models/task';
import { Observable } from 'rxjs';
import { DayOfWeek } from '../models/day-of-week';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  newTask: Task = new Task(new Date(), false, 8);
  msg: Observable<string>;
  tasks: Task[];
  selectedDow;
  constructor(private heatControlService: HeatControlService) {
    this.categoryTypes = DayOfWeekMapping;
    //this.newTask.dow= this.categoryTypes[7]; // set default value 
  }

  ngOnInit() {
    this.getTasks();
    //this.newTask.action = false;
  }

  getTasks(): void {
    this.heatControlService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }

  add(): void {
    let hm = this.newTask.datetimeString.split(':');
    let h: number = +hm[0];
    let m: number = +hm[1];

    let ds = DayOfWeekMapping.find(d => d.type === this.selectedDow.type, 'first');

    let newTask: Task = new Task(
      new Date(0, 0, 0, h, m),
      this.newTask.action,
      ds.value);
    // {
    //   dow: ds.value,//this.newTask.dow,
    //   datetimeString: this.newTask.datetimeString,
    //   datetime: new Date(0,0,0,h,m),
    //   action: this.newTask.action
    // }
    this.heatControlService.addTask(newTask).subscribe(m => { this.getTasks() });
  }


  // I have change this to public just for demo
  // public get selectedCategoryType(): DayOfWeek {
  //return this.selectedValue ? this.selectedValue.value : null;
  //}
  public categoryTypes;
  //public selectedValue: any;


}


export const DayOfWeekMapping = [
  { value: DayOfWeek.Maandag, type: DayOfWeek[DayOfWeek.Maandag] },
  { value: DayOfWeek.Dinsdag, type: DayOfWeek[DayOfWeek.Dinsdag] },
  { value: DayOfWeek.Woensdag, type: DayOfWeek[DayOfWeek.Woensdag] },
  { value: DayOfWeek.Donderdag, type: DayOfWeek[DayOfWeek.Donderdag] },
  { value: DayOfWeek.Vrijdag, type: DayOfWeek[DayOfWeek.Vrijdag] },
  { value: DayOfWeek.Zaterdag, type: DayOfWeek[DayOfWeek.Zaterdag] },
  { value: DayOfWeek.Zondag, type: DayOfWeek[DayOfWeek.Zondag] },
  { value: DayOfWeek.Alle, type: DayOfWeek[DayOfWeek.Alle] },
];

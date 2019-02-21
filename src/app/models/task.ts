import { DayOfWeek } from "./day-of-week";

export class Task {
  datetime: Date;
  datetimeString: string;
  action: boolean;
  dow: number;

  constructor(datetime: Date, action: boolean, dow: number) {
    this.dow = dow
    this.datetime = datetime;
    this.action = action;
  }

  getDow(): DayOfWeek {
    return DayOfWeek[DayOfWeek[this.dow]]
  };
}
import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';
import { HeatStatus } from '../models/heat-status';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  statuses: HeatStatus[]

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
    this.statuses = this.heatControlService.getHeatStatuses();
  }

}
import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';
import { Observable } from 'rxjs';
import { HeatStatus } from '../models/heat-status';

@Component({
  selector: 'app-manual-override',
  templateUrl: './manual-override.component.html',
  styleUrls: ['./manual-override.component.css']
})
export class ManualOverrideComponent implements OnInit {
  slidersDisabled: boolean = false;
  temporaryOverrideSliderChecked: boolean = false;
  permanentOverrideSliderChecked: boolean = false;

  status: Observable<HeatStatus>;

  time: string;
  temporaryOverrideStatus: boolean;
  permanentOverrideStatus: boolean;

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
    this.GetStatus();
    this.GetTime();
  }

  onClickToggle2(): void {
    this.heatControlService.setOverride(null);
  }

  temporaryOverrideSliderToggle() {
    this.UpdateHeat();
  }

  permanentOverrideSliderToggle() {
    this.UpdateHeat();
  }

  private UpdateHeat() {
    this.slidersDisabled = true;
    let newHeatStatus: HeatStatus = new HeatStatus();
    newHeatStatus.temporary = this.temporaryOverrideSliderChecked;
    newHeatStatus.permanent = this.permanentOverrideSliderChecked;
    this.heatControlService.setOverride(newHeatStatus)
      .subscribe(qq => {
        this.GetStatus();
        this.slidersDisabled = false;
      });
  }

  GetStatus() {
    this.heatControlService.getHeatStatus().subscribe(status => {
      this.temporaryOverrideStatus = status.temporary;
      this.permanentOverrideStatus = status.permanent;

      this.temporaryOverrideSliderChecked = this.temporaryOverrideStatus;
      this.permanentOverrideSliderChecked = this.permanentOverrideStatus;
    });;
  }

  GetTime() {
    this.heatControlService.getTime().subscribe(time => {
      this.time = time.datetime;
    })
  }
}
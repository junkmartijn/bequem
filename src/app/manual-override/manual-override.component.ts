import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';
import { Observable } from 'rxjs';
import { HeatStatusResponse } from '../models/heat-status-response';

@Component({
  selector: 'app-manual-override',
  templateUrl: './manual-override.component.html',
  styleUrls: ['./manual-override.component.css']
})
export class ManualOverrideComponent implements OnInit {
  slidersDisabled: boolean = false;
  temporaryOverrideSliderChecked: boolean = false;
  permanentOverrideSliderChecked: boolean = false;

  status: Observable<HeatStatusResponse>;

  temporaryOverrideStatus: boolean;
  permanentOverrideStatus: boolean;

  constructor(private heatControlService: HeatControlService) { }

  ngOnInit() {
    this.GetStatus();
  }

  onClickToggle2(): void {
    this.heatControlService.setPermanentOverride(null);
  }

  temporaryOverrideSliderToggle() {
    this.slidersDisabled = true;

    this.heatControlService.setTemporaryOverride(this.temporaryOverrideSliderChecked)
      .subscribe(qq => {
        console.log("response from temporary override return_value: " + qq["return_value"])
        this.GetStatus();
        this.slidersDisabled = false
      });
  }

  permanentOverrideSliderToggle() {
    this.slidersDisabled = true;

    this.heatControlService.setPermanentOverride(this.permanentOverrideSliderChecked)
      .subscribe(qq => {
        console.log("response from permanent override return_value: " + qq["return_value"])
        this.GetStatus();
        this.slidersDisabled = false
      });
  }

  GetStatus() {
    this.heatControlService.getHeatStatuses().subscribe(status => {
      let heat_status = status.heat_status;
      if (heat_status == 1 || heat_status == 3) {
        this.temporaryOverrideStatus = true;
      }
      else if (heat_status == 0 || heat_status == 2) {
        this.temporaryOverrideStatus = false;
      }
      else {
        //Error
        this.temporaryOverrideStatus = true;
      }

      if (heat_status == 2 || heat_status == 3) {
        this.permanentOverrideStatus = true;
      }
      else if (heat_status == 0 || heat_status == 1) {
        this.permanentOverrideStatus = false;
      } else {
        //Error
        this.permanentOverrideStatus = true;
      }

      this.temporaryOverrideSliderChecked = this.temporaryOverrideStatus;
      this.permanentOverrideSliderChecked = this.permanentOverrideStatus;
    });;
  }
}

import { Component, OnInit } from '@angular/core';
import { HeatControlService } from '../services/heat-control.service';

@Component({
  selector: 'app-manual-override',
  templateUrl: './manual-override.component.html',
  styleUrls: ['./manual-override.component.css']
})
export class ManualOverrideComponent implements OnInit {
  slidersDisabled: boolean = false;
  temporaryOverrideSliderChecked: boolean = false;
  permanentOverrideSliderChecked: boolean = false;

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
    console.log(`sliderChecked ${this.temporaryOverrideSliderChecked}`);
    this.slidersDisabled = true;

    this.heatControlService.setTemporaryOverride(this.temporaryOverrideSliderChecked).subscribe();
    //wachten op antwoord?
    this.slidersDisabled = false;

    //as callback
    this.GetStatus();
  }

  permanentOverrideSliderToggle() {
    //ToDo

  }

  GetStatus() {
    let x = this.heatControlService.getHeatStatuses();

    this.temporaryOverrideStatus = x[0].enabled;
    this.permanentOverrideStatus = x[1].enabled;

    this.temporaryOverrideSliderChecked = this.temporaryOverrideStatus;
    this.permanentOverrideSliderChecked = this.permanentOverrideStatus;
  }
}
import { TestBed } from '@angular/core/testing';

import { HeatControlService } from './heat-control.service';

describe('HeatControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeatControlService = TestBed.get(HeatControlService);
    expect(service).toBeTruthy();
  });
});

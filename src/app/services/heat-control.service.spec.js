"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var heat_control_service_1 = require("./heat-control.service");
describe('HeatControlService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(heat_control_service_1.HeatControlService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=heat-control.service.spec.js.map
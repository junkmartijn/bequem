import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component'
import { ManualOverrideComponent } from './manual-override/manual-override.component'

const routes: Routes = [
    { path: '', redirectTo: '/manual', pathMatch: 'full' },
    { path: 'manual', component: ManualOverrideComponent },
    { path: 'schedule', component: ScheduleComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, EventEmitter } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ManualOverrideComponent } from './manual-override/manual-override.component';
import { MessagesComponent } from './messages/messages.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';
import { StatusComponent } from './status/status.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule, MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    ManualOverrideComponent,
    MessagesComponent,
    ScheduleTableComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

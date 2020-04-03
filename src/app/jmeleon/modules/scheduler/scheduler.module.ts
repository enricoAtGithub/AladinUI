import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { AngularSplitModule } from 'angular-split';

// import the ScheduleModule for the Schedule component
import {
  ScheduleModule,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService,
  DragAndDropService,
  ResizeService
} from '@syncfusion/ej2-angular-schedule';

import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { FormsModule } from '@angular/forms';
import { AvailabilityComponent } from './components/availability/availability.component';


@NgModule({
  declarations: [SchedulerComponent, AvailabilityComponent],
  imports: [
    AngularSplitModule.forRoot(),
    BrowserModule,
    MultiSelectModule,
    ScheduleModule,
    FormsModule,
    SplitButtonModule
  ],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
    DragAndDropService,
    ResizeService
  ],
  bootstrap: [SchedulerComponent]
})
export class SchedulerModule { }

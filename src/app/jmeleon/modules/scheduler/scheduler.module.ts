import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { AngularSplitModule } from 'angular-split';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';

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
import { ResizableModule } from 'angular-resizable-element';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SchedulerComponent, AvailabilityComponent],
  imports: [
    AngularSplitModule.forRoot(),
    BrowserModule,
    MultiSelectModule,
    ScheduleModule,
    FormsModule,
    SplitButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    SharedModule,
    ResizableModule
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

// import the ScheduleModule for the Schedule component
import { ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, AgendaService, TimelineViewsService, TimelineMonthService, DragAndDropService, ResizeService} from '@syncfusion/ej2-angular-schedule';
import { SchedulerComponent }  from './components/scheduler/scheduler.component';


@NgModule({
  declarations: [SchedulerComponent],
  imports: [
    BrowserModule, 
    ScheduleModule 
  ],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService,  TimelineViewsService, TimelineMonthService, DragAndDropService, ResizeService],
  bootstrap: [ SchedulerComponent ]
})
export class SchedulerModule { }

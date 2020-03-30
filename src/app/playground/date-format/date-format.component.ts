import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-format',
  templateUrl: './date-format.component.html',
  styleUrls: ['./date-format.component.css']
})
export class DateFormatComponent implements OnInit {

  serializedDate01: string;
  localeTimezoneOffset: number;

  constructor() { }

  ngOnInit() {
    const date = new Date();
    this.serializedDate01 = JSON.stringify({date});
    this.localeTimezoneOffset = date.getTimezoneOffset();
  }

}

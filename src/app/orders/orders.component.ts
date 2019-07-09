import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/dynamic-table/table-data';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  data = new TableData('Aufträge', 'Order');

  constructor() {}

  ngOnInit() {}
}

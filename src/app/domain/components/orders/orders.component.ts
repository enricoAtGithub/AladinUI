import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from '../../../breadcrumb.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  data = new TableData('Aufträge', 'Order');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Aufträge' }
    ]);
  }

  ngOnInit() { }
}

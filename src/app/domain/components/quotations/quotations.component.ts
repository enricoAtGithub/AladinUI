import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from 'src/app/breadcrumb.service';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {
  data = new TableData('Angebote', 'Quotation');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Angebote' }
    ]);
  }

  ngOnInit() {
  }

}

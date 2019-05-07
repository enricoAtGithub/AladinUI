import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Berichte' }
    ]);
  }

  ngOnInit() {
  }

}

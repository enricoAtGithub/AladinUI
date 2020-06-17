import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-script-actions',
  templateUrl: './script-actions.component.html',
  styleUrls: ['./script-actions.component.css']
})
export class ScriptActionsComponent implements OnInit {
  data = new TableData('Aktionen', 'ScriptAction');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Aktionen' }
    ]);
  }

  ngOnInit() {
  }

}

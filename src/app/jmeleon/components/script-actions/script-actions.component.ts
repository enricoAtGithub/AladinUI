import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import 'brace';
import 'brace/mode/json';
import 'brace/mode/python';
import 'brace/snippets/python';
import 'brace/ext/language_tools';
import 'brace/theme/github';
import { AceComponent, AceConfigInterface } from 'ngx-ace-wrapper';

@Component({
  selector: 'app-script-actions',
  templateUrl: './script-actions.component.html',
  styleUrls: ['./script-actions.component.css']
})
export class ScriptActionsComponent implements OnInit {
  data = new TableData('Aktionen', 'ScriptAction');
  code: string;
  aceconfig: AceConfigInterface;
  result: string;
  output: string;

  constructor(private breadcrumbService: BreadcrumbService, private entityService: EntityService) {
    this.breadcrumbService.setItems([
      { label: 'Aktionen' }
    ]);
  }

  ngOnInit() {
    this.aceconfig = {
      theme: 'github',
      readOnly : false
    };
  }

  execute() {
    const payload = { snippet: this.code, entityReference: null, context: null };
    this.entityService.executeCodeSnippet(payload).subscribe(
      (response) => {
        this.result = response['result'];
        this.output = response['output'];
      },
      (error) => {
        this.result = error.error.message;
        this.output = error.error.trace;
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';
import { ErrorMessage } from 'src/app/shared/models/error-message';
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

  constructor(private breadcrumbService: BreadcrumbService, private entityService: EntityService, private notificationService: ErrorNotificationService,) {
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
    this.entityService.executeCodeSnippet(payload).subscribe((result) =>
      this.notificationService.addSuccessNotification(new ErrorMessage('Success!', 'Script executed successfully!', 'Output: ' + result['output'] )));
  }

}

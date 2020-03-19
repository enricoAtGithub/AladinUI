import { Component, OnInit } from '@angular/core';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';

@Component({
  selector: 'app-permission-test',
  templateUrl: './permission-test.component.html',
  styleUrls: ['./permission-test.component.css']
})
export class PermissionTestComponent implements OnInit {

  constructor(private jmlActionsPermissionService: JmeleonActionsPermissionService) { }

  ngOnInit() {
    this.jmlActionsPermissionService.initActionsPermittedForCurrentUser([
      // // 'default.permCheck.seeFirstParagraph'
    ]);
  }

}

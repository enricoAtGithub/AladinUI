import { Component, OnInit } from '@angular/core';
import PCC from '../../config/permission-config-combined';

@Component({
  selector: 'app-permission-check-test',
  // templateUrl: './permission-check-test.component.html',
  // styleUrls: ['./permission-check-test.component.css']
//   template: `<div *appPermissionCheck="PCC.jmeleon.dto.$dtoType.$dtoField.read">
//   <p #innerElement>
//       secret
//   </p>
// </div>`,
template: `<div *appPermissionCheck="path">
              <p #innerElement>
                  secret
              </p>
            </div>`,
//   template: `<div #outerElement>
//   <p #innerElement>
//       secret
//   </p>
// </div>`,
  // styles:

})
export class PermissionCheckTestComponent implements OnInit {

  path: Function | Object;

  constructor() { }

  ngOnInit() {
    this.path = PCC.jmeleon.dto.$dtoType.$dtoField.read;
  }


}

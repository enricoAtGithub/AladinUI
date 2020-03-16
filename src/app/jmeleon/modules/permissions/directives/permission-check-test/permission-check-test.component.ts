import { Component, OnInit } from '@angular/core';
import PCC from '../../config/permission-config-combined';
import { action } from '../../models/node-types.model';
import { PermissionCheckTestComponentTestTree } from './permission-check-test.component.spec';


// export class PermissionCheckTestComponentTestTree {
//   static jmeleon = class {
//       static invoice = class {
//           static invoiceList = class {
//               static read = action();
//               static write = action();
//           };
//       };
//   };
// }

@Component({
  selector: 'app-permission-check-test',
  // templateUrl: './permission-check-test.component.html',
  // styleUrls: ['./permission-check-test.component.css']
//   template: `<div *appPermissionCheck="PCC.jmeleon.dto.$dtoType.$dtoField.read">
//   <p #innerElement>
//       secret
//   </p>
// </div>`,
template: `<div *appPermissionCheck="invoiceListRead">
              <p #innerElement>
                  invoice-element
              </p>
              <button *appPermissionCheck="invoiceListWrite">edit</button>
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
  invoiceListRead = PermissionCheckTestComponentTestTree.jmeleon.invoice.invoiceList.read;
  invoiceListWrite = PermissionCheckTestComponentTestTree.jmeleon.invoice.invoiceList.write;

  constructor() { }

  ngOnInit() {
    this.path = PCC.jmeleon.dto.$dtoType.$dtoField.read;
  }


}

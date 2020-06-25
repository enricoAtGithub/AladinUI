import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/primeng';

@Component({
  selector: 'app-script-result',
  templateUrl: './script-result.component.html',
  styleUrls: ['./script-result.component.css']
})
export class ScriptResultComponent implements OnInit {

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit() {
  }

}

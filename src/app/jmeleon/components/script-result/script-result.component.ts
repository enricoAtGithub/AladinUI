import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/primeng';

@Component({
  selector: 'app-script-result',
  templateUrl: './script-result.component.html',
  styleUrls: ['./script-result.component.css']
})
export class ScriptResultComponent implements OnInit {
  @Input() result: string;
  @Input() output: string;

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit() {
    // If called from html result and ouput is available via @Input() => nothing to do
    // If called via dynamic dialog service get result and output from config.data
    if (this.config.data) {
      this.result = this.config.data['result'];
      this.output = this.config.data['output'];
    }

    if (!this.result) { this.result = ''; }
    if (!this.output) { this.output = ''; }
  }

}

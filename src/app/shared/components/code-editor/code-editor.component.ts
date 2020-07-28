import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { AceComponent, AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/json';
import 'brace/mode/python';
import 'brace/snippets/python';
import 'brace/ext/language_tools';
import 'brace/theme/github';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
@ViewChild(AceComponent, { static: false }) componentRef ?: AceComponent;
@Input() syntax: string;
@Input() code: string;
@Output() editedCode = new EventEmitter<string>();
calledFromHTML = true;

public aceconfig: AceConfigInterface;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
    ) { }

  ngOnInit() {

    // If called from html syntax and code is available via @Input() => nothing to do
    // If called via dynamic dialog service get syntax and code from config.data
    if (!this.syntax && !this.code) {
      this.calledFromHTML = false;
      this.syntax = this.config.data['syntax'];
      this.code = this.config.data['code'];
    }

    this.aceconfig = {
      theme: 'github',
      readOnly : false,
    };
  }

  save() {
    // send edited code back to "caller"
    // in case of Entity dialog this component is called from html
    // in all other cases it is called via primeng dynamic dialog
    if (this.calledFromHTML) {
      this.editedCode.emit(this.code);
    } else {
      this.ref.close(this.code);
    }
  }

}

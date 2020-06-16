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

public aceconfig: AceConfigInterface;

  constructor(
    public config: DynamicDialogConfig,
    public scriptRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.aceconfig = {
      mode: this.syntax,
      theme: 'github',
      readOnly : false,
    };
  }

  save() {
    this.editedCode.emit(this.code);
  }

}
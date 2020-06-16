import { Component, OnInit, ViewChild } from '@angular/core';
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

syntax: string;
code: string;

public aceconfig: AceConfigInterface;

  // options = {
  //   enableBasicAutocompletion: true,
  //   enableLiveAutocompletion: true,
  //   enableSnippets: true
  // };

  constructor(
    public config: DynamicDialogConfig,
    public scriptRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.syntax = this.config.data['syntax'];
    this.code = this.config.data['code'];

    this.aceconfig = {
      mode: this.syntax,
      theme: 'github',
      readOnly : false,
    };

  }

  save() {
    this.scriptRef.close(this.code);
  }

}

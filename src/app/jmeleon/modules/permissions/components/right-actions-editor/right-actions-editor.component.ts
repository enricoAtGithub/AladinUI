import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TreeNode } from 'primeng/api';
import JMeleonActionTreeUtils from '../../utils/jml-action-tree.utils';
import { JmeleonActionsFacadeService } from '../../services/jmeleon-actions-facade.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-right-actions-editor',
  templateUrl: './right-actions-editor.component.html',
  styleUrls: ['./right-actions-editor.component.css']
})
export class RightActionsEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() entryId: number;

  actionsTree$: Observable<TreeNode[]>;
  selectedActions: TreeNode[];

  subscription: Subscription[] = [];


  constructor(private facade: JmeleonActionsFacadeService) { }

  ngOnInit() {
    // this.actionsTree = [];
    this.actionsTree$ = this.facade.actionGuiTree$;
    this.subscription.push(this.actionsTree$.subscribe(tree => {
      console.log('tree: ', tree);
    }));
    this.facade.setTreeToDebugData();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entryId){
      console.log('entryId: ', changes.entryId);
    }

  }

  ngOnDestroy(): void {

  }

  
  nodeSelect(event) {
    //event.node = selected node
}

}

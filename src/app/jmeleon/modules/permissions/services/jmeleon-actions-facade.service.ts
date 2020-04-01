import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { TreeNode, SelectItem } from 'primeng/api';
import * as permissions from '../permissions';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';
import { ErrorMessage } from 'src/app/shared/models/error-message';
import JMeleonActionTreeUtils from '../utils/jml-action-tree.utils';
import { Tree } from 'primeng/tree';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage.service';
import { SettingsService } from '../../settings/services/settings.service';

/**
 * This facade encapsulates backend-calls and business logic for the right-action-editor
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsFacadeService {

  actionsTree$: Observable<ActionTreeNode>;
  actionGuiTreeForSelectedSection$: Observable<TreeNode[]>;
  selectedTreeNodes$: Observable<TreeNode[]>;
  sections$: Observable<SelectItem[]>;
  isLoading$: Observable<boolean>;
  disableEditing$: Observable<boolean>;
  masterOfDisasterId$: Observable<number>;
  currentRightId$: Observable<number>;

  private _sectionDict: Record<string, [TreeNode[], TreeNode[]]>;
  private _rightId: number;
  private _masterRightId = 0; // id for MASTER_OF_DESASTER-right
  private _actionTreeRoot: ActionTreeNode;
  private _currentSection: string;


  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);
  private $selectedTreeNodes = new BehaviorSubject<TreeNode[]>([]);
  private $actionGuiTreeForSelectedSection = new BehaviorSubject<TreeNode[]>([]);
  private $sections = new BehaviorSubject<SelectItem[]>([]);
  private $isLoading = new BehaviorSubject<boolean>(false);
  private $masterOfDisasterId = new BehaviorSubject<number>(0);
  private $currentRightId = new BehaviorSubject<number>(0);

  private subscriptions: Subscription[] = [];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService,
    private notificationService: ErrorNotificationService,
    private storageService: BrowserStorageService,
    private settingsService: SettingsService
  ) {

    this.actionsTree$ = this.$actionTree.asObservable();
    this.selectedTreeNodes$ = this.$selectedTreeNodes.asObservable();
    this.sections$ = this.$sections.asObservable();
    this.actionGuiTreeForSelectedSection$ = this.$actionGuiTreeForSelectedSection.asObservable();
    this.isLoading$ = this.$isLoading.asObservable();
    this.masterOfDisasterId$ = this.$masterOfDisasterId.asObservable();
    this.currentRightId$ = this.$currentRightId.asObservable();

    this.init();
  }

  init(): void {
    this.checkForMasterOfDisasterId();
    this.actionsTree$.pipe(
      tap(actionTree => {
        // console.log('root1:', actionTree);
        this._actionTreeRoot = actionTree;
        if (!!actionTree) {
          this._sectionDict = JMeleonActionTreeUtils.generateTreeDict(actionTree);
          const keys = Object.keys(this._sectionDict);
          // console.log('keys: ', keys);
          this.$sections.next(keys.map(key => ({label: key, value: key})));
        }
      }),
      // withLatestFrom(this.masterOfDisasterId$),
      // withLatestFrom(this.currentRightId$),
      withLatestFrom(this.currentRightId$, this.masterOfDisasterId$),

      map(value => {
        const node = value[0];
        const currentRightId = value[1];
        const masterId = value[2];
        // if role is MasterOfDisaster => tree has to be disabled
        const enableTreeNodeSelection = currentRightId !== masterId;
        // console.log('enableTreeNodeSelection: ', enableTreeNodeSelection);
        const selectedNodes: TreeNode[] = [];

        const result = [JMeleonActionTreeUtils.generateTreeAndSelectedNodes(node, selectedNodes, enableTreeNodeSelection)];
        this.$selectedTreeNodes.next(selectedNodes);
        return result;
      })

    ).subscribe();

    this.disableEditing$ = this.currentRightId$.pipe(
      withLatestFrom(this.masterOfDisasterId$),
      map(value => value[0] === value[1])
    );
  }

  requestActionTreeFromBackend(rightId: number): void {
    this._rightId = rightId;
    this.$currentRightId.next(rightId);
    this.$isLoading.next(true);

    this.subscriptions.push(
      this.jmlActionsForRightService.getActionsForRight(rightId)
      .subscribe(actionTree => {
        this.$actionTree.next(actionTree);
        this.$isLoading.next(false);
      })
    );
  }

  selectSection(sectionName: string): void {

    this._currentSection = sectionName;
    this.$actionGuiTreeForSelectedSection.next(this._sectionDict[sectionName][0]);
    this.$selectedTreeNodes.next(this._sectionDict[sectionName][1]);
  }

  removeActionFromRight(rightId: number, node: TreeNode):void{
    const fullName = JMeleonActionTreeUtils.generateFullPathFromTreeNode(node, this._actionTreeRoot);
    console.log('removing action to right: ', fullName);
    this.subscriptions.push(this.jmlActionsForRightService.removeActionFromRight(fullName, rightId).subscribe(
      () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktion wurde erfolgreich entfernt.'))
    ));
  }

  addActionToRight(rightId: number, node: TreeNode):void{
    const fullName = JMeleonActionTreeUtils.generateFullPathFromTreeNode(node, this._actionTreeRoot);
    console.log('adding action to right: ', fullName);
    this.subscriptions.push(this.jmlActionsForRightService.addActionToRight(fullName, rightId).subscribe(
      () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktion wurde erfolgreich hinzugefügt.'))
    ));
  }



  syncGuiActionsWithServer(): void {
    // should this be blocked/blocking too? (with isLoading)
    this.subscriptions.push(
      this.jmlActionsForRightService.setAllActions(permissions.list).subscribe(
        () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktionen wurden erfolgreich an den Server übermittelt.'))
      )
    );
  }

  checkForMasterOfDisasterId(): void {
    if (this.storageService.hasMasterOfDisasterRightId){
      this.$masterOfDisasterId.next(this.storageService.masterOfDisasterRightId);
      return;
    }
    this.settingsService.getSetting('MASTER_RIGHT_ID').subscribe(
      setting => {
        const id = +setting.value;
        this.$masterOfDisasterId.next(id);
        this.storageService.masterOfDisasterRightId = id;
      }
    )
  }

}

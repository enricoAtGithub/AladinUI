import { ActionTreeNode } from '../models/actions-tree-node.model';
import { TreeNode } from 'primeng/api';

export default class JMeleonActionTreeUtils {


  // is returning the tree really necessary?
  // newState should not be null
  static updateTree = (tree: ActionTreeNode, node: ActionTreeNode, newStateForActivated: boolean): ActionTreeNode => {
    if (node.activated === newStateForActivated) {
      return tree;
    }

    // console.log('update tree - tree: ', tree);
    // console.log('update tree - node: ', node);


    const parent = JMeleonActionTreeUtils.getParentNode(node, tree);

    // console.log('parent: ', parent);

    parent.activated = parent.nodes
      .every(child => child.activated === newStateForActivated) ?
      newStateForActivated : null;

    JMeleonActionTreeUtils.setValueForChildNodes(node, newStateForActivated);

    return tree;
  }

  static getParentNode = (actualNode: ActionTreeNode, partTree: ActionTreeNode): ActionTreeNode => {

    if (!partTree.nodes) {
      // console.log('getParent - no child nodes for node: ', partTree);
      return null;
    }

    for (const child of partTree.nodes) {
      if (child === actualNode) {
        // console.log('found parent:', partTree);
        return partTree;

      }
    }

    for (const child of partTree.nodes) {
      const result = JMeleonActionTreeUtils.getParentNode(actualNode, child);
      if (!!result) {
        return result;
      }
    }

    return null;
  }

  private static setValueForChildNodes = (node: ActionTreeNode, newActivationValue: boolean): void => {

    if (!!node.nodes && node.nodes.length > 0) {
      node.nodes.forEach(child => JMeleonActionTreeUtils.setValueForChildNodes(child, newActivationValue));
    }
    node.activated = newActivationValue;
  }


  // partially set node have to be initialized manually:
  // https://github.com/primefaces/primeng/issues/3665

  static generateTreeAndSelectedNodes = (
    actionTreeNode: ActionTreeNode,
    selectedTreeNodes: TreeNode[],
    activateTreeSelection= true
    ): TreeNode => {

    if (!actionTreeNode) {
      return null;
    }
    const isLeaf = !actionTreeNode.nodes || actionTreeNode.nodes.length < 1;

    if (!actionTreeNode.description) {
      actionTreeNode.description = isLeaf ? 'todo: add description' : null;
    }

    const guiTreeNode: TreeNode = {
      label: actionTreeNode.name,
      data: actionTreeNode,
      children: [],
      leaf: isLeaf,
      // expanded: actionTreeNode.activated || !isLeaf && actionTreeNode.activated === null,
      expanded: false,
      partialSelected: !isLeaf && actionTreeNode.activated === null,
      selectable: activateTreeSelection
    };
    // console.log(`${actionTreeNode.name} - selectable: ${guiTreeNode.selectable}`);

    if (actionTreeNode.activated === true) {
      selectedTreeNodes.push(guiTreeNode);
    }
    guiTreeNode.children = isLeaf ? [] : actionTreeNode.nodes.map(node =>
      JMeleonActionTreeUtils.generateTreeAndSelectedNodes(node, selectedTreeNodes, activateTreeSelection));

    return guiTreeNode;
  }

  static generateTreeDict = (rootActionNode: ActionTreeNode): Record<string, [TreeNode[], TreeNode[]]> => {

    // dict with tuple: [tree-data, selected-nodes]
    const result: Record<string, [TreeNode[], TreeNode[]]> = {};
    const sectionNodes = rootActionNode.nodes;

    sectionNodes.forEach(sectionNode => {
      const secondLevelNodes = sectionNode.nodes;
      const selectedNodes: TreeNode[] = [];

      const secondLevelGuiNodes = !secondLevelNodes ? [] : 
        secondLevelNodes
          .map(slNode => {
            const guiNodes = JMeleonActionTreeUtils.generateTreeAndSelectedNodes(slNode, selectedNodes);
            return guiNodes;
          });
      result[sectionNode.name] = [secondLevelGuiNodes, selectedNodes];
    });

    // console.log(result);

    return result;
  }

  static generateFullPathFromTreeNode = (node: TreeNode, root: ActionTreeNode): string => {
    let currentActionNode: ActionTreeNode = node.data;
    // let result = currentActionNode.name;
    let result = '';


    do {
      result = !!result ? `${currentActionNode.name}.${result}` : currentActionNode.name;
      currentActionNode = JMeleonActionTreeUtils.getParentNode(currentActionNode, root);
      // console.log('path: ', result);
    }
    while (currentActionNode !== null && currentActionNode !== root);

    // console.log('path: ', result);
    // DO NOT PREFIX THE RESULT WITH 'root.' !!!!!!!
    return result;
  }

  // currently for debugging only
  static generateActionsList = (root: ActionTreeNode): string[] => {
    const result: string[] = [];

    JMeleonActionTreeUtils.traverseActionsTree(root, '', result);

    return result;
  }

  private static traverseActionsTree(node: ActionTreeNode, currentPath: string, leafPaths: string[]): void {
    currentPath = `${currentPath}.${node.name}`;
    if (!node.nodes || node.nodes.length === 0) {
      const trimmedPath = currentPath.substring(2, currentPath.length);
      leafPaths.push(trimmedPath);
      return;
    }
    node.nodes.forEach(child => JMeleonActionTreeUtils.traverseActionsTree(child, currentPath, leafPaths));
  }


}

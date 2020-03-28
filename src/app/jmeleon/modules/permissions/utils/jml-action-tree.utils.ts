import { ActionTreeNode } from '../models/actions-tree-node.model';
import { TreeNode } from 'primeng/api';

export default class JMeleonActionTreeUtils {


    // is returning the tree really necessary?
    // newState should not be null
    static updateTree = (tree: ActionTreeNode, node: ActionTreeNode, newStateForActivated: boolean): ActionTreeNode => {
        if (node.activated === newStateForActivated) {
            return tree;
        }

        console.log('update tree - tree: ', tree);
        console.log('update tree - node: ', node);


        const parent = JMeleonActionTreeUtils.getParentNode(node, tree);

        console.log('parent: ', parent);

        parent.activated = parent.nodes
            .every(child => child.activated === newStateForActivated) ?
            newStateForActivated : null;

        JMeleonActionTreeUtils.setValueForChildNodes(node, newStateForActivated);

        return tree;
    }

    static getParentNode = (actualNode: ActionTreeNode, partTree: ActionTreeNode): ActionTreeNode => {

        if (!partTree.nodes) {
            console.log('getParent - no child nodes for node: ', partTree);
            return null;
        }

        for (const child of partTree.nodes) {
            if (child === actualNode) {
                console.log('found parent:', partTree);
                return child;

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

    static generateTreeAndSelectedNodes = (actionTreeNode: ActionTreeNode, selectedTreeNodes: TreeNode[]): TreeNode => {

    if (!actionTreeNode) {
      return null;
    }
    const isLeaf = !actionTreeNode.nodes || actionTreeNode.nodes.length < 1;

    if (!actionTreeNode.description) {
      actionTreeNode.description = isLeaf ? 'todo: add description mechanism' : null;
    }

    const guiTreeNode: TreeNode = {
      label: actionTreeNode.name,
      data: actionTreeNode,
      children: [],
      leaf: isLeaf,
      expanded: actionTreeNode.activated || !isLeaf && actionTreeNode.activated === null,
      partialSelected: !isLeaf && actionTreeNode.activated === null
    };

    if (actionTreeNode.activated === true) {
      selectedTreeNodes.push(guiTreeNode);
    }
    guiTreeNode.children = isLeaf ? [] : actionTreeNode.nodes.map(node =>
        JMeleonActionTreeUtils.generateTreeAndSelectedNodes(node, selectedTreeNodes));

    return guiTreeNode;
  }

  static generateTreeDict = (rootActionNode: ActionTreeNode): Record<string, [TreeNode[], TreeNode[]]> => {

    // dict with tuple: [tree-data, selected-nodes]
    const result: Record<string, [TreeNode[], TreeNode[]]> = {};
    const sectionNodes = rootActionNode.nodes;

    sectionNodes.forEach(sectionNode => {
      const secondLevelNodes = sectionNode.nodes;
      const selectedNodes: TreeNode[] = [];

      const secondLevelGuiNodes = secondLevelNodes.map(slNode => {
        const guiNodes = JMeleonActionTreeUtils.generateTreeAndSelectedNodes(slNode, selectedNodes);
        return guiNodes;
      });
      result[sectionNode.name] = [secondLevelGuiNodes, selectedNodes];
    });

    console.log(result);

    return result;
  }




}

import { ActionTreeNode } from '../models/actions-tree-node.model';

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

        if (!partTree.nodes){
            console.log('getParent - no child nodes for node: ', partTree);
            return null;
        }

        for (const child of partTree.nodes){
            if (child === actualNode){
                console.log('found parent:', partTree);
                return child;

            }
        }

        for (const child of partTree.nodes){
            const result = JMeleonActionTreeUtils.getParentNode(actualNode, child);
            if (!!result){
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





}

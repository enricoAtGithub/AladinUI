import { ActionTreeNode } from '../models/actions-tree-node.model';
import { root } from '../permissions';
import JMeleonActionTreeUtils from './jml-action-tree.utils';

const tree1: ActionTreeNode = {
    name: 'root',
    activated: null,
    nodes: [
        {
            name: 'root.a',
            activated: true
        }, {
            name: 'root.b',
            activated: null,
            nodes: [
                {
                    name: 'root.b.a',
                    activated: true
                }, {
                    name: 'root.b.b',
                    activated: null,
                    nodes: [
                        {
                            name: 'root.b.b.a',
                            activated: true
                        }, {
                            name: 'root.b.b.b',
                            activated: false,
                            nodes: [
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

describe('JMeleonActionTreeUtils', () => {
    it ('should update action tree', () => {

        const node = tree1.nodes[1];
        
        expect(JMeleonActionTreeUtils.getParentNode(node, tree1).activated).toBeNull();
        
        JMeleonActionTreeUtils.updateTree(tree1, node, true);

        expect(node.activated).toBeTruthy();
        checkNodeAndChildren(node, true);
        expect(JMeleonActionTreeUtils.getParentNode(node, tree1).activated).toBeTruthy();


    });
});

const checkNodeAndChildren = (node: ActionTreeNode, expectedActivationValue?: boolean) => {
    expect(node.activated).toEqual(expectedActivationValue);
    if (!!node.nodes && node.nodes.length > 0) {
        node.nodes.forEach(child => checkNodeAndChildren(child, expectedActivationValue));
    }
};

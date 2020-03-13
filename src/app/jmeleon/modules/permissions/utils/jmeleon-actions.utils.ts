import { BranchFlags } from '../models/node-types.model';

export default class JMeleonActionsUtils {

    // private static _dict: Record<Function, string> = {}
    // refactor if possible.
    // find correct function and return the corresponding full-action-path string
    // this also should be in a service?
    private static _dict: [Function, string][] = [];

    // this method has no side effects but is still very tidly coupled to the structure of the
    // root config file and should therefore be moved to the service.
    static generateActionListFromPCC(pcc: Function): string[] {
        let result = JMeleonActionsUtils.generateActionListFromTree((pcc as any).jmeleon);
        result = result.concat(JMeleonActionsUtils.generateActionListFromTree((pcc as any).custom));
        return result;
    }

    static generateActionListFromTree = (tree: Function): string[] => {
        const result: string[] = [];
        JMeleonActionsUtils.fillActionListWithNodeAndChildNodes(tree, result, '', '');
        return result;
    }

    private static fillActionListWithNodeAndChildNodes =
        (node: Function, result: string[], parentPath: string = '', nodeName: string = ''): void => {
        const fullNodeName = `${parentPath}.${nodeName}`;
        if (!JMeleonActionsUtils.nodeHasIngnoreFlag(node)) {
            result.push(fullNodeName);
        }
        const leafs = JMeleonActionsUtils.getActionLeafNames(node);
        // const fullLeafNames = leafs.map(leaf => `${fullNodeName}.${leaf}`);
        // concat doesn't change the reference...
        // result.push(fullLeafNames)
        leafs.forEach(leaf => result.push(`${fullNodeName}.${leaf}`));

        const childNodeNames = JMeleonActionsUtils.getNodeChildNames(node);
        childNodeNames
            .forEach(name =>
                JMeleonActionsUtils.fillActionListWithNodeAndChildNodes(node[name], result, fullNodeName, name));


    }

    private static getNodeFlags = (node: Function): BranchFlags => {
        if (!node.hasOwnProperty('flags')) {
            return BranchFlags.None;
        }
        return <BranchFlags> node['flags'];
    }

    private static nodeHasIngnoreFlag = (node: Function): boolean =>
        // tslint:disable-next-line: no-bitwise
        (JMeleonActionsUtils.getNodeFlags(node) & BranchFlags.IgnoreNodeInActionList) ===
            BranchFlags.IgnoreNodeInActionList

    private static getActionLeafNames = (node: Function): string[] => {

        const keyNames = Object.keys(node);
        // console.log('found keyNames:', keyNames);
        const actionNames = keyNames
            .filter(name => (node[name].hasOwnProperty('type') && node[name]['type'] === 'guiAction'));

            if (actionNames.length > 0) {
                console.log('found actionNames:', actionNames);
            }

        return actionNames;
    }

    static getNodeChildNames = (node: Function): string[] => {
        // todo: when this has been proven valid, combine all in one filter
        const propNames = Object.getOwnPropertyNames(node)
            // filter out all prototype properties (like name and so on)
            .filter(name => node.propertyIsEnumerable(name))
            // filter out all activites
            .filter(name => !(node[name].hasOwnProperty('type') && node[name]['type'] === 'guiAction'))
            // filter out all flags
            .filter(name => name !== 'flags')
            // filter out other properties
            .filter(name => typeof(node[name]) === 'function');
        // console.log('child-names: ', propNames);
        return propNames;
    }


















}

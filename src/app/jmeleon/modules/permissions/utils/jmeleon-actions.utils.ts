import { BranchFlags, BaseGuiAction } from '../models/node-types.model';
import StringUtils from 'src/app/shared/utils/string.utils';

export default class JMeleonActionsUtils {

    static readonly GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX = '.*';

    static generateActionObjectMapFromTree = (tree: Function): [Function, string][] => {
        const result: [Function, string][] = [];
        JMeleonActionsUtils.fillActionObjectMapWithNodeAndChildNodes(tree, result, '', '');
        return result;
    }

    private static fillActionObjectMapWithNodeAndChildNodes =
        (node: Function, result: [Function, string][], parentPath: string = '', nodeName: string = ''): void => {
        parentPath = StringUtils.trimAny(parentPath, '.');
        const fullNodeName = `${(!!parentPath ? parentPath + '.' : parentPath)}${nodeName}`;
        if (!JMeleonActionsUtils.nodeHasIngnoreFlag(node) && !!fullNodeName) {
            // result.push([node, `${fullNodeName}${JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX}`]);
            result.push([node, JMeleonActionsUtils.appendSuffix(fullNodeName)]);
        }
        const leafs = JMeleonActionsUtils.getActionLeafNames(node);

        // concat doesn't change the reference...

        leafs.forEach(leaf => result.push([node[leaf], `${fullNodeName}.${leaf}`]));

        const childNodeNames = JMeleonActionsUtils.getNodeChildNames(node);
        childNodeNames
            .forEach(name =>
                JMeleonActionsUtils.fillActionObjectMapWithNodeAndChildNodes(node[name], result, fullNodeName, name));


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
            // .filter(name => (node[name].hasOwnProperty('type') && node[name]['type'] === BaseGuiAction.TYPE));
            .filter(name => node[name]['type'] === BaseGuiAction.TYPE);

            // if (actionNames.length > 0) {
            //     console.log('found actionNames:', actionNames);
            // }

        return actionNames;
    }

    static getNodeChildNames = (node: Function): string[] => {
        // todo: when this has been proven valid, combine all in one filter
        const propNames = Object.getOwnPropertyNames(node)
            // filter out all prototype properties (like name and so on)
            .filter(name => node.propertyIsEnumerable(name))
            // filter out all activites
            .filter(name => !(node[name].hasOwnProperty('type') && node[name]['type'] === BaseGuiAction.TYPE))
            // filter out all flags
            .filter(name => name !== 'flags')
            // filter out other properties
            .filter(name => typeof(node[name]) === 'function');
        // console.log('child-names: ', propNames);
        return propNames;
    }

    static appendSuffix = (action: string ): string =>
        !!JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX &&
        action.endsWith(JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX) ?
            action :
            action + JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX

    static removeSuffix = (action: string): string =>
        !!JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX &&
        action.endsWith(JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX) ?
            action.substring(0, action.length - (JMeleonActionsUtils.GRAND_RIGHTS_TO_ALL_CHILDREN_SUFFIX.length + 1)) :
            action















}

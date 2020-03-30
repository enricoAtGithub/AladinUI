import { ActionTreeNode } from '../models/actions-tree-node.model';

export default class JMeleonActionsUtils {

    static resolveVars = (path: string, dict: object): string => {
        // console.log('resolving vars', path, dict);
        const keys = Object.keys(dict);
        keys.forEach(key => path = path.replace(key, dict[key]));
        //  console.log('replaced vars', path);
        return path;
    }

}

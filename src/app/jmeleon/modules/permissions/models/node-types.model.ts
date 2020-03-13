
export enum ActionTreeElementTypes {
    Node,
    Action,
    Flag
}

// bit flags for special node meta info
// (turns out, bit-flag enums are discouraged by ts-lint,
//  but in this case it seems like the only
//  feasible way)
export enum BranchFlags {
    None = 0,

    // this node will not be listed in the action-list sent to the backend (its children will though)
    // tslint:disable-next-line: no-bitwise
    IgnoreNodeInActionList = 1 << 0,

    // next: 1 << 1, 1 << 2, 1 << 3 and so on

}

export interface GuiAction {
    type: 'guiAction';
}

export const action = () => <GuiAction> ({type: 'guiAction'} as unknown);


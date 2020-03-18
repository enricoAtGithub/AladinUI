
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

export class BaseGuiAction implements GuiAction {
    static TYPE = 'guiAction';
    public get type(): 'guiAction' { return 'guiAction'; }

}

// export const action = () => <GuiAction> ({type: 'guiAction'} as unknown);
export const action = () => new BaseGuiAction();

// const testAction = action();
// testAction.type;

export type PermissionTreeElement = Function | Object;

// ==============================================================================================================================

// export class PermissionElement {
//     readonly name: string;
//     readonly fullPath: string;
//     readonly id: Symbol; // unique object identifier
//     readonly parent?: PermissionNode; // if this gets too strange, remove readonly modifier and set it at the end of process.

//     constructor(name: string, fullPath: string, parent: PermissionNode) {
//         this.name = name;
//         this.fullPath = fullPath;
//         this.parent = parent;
//         this.id = Symbol();
//     }
// }
// export class PermissionLeaf extends PermissionElement {

//     constructor(name: string, fullPath: string, parent: PermissionNode) {
//         super(name, fullPath, parent);
//     }
// }

// export class PermissionNode extends PermissionElement {
//     // array of all child names for easy dynamic traversing ?
//     constructor(name: string, fullPath: string, parent: PermissionNode) {
//         super(name, fullPath, parent);
//     }
// }


// // example

// export class RootPermissionNode extends PermissionNode {
//     layer01a: Layer01aPermissionNode;
//     constructor() {
//         super('root', 'root', null);
//         //this doesnt work
//         this.layer01a = new Layer01aPermissionNode();
//     }
// }
// const rootNode = new RootPermissionNode();

// export class Layer01aPermissionNode extends PermissionNode {
//     constructor() {
//         super('layer01a', 'root.layer01a', rootNode);
//     }
// }

export abstract class PermissionElement {
    readonly name: string;
    readonly fullPath: string;
    readonly id: Symbol; // unique object identifier
    private _parent?: PermissionNode; // readonly will not work
    get parent(): PermissionNode {
        return this._parent;
    }

    constructor(name: string, fullPath: string) {
        this.name = name;
        this.fullPath = fullPath;
        this.id = Symbol();
    }

    setParent(parent: PermissionNode): void {
        this._parent = parent;
    }
}
export class PermissionLeaf extends PermissionElement {

    constructor(name: string, fullPath: string) {
        super(name, fullPath);
    }
}

export abstract class PermissionNode extends PermissionElement {
    // array of all child names for easy dynamic traversing ?
    constructor(name: string, fullPath: string) {
        super(name, fullPath);
    }
}


// example

/*
root
    layer01a
        leaf01a
    layer01b
        layer02b
            leaf02a
            leaf02b
    //comment
*/

// export class Leaf01aPermissionLeaf extends PermissionLeaf {
//     constructor() {
//         super('leaf01a', 'root.layer01a.leaf01a');
//     }
// }
export class Layer02BPermissionNode  extends PermissionNode {
    readonly leaf02A: PermissionLeaf;
    readonly leaf02B: PermissionLeaf;
    constructor() {
        super('layer02b', 'root.layer01b.layer02b');

        this.leaf02A = new PermissionLeaf('leaf02A', 'root.layer01b.layer02b.leaf02A');
        this.leaf02A.setParent(this);
    }
}

export class Layer01BPermissionNode  extends PermissionNode {
    readonly layer02b: Layer02BPermissionNode;
    constructor() {
        super('layer01b', 'root.layer01b');
        this.layer02b = new Layer02BPermissionNode();
        this.layer02b.setParent(this);
    }
}

export class Layer01aPermissionNode extends PermissionNode {
    readonly leaf01a: PermissionLeaf;
    constructor() {
        super('layer01a', 'root.layer01a');

        this.leaf01a = new PermissionLeaf('leaf01a', 'root.layer01a.leaf01a');
        this.leaf01a.setParent(this);
    }
}

export class RootPermissionNode extends PermissionNode {
    readonly layer01a: Layer01aPermissionNode;
    readonly layer01B: Layer01BPermissionNode;
    constructor() {
        super('root', 'root');
        this.layer01a = new Layer01aPermissionNode();
        this.layer01a.setParent(this);
        this.layer01B = new Layer01BPermissionNode();
        this.layer01B.setParent(this);
    }
}
const rootNode = new RootPermissionNode();

// rootNode.layer01a.
rootNode.layer01a.parent.fullPath;
// vielleicht sollte der parent doch nicht von der basisklasse kommen?
// man verliert so alle individuellen eigenschaften

rootNode.layer01a.leaf01a.fullPath;

export const root = {
	hash : 'foobar',
	layer01a : {
		leaf01a: 'layer01a.leaf01a'
	},
	layer01b : {
		layer02b : {
			leaf02a: 'layer01b.layer02b.leaf02a',
			leaf02b: 'layer01b.layer02b.leaf02b'
		}
	}
};

root.layer01a.leaf01a;

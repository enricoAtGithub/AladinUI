import { GuiAction, BranchFlags, action } from '../models/node-types.model';

// const action = () => <GuiAction> ({type: 'guiAction'} as unknown);

export default class PCJemeleon {
    static dto = class {
        static $dtoType = class {
            static $dtoField = class {
                static flags: BranchFlags = BranchFlags.None;
                static create = action();
                static read = action();
                static write = action();
                static delete = action();
                static test2 = '';
            };
        };
        static test = class {
            static flags: BranchFlags = BranchFlags.IgnoreNodeInActionList;
        };
        static same1 = class {
            static test = class {
                static read:   GuiAction;
                static write:  GuiAction;
            };
        };

        static same2 = class {
            static test = class {
                static read:   GuiAction;
                static write:  GuiAction;
            };
        };
    };
}


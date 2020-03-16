import { GuiAction, BranchFlags, action } from '../models/node-types.model';
import PCJemeleon from './permission-config-jmeleon';
import PCCustom from './permission-config-custom';

// Permission Config Combined
export default class PCC {
    static jmeleon = PCJemeleon;
    static custom = PCCustom;
}

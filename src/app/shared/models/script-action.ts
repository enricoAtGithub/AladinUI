import { BasicFieldConfig } from './field';

export class ScriptActionDefinition {
    public actionHrid: string;
    public name: string;
    public description: string;
    public entityRefType: string;
    public params: BasicFieldConfig[];
}

import { BasicFieldConfig, Field } from './field';

export class ScriptActionDefinition {
    public actionHrid: string;
    public name: string;
    public description: string;
    public entityRefType: string;
    public params: BasicFieldConfig[];
    public async: boolean;
    public resultType: string;
    public showResult: boolean;
}

export class ScriptActionPayload {
    actionHrid: string;
    entityReference:
    {
      dtoType: string;
      id: number
    };
    params?: Field[];
  }

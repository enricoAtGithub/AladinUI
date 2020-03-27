export interface ActionTreeNode{
    name: string;
    activated?: boolean;
    nodes?: ActionTreeNode[];
    description?: string;
}
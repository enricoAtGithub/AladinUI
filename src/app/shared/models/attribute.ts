export class Attribute {
    id: number;
    name: string;
    attributeType: string;
    ownerType: string;
    ownerId: number;
    longValue: number;
    stringValue: string;
    booleanValue: boolean;
    dateValue: Date;
    attributeGroup: string;
    value: string;
    referenceId: number;
    referenceType: string;
    public static copyFrom(source: Attribute, target: Attribute): void {
        target.id = source.id;
        target.booleanValue = source.booleanValue;
        target.stringValue = source.stringValue;
        target.longValue = source.longValue;
        target.dateValue = source.dateValue;
        target.value = source.value;
        target.referenceId = source.referenceId;
        target.referenceType = source.referenceType;
    }
}

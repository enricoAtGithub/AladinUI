export interface AttachmentRequestData {
    attachmentType: string;
    attachmentId?: number;
    ownerType: string;
    ownerId: number;
    attachmentCategory?: string;

    /**
     *
     */
    // constructor(ownerType: string,  ownerId: number, attachmentCategory: string, mainType: string, mainId?: number) {
    //     this.ownerType = ownerType
    // }
}

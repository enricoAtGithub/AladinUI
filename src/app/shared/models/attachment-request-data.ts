export interface AttachmentRequestData {
    attachmentType: string;
    attachmentId?: number;
    ownerType: string;
    ownerId: number;
    attachmentCategory?: string;

    /**
     *
     */
    // constructor(ownerType: string,  ownerId: number, attachmentCategory: string, attachmentType: string, mainId?: number) {
    //     this.ownerType = ownerType
    // }
}

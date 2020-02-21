import { AttachmentFileData } from './attachment-file-data';

export class FileRef {
    fileName: string;
    typ: string;
    id: number;

    public static GenerateFromAttachmentFileData(attachmentFileData: AttachmentFileData): FileRef {
        const fileRef = new FileRef();
        fileRef.fileName = attachmentFileData.DateiName;
        fileRef.typ = attachmentFileData.Typ;
        fileRef.id = attachmentFileData.id;
        return fileRef;
    }
}

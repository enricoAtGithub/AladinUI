export class ErrorMessage {
    severity: string;
    summary: string;
    detail: string;

    constructor (severity: string, summary: string, detail: string) {
        this.severity = severity;
        this.summary = summary;
        this.detail = detail;
    }
}

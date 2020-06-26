export class Notification {
    severity: string;
    summary: string;
    detail: string;
    life: number;

    constructor (severity: string, summary: string, detail: string, life: number) {
        this.severity = severity;
        this.summary = summary;
        this.detail = detail;
        this.life = life;
    }
}

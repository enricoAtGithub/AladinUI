export class AttachmentResponseData {
    // Dateiname: string
    count: Number;
    page: number;
    pages: Number;
    pageSize: Number;
    type: string;
    data: any[];
    getDataKeys = (): string[] => Object.keys(this.data[0]);
    // getDataValues: string[][] = () => this.data.map(d => Object.values(d).map(v => <string>v));
    getDataValues(): string[][] {
        return this.data.map(d => Object.values(d).map(v => <string>v));
    }
    getDataKeysAndValues(): {keys: string[], values: string[][]} {
        if (!this.data || this.data.length === 0) {
            return {keys: [], values: [] };
        }

        let idPos = -1;
        const keys = Object
            .keys(this.data[0]).map((d, pos) => {
                if (d === 'id') {
                    idPos = pos;
                }
                return d;
            });
            // .filter(key => key !== 'id');

        const values = this.data
            // .filter((_, pos) => pos !== idPos)
            .map(obj => {
                const rowVal = Object
                    .values(obj)
                    .map(val => <string>val);
                    // .filter((_, pos) => pos !== idPos);
                // rowVal = rowVal.filter((_, pos) => pos !== idPos);
                // console.log('[AttachmentResponseData] row prev: ', rowVal);
                rowVal.push('buttons');
                // console.log('[AttachmentResponseData] row post: ', rowVal);
                return rowVal;
            });

        keys.push('buttons');

        return {
            keys,
            values
        };
    }

    getAllFileIDs(): number[] {
        return this.data.map(d => <number>d.id);
    }
}


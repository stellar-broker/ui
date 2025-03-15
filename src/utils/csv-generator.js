class CsvGenerator {
    constructor() {

    }

    /**
     * File contents.
     * @type {string}
     */
    contents = ''

    /**
     * Max columns (defined by header).
     * @type {number}
     */
    columns = 0

    /**
     *
     * @param {Array<String>} columnHeaders - Header for each column.
     */
    writeHeader(columnHeaders) {
        this.columns = columnHeaders.length || 0
        this.writeRow(columnHeaders)
    }

    writeRow(values) {
        if (!(values instanceof Array)) throw new Error('Array of values expected.')
        let row = values
            .map(value => {
                //check if a value should be enclosed into double-quotes
                if (!/[\r\n,"]/.test(value)) return value
                return `"${value.replace(/"/g, '""')}"`
            })
            .join(',')
        this.contents += row + '\r\n'
    }

    writeData(data) {
        for (let record of data) {
            this.writeRow(record)
        }
    }

    buildFile(data, header) {
        this.contents = ''
        this.writeHeader(header)
        this.writeData(data)
    }

    downloadCSV(fileName) {
        const csvData = new Blob([this.contents], { type: 'text/csv' });
        const csvURL = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvURL;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

export default new CsvGenerator()
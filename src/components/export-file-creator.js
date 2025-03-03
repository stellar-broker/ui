import React, {useCallback} from 'react'
import {Button} from './ui/button'
import CsvGenerator from '../utils/csv-generator'

function ExportFileCreator({data, header, fileName}) {

    const downloadFile = useCallback(() => {
        try {
            CsvGenerator.buildFile(data, header)
            CsvGenerator.downloadCSV(fileName)
        } catch (e) {
            notify({type: 'error', message: e.message || 'Failed to download file'})
        }
    }, [data, header, fileName])

    return <Button stackable outline onClick={downloadFile}>
        <i className="icon-download"/>Export to .CSV</Button>
}

export default ExportFileCreator
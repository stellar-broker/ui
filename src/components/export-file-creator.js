import React, {useCallback, useState} from 'react'
import {formatDateUTC, fromStroops} from '@stellar-expert/formatter'
import {fetchAllData} from '../api/api-call'
import CsvGenerator from '../utils/csv-generator'
import {Button} from './ui/button'
import {Dialog} from './ui/dialog'

const types = {
    'tx': {
        'endPoint': 'partner/swaps',
        'fileName': 'transaction'
    },
}

function ExportFileCreator({type}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const downloadFile = useCallback(async () => {
        setIsProcessing(true)
        const data = await fetchAllData('partner/swaps')
        const headerExportFile = Object.keys(parseTx(data[0]) || {})
        const dataExportFile = data?.map(tx => {
            return Object.values(parseTx(tx) || {})
        })
        try {
            CsvGenerator.buildFile(dataExportFile, headerExportFile)
            CsvGenerator.downloadCSV(types[type].fileName)
        } catch (e) {
            notify({type: 'error', message: e.message || 'Failed to download file'})
        }
        setIsProcessing(false)
    }, [type])

    return <div>
        <Button stackable outline onClick={toggleDialog}><i className="icon-download"/>Export to .CSV</Button>
        <Dialog dialogOpen={isOpen} className="text-left">
            <div className="micro-space"><h5>Export data</h5></div>
            <div className="space">
                We will create the file and send it to you, it will take some time.<br/>
                Would you like to download a .CSV file?
            </div>
            <div className="row">
                <div className="column column-33 column-offset-33">
                    <Button outline block onClick={toggleDialog}>Cancel</Button>
                </div>
                <div className="column column-33">
                    <Button block disabled={isProcessing} onClick={downloadFile}>Download</Button>
                </div>
            </div>
        </Dialog>
    </div>
}

function parseTx(tx) {
    const totalFees = tx.trades.reduce((acc, trade) => acc + BigInt(trade.fee || 0), 0n)
    return {
        'Date': formatDateUTC(tx.created),
        'Type': tx.direction,
        'Selling asset': tx.sellingAsset,
        'Selling amount': fromStroops(tx.sellingAmount),
        'Buying asset': tx.buyingAsset,
        'Buying amount': fromStroops(tx.quote.estimatedBuyingAmount),
        'Partner fee': fromStroops(totalFees),
        'API key': tx.apiKey.replace('…','-'),
        'Ledger': tx.quote.ledger
    }
}

export default ExportFileCreator
import React, {useState, useCallback} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {formatDateUTC, fromStroops} from '@stellar-expert/formatter'
import {performApiCall} from '../api/api-call'
import CsvGenerator from '../utils/csv-generator'
import {Button} from './ui/button'
import {Dialog} from './ui/dialog'
import {stringifyQuery} from '../utils/query'

function ExportFileCreator({type}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const downloadFile = useCallback(async () => {
        const params = {
            limit: 100,
            order: 'desc'
        }
        setIsProcessing(true)
        try {
            const data = await performApiCall(`partner/swaps${stringifyQuery(params)}`)
            const swaps = data?._embedded.records.map(swap => parseSwap(swap)) || []
            const headerExportFile = Object.keys(swaps[0] || {})
            const dataExportFile = swaps.map(swap => Object.values(swap || {}))
            CsvGenerator.buildFile(dataExportFile, headerExportFile)
            CsvGenerator.downloadCSV('transaction')
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

function parseSwap(tx) {
    const sellingAsset = AssetDescriptor.parse(tx.sellingAsset)
    const buyingAsset = AssetDescriptor.parse(tx.buyingAsset)
    const totalFees = tx.trades.reduce((acc, trade) => acc + BigInt(trade.fee || 0), 0n)
    return {
        'Date': formatDateUTC(tx.created),
        'Sell': `${fromStroops(tx.sellingAmount)} ${sellingAsset.code}`,
        'Buy': `${fromStroops(tx.quote.estimatedBuyingAmount)} ${buyingAsset.code}`,
        'Trades': prepareTrades(tx.trades),
        'Partner fee': totalFees > 0n ? '$' + fromStroops(totalFees) : '-'
    }
}

function prepareTrades(trades = []) {
    const statusTrades = {
        'success': 1,
        'failed': 0,
        'unconfirmed': 0
    }
    trades.reduce((acc, trade) => {
        switch (trade.status) {
            case 'success': statusTrades.success++
                break
            case 'failed': statusTrades.failed++
                break
            default: statusTrades.unconfirmed++
                break
        }
        return acc
    }, 0)

    const successTrades = statusTrades.success ? `success: ${statusTrades.success}; ` : ''
    const failedTrades = statusTrades.failed ? `failed: ${statusTrades.failed}; ` : ''
    const unconfirmedTrades = statusTrades.unconfirmed ? `unconfirmed: ${statusTrades.unconfirmed};` : ''
    const inline = (successTrades + failedTrades + unconfirmedTrades).trim()

    return inline.slice(0, -1)
}

export default ExportFileCreator
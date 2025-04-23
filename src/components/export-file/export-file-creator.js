import React, {useState, useCallback} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {formatDateUTC, fromStroops} from '@stellar-expert/formatter'
import {performApiCall} from '../../api/api-call'
import {stringifyQuery} from '../../utils/query'
import CsvGenerator from '../../utils/csv-generator'
import {Button} from '../ui/button'
import {Dialog} from '../ui/dialog'
import {Dropdown} from '../ui/dropdown'
import './export-selector.scss'

export default function ExportFileCreator() {
    const [type, setType] = useState()
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
            const exportData = (type === 'Swaps') ?
                data?._embedded.records.map(swap => parseSwap(swap)) :
                data?._embedded.records.reduce((acc, swap) => {
                    const trades = swap.trades.map(trade => {
                        return parseTransaction(trade, [swap.sellingAsset, swap.buyingAsset])
                    })
                    return [...acc, ...trades]
                }, [])
            const headerExportFile = Object.keys(exportData[0] || {})
            const dataExportFile = exportData.map(swap => Object.values(swap || {}))
            CsvGenerator.buildFile(dataExportFile, headerExportFile)
            CsvGenerator.downloadCSV(type)
        } catch (e) {
            notify({type: 'error', message: e.message || 'Failed to download file'})
        }
        setIsProcessing(false)
    }, [type])

    const onChange = useCallback((val) => {
        setType(val)
        toggleDialog()
    }, [toggleDialog])

    return <div>
        <Dropdown className="export-selector" options={['Swaps', 'Transactions']} onChange={onChange} showToggle={false}
                  title={<Button stackable outline className="button-micro" style={{margin: 0}}><i className="icon-download"/>Export to .CSV</Button>}/>
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

function parseSwap(swap) {
    const sellingAsset = AssetDescriptor.parse(swap.sellingAsset)
    const buyingAsset = AssetDescriptor.parse(swap.buyingAsset)
    const totalFees = swap.trades.reduce((acc, trade) => acc + BigInt(trade.fee || 0), 0n)
    return {
        'Date': formatDateUTC(swap.created),
        'Sell': `${fromStroops(swap.sellingAmount)} ${sellingAsset.code}`,
        'Buy': `${fromStroops(swap.quote.estimatedBuyingAmount)} ${buyingAsset.code}`,
        'Trades': prepareSwapTrades(swap.trades),
        'Partner fee': totalFees > 0n ? '$' + fromStroops(totalFees) : '-'
    }
}

function parseTransaction(tx, pair) {
    const sellingAsset = AssetDescriptor.parse(pair[0])
    const buyingAsset = AssetDescriptor.parse(pair[1])
    return {
        'Date': formatDateUTC(tx.created),
        'Sell': `${fromStroops(tx.sold || tx.estimatedSold)} ${sellingAsset.code}`,
        'Buy': `${fromStroops(tx.bought || tx.estimatedBought)} ${buyingAsset.code}`,
        'Partner fee': tx.fee > 0n ? '$' + fromStroops(BigInt(tx.fee || 0)) : '-',
        'Status': ['success', 'failed'].includes(tx.status) ? tx.status : 'unconfirmed',
        'TxHash': tx.tx,
    }
}

function prepareSwapTrades(trades = []) {
    const statusTrades = {
        'success': 0,
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
import React, {useEffect, useState} from 'react'
import {swaps} from '../../utils/swaps-demo'
import TransactionsView from '../../components/transactions-view'
import ExportFileCreator from '../../components/export-file-creator'
import {formatDate, formatStroopPrice} from '../../utils/formatter'

function parseTx(tx) {
    return {
        'Date': formatDate(tx.created),
        'Type': tx.direction,
        'Selling asset': tx.sellingAsset,
        'Selling amount': formatStroopPrice(tx.sellingAmount),
        'Buying asset': tx.buyingAsset,
        'Buying amount': formatStroopPrice(tx.quote.estimatedBuyingAmount),
        'Partner fee': formatStroopPrice(tx.quote.fees.partnerFee),
        'Account': tx.account,
        'API key': tx.apiKey.replace('…','-'),
        'Ledger': tx.quote.ledger
    }
}

function PartnerTransactionsPage() {
    const [AllTransactions, setAllTransactions] = useState([])
    const headerExportFile = Object.keys(AllTransactions[0] || {})
    const dataExportFile = AllTransactions.map(tx => Object.values(tx || {}))

    useEffect(() => {
        //TODO: get swaps from API
        setAllTransactions(swaps?.map(tx => parseTx(tx)))
    }, [swaps])

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <div className="flex-middle">
                    <h4>Transactions</h4>&nbsp;
                    <span className="badge">{AllTransactions?.length}</span>
                </div>
                <p className="text-small dimmed nano-space">All swaps executed with your partner key</p>
            </div>
            <div className="column column-25">
                <div className="nano-space"/>
                <ExportFileCreator data={dataExportFile} header={headerExportFile} fileName="transaction"/>
            </div>
        </div>
        <div className="hr space"/>
        <TransactionsView/>
    </div>
}

export default PartnerTransactionsPage
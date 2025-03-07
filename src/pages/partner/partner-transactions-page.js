import React, {useEffect, useState} from 'react'
import {fromStroops, normalizeDate} from '@stellar-expert/formatter'
import {swaps} from '../../utils/swaps-demo'
import TransactionsView from '../../partner/transactions/transactions-view'
import ExportFileCreator from '../../components/export-file-creator'

function parseTx(tx) {
    return {
        'Date': normalizeDate(tx.created),
        'Type': tx.direction,
        'Selling asset': tx.sellingAsset,
        'Selling amount': fromStroops(tx.sellingAmount),
        'Buying asset': tx.buyingAsset,
        'Buying amount': fromStroops(tx.quote.estimatedBuyingAmount),
        'Partner fee': fromStroops(tx.quote.fees.partnerFee),
        'Account': tx.account,
        'API key': tx.apiKey.replace('…','-'),
        'Ledger': tx.quote.ledger
    }
}

function PartnerTransactionsPage() {
    const headerExportFile = Object.keys(AllTransactions[0] || {})
    const dataExportFile = AllTransactions.map(tx => Object.values(tx || {}))

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <div className="flex-middle">
                    <h4>Transactions</h4>
                </div>
                <p className="text-small dimmed nano-space">All swaps executed with your partner key</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <ExportFileCreator data={dataExportFile} header={headerExportFile} fileName="transaction"/>
            </div>
        </div>
        <div className="hr space"/>
        <TransactionsView/>
    </div>
}

export default PartnerTransactionsPage
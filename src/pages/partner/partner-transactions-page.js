import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SwapHistoryView from '../../partner/transactions/swap-history-view'
import DataExporter from '../../components/export/data-exporter'

export default function PartnerTransactionsPage() {
    setPageMetadata({
        title: 'Swap history',
        description: 'Transaction executed by partner\'s users.'
    })

    return <div>
        <div className="row">
            <div className="column column-75">
                <div className="flex-middle">
                    <h3>Swap history</h3>
                </div>
                <p className="dimmed space">All swaps executed with your partner key</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <DataExporter/>
            </div>
        </div>
        <div className="mobile-only space"/>
        <div className="hr space"/>
        <SwapHistoryView/>
    </div>
}
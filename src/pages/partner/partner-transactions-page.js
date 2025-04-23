import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SwapHistoryView from '../../partner/transactions/swap-history-view'
import ExportFileCreator from '../../components/export-file/export-file-creator'

export default function PartnerTransactionsPage() {
    setPageMetadata({
        title: 'Swap history',
        description: 'All swaps executed with partner key.'
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
                <ExportFileCreator/>
            </div>
        </div>
        <div className="mobile-only space"/>
        <div className="hr space"/>
        <SwapHistoryView/>
    </div>
}
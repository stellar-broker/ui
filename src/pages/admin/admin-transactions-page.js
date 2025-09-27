import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SwapHistoryView from '../../partner/transactions/swap-history-view'

export default function AdminTransactionsPage() {
    setPageMetadata({
        title: 'Swap history',
        description: 'All swaps executed by the platform.'
    })

    return <div>
        <div className="flex-middle">
            <h3>Swap history</h3>
        </div>
        <p className="dimmed space">All swaps executed by the platform</p>
        <div className="mobile-only space"/>
        <div className="hr space"/>
        <SwapHistoryView endpoint="swaps"/>
    </div>
}
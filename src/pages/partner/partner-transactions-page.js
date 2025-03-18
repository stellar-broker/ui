import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SwapHistoryView from '../../partner/transactions/swap-history-view'
import ExportFileCreator from '../../components/export-file/export-file-creator'

function PartnerTransactionsPage() {
    setPageMetadata({
        title: 'Swap history',
        description: 'All swaps executed with partner key.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <div className="flex-middle">
                    <h4>Swap history</h4>
                </div>
                <p className="text-small dimmed nano-space">All swaps executed with your partner key</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <ExportFileCreator/>
            </div>
        </div>
        <div className="hr space"/>
        <SwapHistoryView/>
    </div>
}

export default PartnerTransactionsPage
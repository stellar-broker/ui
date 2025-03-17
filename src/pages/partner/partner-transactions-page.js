import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import TransactionsView from '../../partner/transactions/transactions-view'
import ExportFileCreator from '../../components/export-file/export-file-creator'

export default function PartnerTransactionsPage() {
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
        <TransactionsView/>
    </div>
}
import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import TransactionsView from '../../partner/transactions/transactions-view'

function PartnerTransactionsPage() {
    setPageMetadata({
        title: 'Transactions',
        description: 'All swaps executed with partner key.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <div className="flex-middle">
                    <h4>Transactions</h4>
                </div>
                <p className="text-small dimmed nano-space">All swaps executed with your partner key</p>
            </div>
        </div>
        <div className="hr space"/>
        <TransactionsView/>
    </div>
}

export default PartnerTransactionsPage
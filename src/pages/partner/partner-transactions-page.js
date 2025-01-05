import React from 'react'
import TransactionsView from '../../components/transactions-view'
import {Button} from '../../components/ui/button'

function PartnerTransactionsPage() {

    return <div>
        <div className="dual-layout middle">
            <div className="flex-middle">
                <h4>Transactions</h4>&nbsp;
                <span className="badge">2,107</span>
            </div>
            <Button outline className="text-small"><i className="icon-download"/>Export to .CSV</Button>
        </div>
        <p className="text-small dimmed space">All swaps executed with your partner key</p>
        <div className="hr space"/>
        <TransactionsView/>
    </div>
}

export default PartnerTransactionsPage
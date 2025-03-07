import React from 'react'
import TransactionsView from '../../partner/transactions/transactions-view'
import ExportFileCreator from '../../components/export-file-creator'

function PartnerTransactionsPage() {
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
                {/*<ExportFileCreator data={dataExportFile} header={headerExportFile} fileName="transaction"/>*/}
            </div>
        </div>
        <div className="hr space"/>
        <TransactionsView/>
    </div>
}

export default PartnerTransactionsPage
import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import WithdrawFormView from '../../partner/payouts/withdraw-form-view'
import WithdrawHistoryView from '../../partner/payouts/withdraw-history-view'

export default function PartnerPayoutsPage() {
    setPageMetadata({
        title: 'Payouts',
        description: 'Withdrawal broker earnings and payments history.'
    })

    return <div>
        <div className="row">
            <div className="column column-75">
                <h3>Payouts</h3>
                <p className="dimmed space">Withdraw broker earnings</p>
            </div>
        </div>
        <div className="hr space"/>
        <WithdrawFormView/>
        <WithdrawHistoryView/>
    </div>
}
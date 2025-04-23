import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import WithdrawForm from '../../partner/payouts/withdraw-form'

export default function PartnerPayoutsPage() {
    setPageMetadata({
        title: 'Payouts',
        description: 'Withdrawal partner earnings and payments history.'
    })

    return <div>
        <div className="row">
            <div className="column column-75">
                <h3>Payouts</h3>
                <p className="dimmed space">Withdraw your earnings</p>
            </div>
        </div>
        <div className="hr space"/>
        <WithdrawForm/>
    </div>
}
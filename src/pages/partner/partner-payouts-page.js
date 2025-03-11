import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import WithdrawForm from '../../partner/payouts/withdraw-form'

function PartnerPayoutsPage() {
    setPageMetadata({
        title: 'Payouts',
        description: 'Withdrawal partner earnings and payments history.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Payouts</h4>
                <p className="text-small dimmed nano-space">Withdraw your earnings</p>
            </div>
        </div>
        <div className="hr space"/>
        <WithdrawForm/>
    </div>
}

export default PartnerPayoutsPage
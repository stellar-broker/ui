import React from 'react'
import {Button} from '../../components/ui/button'

function PartnerPayoutsPage() {

    return <div>
        <div className="dual-layout middle">
            <div className="flex-middle">
                <h4>Payouts</h4>&nbsp;
                <span className="badge">103</span>
            </div>
            <Button outline className="text-small"><i className="icon-download"/>Export to .CSV</Button>
        </div>
        <p className="text-small dimmed space">All payments executed with your partner key</p>
        <div className="hr space"/>
    </div>
}

export default PartnerPayoutsPage
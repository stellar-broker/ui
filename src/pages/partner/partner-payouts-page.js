import React from 'react'
import {Button} from '../../components/ui/button'

function PartnerPayoutsPage() {

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Payouts</h4>
                <p className="text-small dimmed nano-space">All payments executed with your partner key</p>
            </div>
            <div className="column column-25">
                <div className="nano-space"/>
                <Button block outline><i className="icon-download"/>Export to .CSV</Button>
            </div>
        </div>
        <div className="hr space"/>
    </div>
}

export default PartnerPayoutsPage
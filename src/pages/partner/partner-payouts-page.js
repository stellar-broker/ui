import React from 'react'
import {Button} from '../../components/ui/button'
import {setPageMetadata} from '../../utils/meta-tags-generator'

function PartnerPayoutsPage() {
    setPageMetadata({
        title: 'Payouts',
        description: 'All payments executed with your partner key.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Payouts</h4>
                <p className="text-small dimmed nano-space">All payments executed with your partner key</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <Button stackable outline><i className="icon-download"/>Export to .CSV</Button>
            </div>
        </div>
        <div className="hr space"/>
    </div>
}

export default PartnerPayoutsPage
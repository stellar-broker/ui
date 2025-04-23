import React, {useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import {performApiCall} from '../../api/api-call'
import PartnersView from '../../admin/partners/partners-view'

export default function AdminPartnersPage() {
    const [partnerList, setPartnerList] = useState()

    useEffect(() => {
        performApiCall('partner')
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners data. ' + result.error})
                //admin exclusion
                const list = result._embedded.records.filter(user => !user.roles?.includes('admin'))
                setPartnerList(list)
            })
    }, [])

    setPageMetadata({
        title: 'Partners',
        description: 'Manage all connected partners.'
    })

    return <div>
        <div className="row">
            <div className="column column-75">
                <h3>Partners</h3>
                <p className="text-small dimmed space">Manage all connected partners</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <Button stackable outline href="/admin/partner/add" className="button-micro" style={{margin: 0}}>Add partner</Button>
            </div>
        </div>
        <div className="mobile-only space"/>
        <div className="hr space"/>
        <PartnersView partnerList={partnerList}/>
    </div>
}
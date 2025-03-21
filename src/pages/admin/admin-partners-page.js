import React, {useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import {performApiCall} from '../../api/api-call'
import PartnersView from '../../admin/partners/partners-view'

function AdminPartnersPage() {
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
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Partners</h4>
                <p className="text-small dimmed nano-space">Manage all connected partners</p>
            </div>
            <div className="column column-25 text-right">
                <div className="nano-space"/>
                <Button stackable outline href="/admin/partner/add"><i className="icon-user-add"/> Add partner</Button>
            </div>
        </div>
        <div className="hr space"/>
        <PartnersView partnerList={partnerList}/>
    </div>
}

export default AdminPartnersPage
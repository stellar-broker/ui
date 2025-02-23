import React, {useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import PartnersView from '../../components/partners-view'

const partners = [
    {
        "id": "5983b324cd3ceaa40a1ba10a",
        "email": "test-partner@test.com",
        "created": "2024-06-28T12:57:08.744Z",
        "settings": {
            "partnerVarFee": 200,
            "striderVarFee": 100
        },
        "keys": [
            "471F...dp78"
        ]
    },
    {
        "id": "777eb324cd3ceaa40a1ba173",
        "email": "test-partner@gmail.com",
        "created": "2024-04-28T12:57:08.744Z",
        "settings": {
            "partnerVarFee": 20,
            "striderVarFee": 100
        },
        "keys": [
            "A71C...FdR5",
            "T2AC...8RDf"
        ]
    }
]

function AdminPartnersPage() {
    const [partnerList, setPartnerList] = useState()

    useEffect(() => {
        //TODO: get key list from API
        setPartnerList(partners)
    }, [partners])

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Partners</h4>
                <p className="text-small dimmed nano-space">Managing all partners</p>
            </div>
            <div className="column column-25">
                <div className="nano-space"/>
                <Button block outline href="add"><i className="icon-user-add"/> Add partner</Button>
            </div>
        </div>
        <div className="hr space"/>
        <PartnersView partnerList={partnerList}/>
    </div>
}

export default AdminPartnersPage
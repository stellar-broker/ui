import React, {useCallback, useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import PartnersView from '../../components/partners-view'

const partners = [
    {
        "id": "667eb324cd3ceaa40a1ba14e",
        "email": "test-partner@swapstrider.net",
        "created": "2024-06-28T12:57:08.744Z",
        "settings": {
            "partnerVarFee": 200,
            "striderVarFee": 100
        },
        "keys": [
            "5Z1F...CRdo"
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
    console.log(partners)

    return <div>
        <div className="dual-layout middle">
            <div>
                <h4>Partners</h4>
            </div>
            <Button href="add"><i className="icon-user-add"/> Add partner</Button>
        </div>
        <p className="text-small dimmed space">Managing all partners</p>
        <div className="hr space"/>
        <PartnersView partnerList={partnerList}/>
    </div>
}

function AddPartnerForm({updatePartnerList}) {
    const [isOpen, setIsOpen] = useState(false)
    const [apiKey, setApiKey] = useState()

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const changeApiKey = useCallback(e => setApiKey(e.target.value.trim()), [])

    const generateApiKey = useCallback(() => {
        const generated = 'xxxxxxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            const r = (Math.random()*16)%16 | 0
            return (c === 'x' ? r : (r&0x3|0x8)).toString(16)
        })
        setApiKey(generated)
    }, [])

    const addApiKey = useCallback(() => {
        if (!apiKey)
            return
        updatePartnerList(prev => ([...prev, {key: apiKey, accessibility: 'Active'}]))
        toggleDialog(false)
        setApiKey('')
    }, [apiKey, updatePartnerList, toggleDialog])

    return <>
        <Button outline className="text-small" onClick={toggleDialog}><i className="icon-user-add"/>Add partner</Button>
        <Dialog dialogOpen={isOpen}>
            <div className="micro-space"><h5>Add new API key</h5></div>
            <div className="space">
                <div className="dual-layout text-small">
                    <p className="label">API key</p>
                    <a href="#" onClick={generateApiKey}>generate</a>
                </div>
                <input value={apiKey || ''} onChange={changeApiKey} className="styled-input"/>
            </div>
            <div className="row">
                <div className="column column-33 column-offset-33">
                    <Button outline block onClick={toggleDialog}>Cancel</Button>
                </div>
                <div className="column column-33">
                    <Button block onClick={addApiKey}>Save</Button>
                </div>
            </div>
        </Dialog>
    </>
}

export default AdminPartnersPage
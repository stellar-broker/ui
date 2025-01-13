import React, {useCallback, useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'


function AdminPartnersPage() {
    const [partners, setPartners] = useState()

    useEffect(() => {
        //TODO: get key list from API
        setPartners({})
    }, [])

    return <div>
        <div className="dual-layout middle">
            <div>
                <h4>Partners</h4>
            </div>
            <AddPartnerForm updatePartnerList={setPartners}/>
        </div>
        <p className="text-small dimmed space">Managing all partners</p>
        <div className="hr space"/>
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
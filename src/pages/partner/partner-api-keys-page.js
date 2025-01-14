import React, {useCallback, useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import ApiKeysView from '../../components/api-keys-view'

const keys = [
    {key: '91a50c23-9843-bb91-abe356adae47', accessibility: 'Active'},
    {key: 'ffbcf5ba-834e-9529-bc8d990fd2cd', accessibility: 'Active'},
    {key: '10de5934-80a7-8f86-729da9d86985', accessibility: 'Disabled'},
    {key: 'cf52529a-b063-86db-756e98ba1093', accessibility: 'Active'}
]

function PartnerApiKeysPage() {
    const [keyList, setKeyList] = useState()

    useEffect(() => {
        //TODO: get key list from API
        setKeyList(keys)
    }, [keys])

    return <div>
        <div className="dual-layout middle">
            <div>
                <h4>API keys</h4>
            </div>
            <AddApiKeyForm updateKeyList={setKeyList}/>
        </div>
        <p className="text-small dimmed space">Managing your API keys</p>
        <div className="hr space"/>
        <ApiKeysView keyList={keyList} updateKeyList={setKeyList}/>
    </div>
}

function AddApiKeyForm({updateKeyList}) {
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
        updateKeyList(prev => ([...prev, {key: apiKey, accessibility: 'Active'}]))
        toggleDialog(false)
        setApiKey('')
    }, [apiKey, updateKeyList, toggleDialog])

    return <>
        <Button outline className="text-small" onClick={toggleDialog}><i className="icon-key-add"/>Add new API key</Button>
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

export default PartnerApiKeysPage
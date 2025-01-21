import React, {useCallback, useEffect, useState} from 'react'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import ApiKeysView from '../../components/api-keys-view'

const keys = [
    {key: '91a50c23-9843-bb91-abe356adae47', status: 'Active'},
    {key: 'ffbcf5ba-834e-9529-bc8d990fd2cd', status: 'Active'},
    {key: '10de5934-80a7-8f86-729da9d86985', status: 'Disabled'},
    {key: 'cf52529a-b063-86db-756e98ba1093', status: 'Active'}
]

function PartnerApiKeysPage() {
    const [keyList, setKeyList] = useState()

    useEffect(() => {
        //TODO: get key list from API
        setKeyList(keys)
    }, [keys])

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>API keys</h4>
                <p className="text-small dimmed nano-space">Managing your API keys</p>
            </div>
            <div className="column column-25">
                <div className="nano-space"/>
                <AddApiKeyForm updateKeyList={setKeyList}/>
            </div>
        </div>
        <div className="hr space"/>
        <ApiKeysView keyList={keyList} updateKeyList={setKeyList}/>
    </div>
}

function AddApiKeyForm({updateKeyList}) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const generateApiKey = useCallback(() => {
        //TODO: receive API key from server
        const generated = 'xxxxxxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            const r = (Math.random()*16)%16 | 0
            return (c === 'x' ? r : (r&0x3|0x8)).toString(16)
        })
        updateKeyList(prev => ([...prev, {key: generated, status: 'Active'}]))
        toggleDialog(false)
        notify({type: "success", message: "New API key has been added"})
    }, [updateKeyList, toggleDialog])

    return <>
        <Button block outline onClick={toggleDialog}><i className="icon-key-add"/>Add new API key</Button>
        <Dialog dialogOpen={isOpen}>
            <div className="micro-space"><h5>Add new API key</h5></div>
            <div className="space">
                Submit a request to get a new API key. Server will generate you API key witch you can use immediately.
            </div>
            <div className="row">
                <div className="column column-33 column-offset-33">
                    <Button outline block onClick={toggleDialog}>Cancel</Button>
                </div>
                <div className="column column-33">
                    <Button block onClick={generateApiKey}>Generate</Button>
                </div>
            </div>
        </Dialog>
    </>
}

export default PartnerApiKeysPage
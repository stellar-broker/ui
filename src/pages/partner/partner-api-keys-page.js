import React, {useCallback, useEffect, useState} from 'react'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import ApiKeysView from '../../components/api-keys-view'

function PartnerApiKeysPage() {
    const [keyList, setKeyList] = useState()

    useEffect(() => {
        performApiCall(`partner/api-key`, {auth: true})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve API keys. ' + result.error})

                setKeyList(result.map(key => ({key, status: 'Active'})))
            })
    }, [])

    return <div>
        <div className="row nano-space">
            <div className="column column-66">
                <h4>API keys</h4>
                <p className="text-small dimmed nano-space">Managing your API keys</p>
            </div>
            <div className="column column-33 text-right">
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
        performApiCall(`partner/api-key`, {method: 'POST', auth: true})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to generate new API key. ' + result.error})

                updateKeyList(prev => ([...prev, {key: result.key, status: 'Active'}]))
                toggleDialog(false)
                notify({type: "success", message: "New API key has been added"})
            })
    }, [updateKeyList, toggleDialog])

    return <>
        <Button stackable outline onClick={toggleDialog}><i className="icon-key-add"/>Add new API key</Button>
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
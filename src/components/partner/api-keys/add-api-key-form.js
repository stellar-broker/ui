import React, {useCallback, useState} from 'react'
import {performApiCall} from '../../../api/api-call'
import {Button} from '../../ui/button'
import {Dialog} from '../../ui/dialog'

function AddApiKeyForm({updateKeyList}) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const generateApiKey = useCallback(() => {
        toggleDialog()
        performApiCall(`partner/api-key`, {method: 'POST'})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to generate new API key. ' + result.error})

                updateKeyList(prev => ([...prev, {key: result.key, status: 'Active'}]))
                notify({type: 'success', message: 'New API key has been added'})
            })
    }, [updateKeyList, toggleDialog])

    return <>
        <Button stackable outline onClick={toggleDialog}><i className="icon-key-add"/>Add new API key</Button>
        <div className="text-left">
            <Dialog dialogOpen={isOpen}>
                <div className="micro-space"><h5>Add new API key</h5></div>
                <div className="space">
                    Generate new API key? Each partner account can contain up to 10 unique keys.
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
        </div>
    </>
}

export default AddApiKeyForm
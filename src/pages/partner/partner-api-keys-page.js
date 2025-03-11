import React, {useEffect, useState} from 'react'
import {performApiCall} from '../../api/api-call'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import ApiKeysView from '../../partner/api-keys/api-keys-view'
import ApiKeyListView from '../../partner/api-keys/api-key-list-view'
import AddApiKeyForm from '../../partner/api-keys/add-api-key-form'

export default function PartnerApiKeysPage() {
    const [keyList, setKeyList] = useState()

    useEffect(() => {
        performApiCall(`partner/api-key`)
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve API keys. ' + result.error})
                setKeyList(result)
            })
    }, [])

    setPageMetadata({
        title: 'API keys',
        description: 'Partner API Key Management.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-66">
                <h4>API keys</h4>
                <p className="text-small dimmed nano-space">Managing your API keys</p>
            </div>
            <div className="column column-33 text-right desktop-only">
                <div className="nano-space"/>
                <AddApiKeyForm updateKeyList={setKeyList}/>
            </div>
        </div>
        <div className="hr space"/>
        <ApiKeyListView keyList={keyList} updateKeyList={setKeyList}/>
        <div className="space"/>
        <div className="mobile-only">
            <div className="hr space"/>
            <AddApiKeyForm updateKeyList={setKeyList}/>
        </div>
    </div>
}
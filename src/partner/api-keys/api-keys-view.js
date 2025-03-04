import {useCallback} from 'react'
import {CopyToClipboard} from '../../utils/copy-to-clipboard'
import {performApiCall} from '../../api/api-call'

function ApiKeysView({keyList, updateKeyList}) {
    return <div>
        {keyList?.map((apiKey) => {
            return <div key={apiKey} className="card outline micro-space">
                <ApiKeyEntry apiKey={apiKey} updateKeyList={updateKeyList}/>
            </div>
        })}
    </div>
}

function ApiKeyEntry({apiKey, updateKeyList}) {
    const remove = useCallback(() => {
        if (confirm('Are you sure you want to remove this API key?')) {
            performApiCall(`partner/api-key/${apiKey}`, {method: 'DELETE'})
                .then(res => {
                    if (res.error)
                        return notify({type: 'error', message: 'Failed to remove API key'})
                    updateKeyList(prev => {
                        const newKeyList = [...prev]
                        newKeyList.splice(newKeyList.indexOf(apiKey), 1)
                        return newKeyList
                    })
                })
        }
    }, [apiKey, updateKeyList])

    return <div className="nano-space">
        <div className="dual-layout">
            <div style={{maxWidth: '85%'}}>
                <code className="word-break">{apiKey}</code> <CopyToClipboard text={apiKey}/>
            </div>
            <div className="text-right" style={{width: '2em'}}>
                <a href="#" onClick={remove} className="icon icon-delete-circle" title="Delete API key"/>
            </div>
        </div>
    </div>
}

export default ApiKeysView
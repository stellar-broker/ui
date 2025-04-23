import {useCallback} from 'react'
import {CopyToClipboard} from '../../utils/copy-to-clipboard'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'

export default function ApiKeyListView({keyList, updateKeyList}) {
    return <div>
        {keyList?.map((apiKey) => {
            return <div key={apiKey} className="card outline micro-space"  style={{maxWidth:'43em'}}>
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

    return <div>
        <div className="dual-layout flex-nowrap middle">
            <div>
                <code className="word-break">{apiKey}</code>
            </div>
            <div className="text-right" style={{width: '3em'}}>
                <CopyToClipboard text={apiKey}/>
                <span className="desktop-only">
                    &emsp;<a href="#" onClick={remove} className="icon icon-cross-circle dimmed" title="Delete API key"/>
                </span>
            </div>
        </div>
        <div className="mobile-only">
            <div className="micro-space"/>
            <Button outline block onClick={remove}><i className="icon-cross-circle"/>Delete this key</Button>
        </div>
    </div>
}
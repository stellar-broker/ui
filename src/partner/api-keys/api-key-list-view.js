import {useCallback} from 'react'
import {CopyToClipboard} from '../../utils/copy-to-clipboard'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'

export default function ApiKeyListView({keyList, updateKeyList}) {
    return <div>
        <div className="dimmed text-small space">
            Currently active API keys:
        </div>
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
            <div>
                <code className="word-break">{apiKey}</code> <CopyToClipboard text={apiKey}/>
            </div>
            <div className="text-right" style={{width: '2em'}}>
                <a href="#" onClick={remove} className="icon icon-delete-circle desktop-only" title="Delete API key"/>
            </div>
        </div>
        <div className="mobile-only">
            <div className="micro-space"/>
            <Button outline block onClick={remove}><i className="icon-delete-circle"/>Delete this key</Button>
        </div>
    </div>
}
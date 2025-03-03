import {useCallback} from 'react'
import cn from 'classnames'
import {CopyToClipboard} from '../utils/copy-to-clipboard'
import {shortenString} from '@stellar-expert/formatter'

function ApiKeysView({keyList, updateKeyList}) {

    return <div className="row">
        {keyList?.map((apiKey) => {
            return <div key={apiKey.key} className="column column-25 micro-space">
                <ApiKeyEntry apiKey={apiKey} updateKeyList={updateKeyList}/>
            </div>
        })}
    </div>
}

function ApiKeyEntry({apiKey, updateKeyList}) {
    const isActive = apiKey.status === 'Active'
    const active = apiKey.status === 'Active' ? 'success' : ''
    const statusTitle = isActive ? 'Disable' : 'Enable'

    const toggleApiKey = useCallback(() => {
        updateKeyList(prev => {
            return prev.map(k => {
                if (apiKey.key === k.key) {
                    k.status = !isActive ? 'Active' : 'Disabled'
                }
                return k
            })
        })
    }, [isActive, apiKey, updateKeyList])

    return <div className="card outline space">
        <div className="nano-space">
            <b>API key: </b><span>{shortenString(apiKey.key, 16)}</span> <CopyToClipboard text={apiKey.key}/>
        </div>
        <div>
            <b>Status: </b><span className={cn('badge', active)}>{apiKey.status}</span>&emsp;
            <a href="#" onClick={toggleApiKey} className="text-tiny">{statusTitle}</a>
        </div>
    </div>
}

export default ApiKeysView
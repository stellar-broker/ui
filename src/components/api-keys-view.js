import {useCallback} from 'react'
import cn from 'classnames'
import {CopyToClipboard} from '../utils/copy-to-clipboard'

function ApiKeysView({keyList, updateKeyList}) {

    return <div className="table space">
        <table>
            <thead className="text-tiny dimmed">
                <tr>
                    <th>API key</th>
                    <th>Accessibility</th>
                    <th className="collapsing text-right">Action</th>
                </tr>
            </thead>
            <tbody className="condensed">
                {keyList?.map((apiKey) => {
                    const active = apiKey.accessibility === 'Active' ? 'success' : ''
                    return <tr key={apiKey.key}>
                        <td data-header="API key: " className={cn({'dimmed': apiKey.accessibility !== 'Active'})}>
                            {apiKey.key}
                        </td>
                        <td data-header="Accessibility: ">
                            <span className={cn('badge', active)}>{apiKey.accessibility}</span>
                        </td>
                        <td>
                            <ApiKeyControlsView apiKey={apiKey} updateKeyList={updateKeyList}/>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

function ApiKeyControlsView({apiKey, updateKeyList}) {
    const isActive = apiKey.accessibility === 'Active'
    const accessibilityIcon = isActive ? 'icon-block' : 'icon-add-circle'
    const accessibilityTitle = isActive ? 'Disable' : 'Activate'

    const toggleApiKey = useCallback(() => {
        updateKeyList(prev => {
            return prev.map(k => {
                if (apiKey.key === k.key) {
                    k.accessibility = !isActive ? 'Active' : 'Disabled'
                }
                return k
            })
        })
    }, [isActive, apiKey, updateKeyList])

    return <div className="table-controls">
        <CopyToClipboard text={apiKey.key}/>
        <a href="#" className={accessibilityIcon} onClick={toggleApiKey} title={`${accessibilityTitle} API key`}/>
    </div>
}

export default ApiKeysView
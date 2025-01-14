import React from 'react'
import cn from 'classnames'
import {shortenString} from '@stellar-expert/formatter'
import {AccountIdenticon} from './identicon'
import {formatExplorerLink} from './explorer-link'
import './account-address.scss'

/**
 * Explorer link for Account/Contract
 * @param {String} address - StrKey-encoded address
 * @param {Number|'all'} [chars] - Visible address characters count
 * @param {Bool|String} [name] - Explicit account name that overrides the name from Directory; if false, friendly name is ignored
 * @param {Bool|String} [link] - Explicit link; if false, the component is rendered without a link
 * @param {Boolean} [icon] - Whether to show/hide account identicon
 * @param {{}} [style] - Optional CSS inline style
 * @param {String} [className] - Optional CSS class attribute
 * @param {...*} [otherProps] - Optional container parameters
 * @constructor
 */
export const AccountAddress = React.memo(function AccountAddress({
                                                                     address,
                                                                     chars = 8,
                                                                     name,
                                                                     link,
                                                                     style,
                                                                     className,
                                                                     icon,
                                                                     ...otherProps
                                                                 }) {
    if (!isPublicKeyOrContract(address))
        return null
    let innerStyle = !style ? undefined : style

    if (chars && chars !== 'all') {
        address = shortenString(address, chars)
    }

    const children = <>
        {icon !== false && <AccountIdenticon key="identicon" address={address}/>}
        <AccountDisplayName name={name}/>
        <span className="account-key">{address}</span>
    </>

    const containerProps = {
        title: address,
        'aria-label': address,
        className: cn('account-address', className),
        style: innerStyle,
        ...otherProps
    }
    let renderAs = 'span'

    if (link !== false) {
        renderAs = 'a'
        if (typeof link === 'string') {
            containerProps.href = link
        } else {
            containerProps.href = formatExplorerLink(address[0] === 'C' ? 'contract' : 'account', address)
            containerProps.target = '_blank'
        }
    }

    return React.createElement(renderAs, containerProps, children)
})

function isPublicKeyOrContract(account) {
    return account.length === 56 && (account[0] === 'G' || account[0] === 'C')
}

function AccountDisplayName({name}) {
    if (!name)
        return null
    return <>`[${name}] `</>

}
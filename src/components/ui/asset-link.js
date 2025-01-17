import React from 'react'
import cn from 'classnames'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {shortenString} from '@stellar-expert/formatter'
import {useAssetMeta} from '../../utils/hooks/asset-meta-hook'
import {formatExplorerLink} from './explorer-link'
import {AccountAddress} from './account-address'
import './asset-link.scss'

/**
 * Explorer asset link
 * @param {String|AssetDescriptor|Asset} asset - Asset name/descriptor
 * @param {Boolean|String} [link] - Reference link
 * @param {Boolean} [issuer] - Whether to show asset issuer
 * @param {Boolean} [icon] - Wheter to show asset icon
 * @param {String} [className] - Optional CSS class name
 * @param {{}} [style] - Optional CSS style
 * @param {*} [children] - Optional inner link text
 * @constructor
 */
export const AssetLink = React.memo(function AssetLink({asset, link, issuer, icon, className, style, children: innerText}) {
    if (!(asset instanceof AssetDescriptor)) {
        asset = AssetDescriptor.parse(asset)
    }
    const meta = useAssetMeta(asset)

    if (!asset)
        return null

    let children = innerText
    if (!innerText) {
        if (asset.poolId) {
            if (meta) {
                const [assetA, assetB] = meta.assets.map(a => AssetDescriptor.parse(a.asset))
                children = <span title={'Liquidity pool ' + asset.poolId} className="nowrap">
                    <span>
                        <AssetWarningStatus meta={assetA}/>
                        {icon !== false && <AssetIcon asset={assetA}/>}
                        {assetA.code}
                        {issuer === true && <AssetIssuer asset={assetA}/>}
                    </span>
                    <span style={{fontSize: '0.7em'}}>&nbsp;<i className="icon icon-plus dimmed"/>&nbsp;</span>
                    <span>
                        <AssetWarningStatus meta={assetB}/>
                        {icon !== false && <AssetIcon asset={assetB}/>}
                        {assetB.code}
                        {issuer === true && <AssetIssuer asset={assetB}/>}
                    </span>
                </span>
            } else {
                children = <>{shortenString(asset.poolId)}</>
            }
        } else {
            children = <>
                <AssetWarningStatus meta={meta}/>
                {icon !== false && <AssetIcon asset={asset}/>}
                {!!asset.code && asset.code}
                {!!asset.isContract && <AccountAddress address={asset.contract} chars={8} link={false} icon={false}/>}
                {issuer !== false && <AssetIssuer asset={asset}/>}
            </>
        }
    }

    const props = {
        'aria-label': asset.toString(),
        className: cn('asset-link', className),
        style,
        children
    }
    if (link === false)
        return <span {...props}/>
    if (typeof link === 'string') {
        props.href = link
    } else {
        props.href = asset.poolId ?
            formatExplorerLink('liquidity-pool', asset.poolId) :
            formatExplorerLink('asset', asset.toString())
        props.target = '_blank'
    }
    return <a {...props}/>
})

function AssetWarningStatus({meta}) {
    if (!meta?.unsafe)
        return null
    return <i className="icon icon-warning color-warning" title="Warning: asset reported as unsafe"/>
}

/**
 * Inline asset icon
 * @param {String|AssetDescriptor|Asset} asset - Asset name/descriptor
 * @param {String} [className] - Optional CSS class name
 * @param {{}} [style] - Optional CSS inline style
 * @param {*} [children] - Optional inner text
 * @constructor
 */
export const AssetIcon = React.memo(function AssetIcon({asset, className, style, children}) {
    const meta = useAssetMeta(asset)
    const icon = meta?.toml_info?.image || meta?.toml_info?.orgLogo
    const classes = ['asset-icon']
    if (!style) {
        style = {}
    }

    if (className) {
        classes.push(className)
    }

    if (asset.toString() === 'XLM') { // native asset
        classes.push('icon icon-stellar')
    } else if (icon) { // asset with an icon
        style.backgroundImage = `url('${icon}')`
    } else { // asset without metadata
        classes.push('icon icon-empty-circle')
    }

    return <span className={classes.join(' ')} style={style}>{children}</span>
})

/**
 * Inline asset issuer
 * @param {String|AssetDescriptor|Asset} asset - Asset name/descriptor
 * @constructor
 */
export const AssetIssuer = React.memo(function AssetIssuer({asset}) {
    let meta = useAssetMeta(asset)
    if (asset === 'XLM' || asset.isNative) {
        meta = {domain: 'stellar.org'}
    }
    asset = AssetDescriptor.parse(asset)
    return <span className="asset-issuer condensed">
        {meta?.domain ?
            <>{meta.domain}</> :
            <><AccountAddress address={asset.issuer} link={false} chars={8} icon={false}/></>}
    </span>
})
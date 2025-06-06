import React, {useCallback, useRef, useState, memo} from 'react'
import {useAssetList} from '../../utils/hooks/asset-list-hook'
import {Dropdown} from './dropdown'
import {AssetLink} from './asset-link'
import './asset-selector.scss'

/**
 * @param {function} onChange - On asset selected callback
 * @param {String} [value] - Selected asset
 * @param {String[]} [predefinedAssets] - Optional lists of predefined assets that should be shown at the top of the dropdown list
 * @param {Boolean} [restricted] - If set, the selector is limited to the predefined assets list only
 * @param {String} [expanded] - Expanded by default
 * @return {JSX.Element}
 * @constructor
 */
export const AssetSelector = memo(function AssetSelector({value, predefinedAssets, onChange, restricted, expanded}) {
    const [search, setSearch] = useState('')
    const searchRef = useRef()
    const options = []

    const focusSearch = useCallback(() => {
        setTimeout(() => searchRef.current?.focus(), 200)
    }, [])

    if (predefinedAssets) {
        for (const asset of predefinedAssets) {
            options.push({
                value: asset,
                title: <>{asset}</>,
                hidden: search && !asset.split('-')[0].toLowerCase().includes(search.toLowerCase())
            })
        }
    }

    let loadNextPage
    if (!restricted) {
        const {assets, loadPage, loading} = useAssetList({
            limit: 50,
            search: search?.trim() || undefined
        })
        for (let {asset} of assets) {
            if (!predefinedAssets || !predefinedAssets.includes(asset)) {
                options.push({value: asset, title: <AssetLink link={false} asset={asset}/>})
            }
        }
        if (!options.filter(opt => !opt.hidden).length) {
            if (loading) {
                options.push({value: '...', disabled: true, title: <div className="loader"/>})
            } else {
                options.push({
                    value: 'no',
                    disabled: true,
                    title: <div className="dimmed text-center text-small">(not found)</div>
                })
            }
        }
        loadNextPage = loadPage
    }
    const title = <AssetLink link={false} asset={value}/>
    return <Dropdown solo className="asset-selector" options={options} value={value} onOpen={focusSearch} title={title} expanded={expanded}
                     onChange={onChange} disabled={!onChange} onScroll={e => e.rel === 'bottom' && loadNextPage?.call(this)}
                     header={<>
                         <div className="micro-space"><h4>Select asset</h4></div>
                         <div className="relative">
                             <input type="text" value={search} ref={searchRef} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by asset code or website" className="styled-input"/>
                             <i className="icon-search dimmed"/>
                         </div>
                     </>}/>
})

/**
 * @callback AssetSelectorOnAssetChanged
 * @param {String} value
 */
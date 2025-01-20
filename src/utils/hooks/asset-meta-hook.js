import {useEffect, useState} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {stringifyQuery} from '../query'
import {fetchExplorerApi} from '../fetch-explorer-api'
import {ExplorerBatchInfoLoader} from '../explorer-batch-info-loader'

/**
 * @typedef AssetBasicTomlInfo
 * @property {String} name
 * @property {String} orgName
 * @property {String} image
 * @property {Number} decimals
 */

/**
 * @typedef AssetMeta
 * @property {String} name
 * @property {String} domain
 * @property {AssetBasicTomlInfo} toml_info
 */

const cache = new Map()

const loader = new ExplorerBatchInfoLoader(batch => {
    return fetchExplorerApi('asset/meta' + stringifyQuery({
        asset: batch,
        origin: window.location.origin
    }))
}, entry => {
    cache.set(entry.name, entry)
    return {
        key: entry.name,
        info: entry
    }
})

function normalizeAssetName(asset) {
    if (!asset)
        return null
    if (typeof asset === 'string' && asset.length === 56)
        return asset //contract id
    return AssetDescriptor.parse(asset).toFQAN()
}

/**
 *
 * @param {AssetDescriptor|String} asset
 * @return {AssetMeta}
 */
export function useAssetMeta(asset) {
    asset = normalizeAssetName(asset)
    const [assetInfo, setAssetInfo] = useState(cache.get(asset))
    useEffect(() => {
        if (!asset)
            return
        const cached = cache.get(asset)
        setAssetInfo(cached)
        if (cached)
            return
        let unloaded = false
        //load from the server
        loader.loadEntry(asset)
            .then(a => !unloaded && setAssetInfo(a))
        return () => {
            unloaded = true
        }
    }, [asset])

    return assetInfo
}

export function loadAssetMetaBatch(assets) {
    for (const asset of assets) {
        loader.loadEntry(asset)
    }
}
import {fetchExplorerApi} from '../fetch-explorer-api'
import {useEffect, useState} from 'react'

export function useAssetInfo(asset) {
    const [assetInfo, setAssetInfo] = useState()

    useEffect(() => {
        fetchExplorerApi('asset/' + asset)
            .then(res => setAssetInfo(res))
    }, [])

    if (!assetInfo)
        return null

    return {
        code: asset === 'XLM' ? 'XLM' : assetInfo.toml_info?.code,
        icon: asset === 'XLM' ? '/img/stellar-xlm-logo.svg' : assetInfo.toml_info?.image,
        domain: asset === 'XLM' ? 'Native' : assetInfo?.home_domain
    }
}
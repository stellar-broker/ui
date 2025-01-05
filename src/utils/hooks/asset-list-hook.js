import React, {useEffect, useState} from 'react'
import {throttle} from 'throttle-debounce'
import equal from 'react-fast-compare'

const defaults = {
    limit: 20,
    order: 'desc',
    sort: 'rating'
}

function getCurrentCursor(data) {
    if (!data || !data.length) return undefined
    return data[data.length - 1].paging_token
}

/**
 *
 * @param {Object} params
 * @return {{assets: Array<Object>, loadPage: Function, loading: Boolean}}
 */
export function useAssetList(params) {
    const [loading, setLoading] = useState(false),
        [assets, setAssets] = useState({data: [], params}),
        loadPage = throttle(1000, function () {
            if (loading) return
            const requestParams = {
                ...defaults, ...params
            }
            if (equal(params, assets.params)) {
                requestParams.cursor = getCurrentCursor(assets.data)
            }
            //TODO: get asset list from API
            const records = []
            setAssets(existing => {
                let data = records
                if (equal(params, existing.params)) {
                    data = [...existing.data, ...records]
                }
                return {data, params}
            })
        })
    useEffect(() => {
        loadPage()
    }, [params])

    return {assets: assets.data, loadPage, loading}
}
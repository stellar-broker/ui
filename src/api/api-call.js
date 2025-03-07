import {getJwt} from './auth'
import {parseQuery} from '../utils/query'
import delay from '../utils/delay'

/**
 *
 * @param {string} endpointWithQuery
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method]
 * @param {boolean} [auth]
 * @param {{}} [params]
 * @return {Promise<*|{error: string}>}
 */
export async function performApiCall(endpointWithQuery, {method = 'GET', auth = true, params} = {}) {
    const url = `${managementApiOrigin}/${endpointWithQuery}`
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (auth)
        headers['Authorization'] = 'Bearer ' + getJwt()
    try {
        const resp = await fetch(url, {
            headers,
            method,
            body: params ? JSON.stringify(params) : undefined
        })
        if (!resp.ok) {
            let errorExt
            try {
                errorExt = await resp.json()
            } catch (parsingError) {
                errorExt = {}
            }
            const err = new Error(errorExt?.error || resp.statusText || 'Failed to fetch data from the server')
            err.status = resp.status
            err.ext = errorExt
            throw err
        }
        return await resp.json()
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            e = {
                error: e.message,
                status: e.status || 500,
                ext: e.ext
            }
        }
        if (e.ext && e.ext.status) {
            e.status = e.ext.status
        }
        return e
    }
}

export async function fetchAllData(url) {
    let cursor = undefined, limit = 200
    let data = []
    while (true) {//fetch all
        let apiEndpoint = `${url}?order=asc&limit=${limit}`
        if (cursor) {
            apiEndpoint += `&cursor=${cursor}`
        }
        const result = await performApiCall(apiEndpoint)
        const records = result?._embedded.records || []
        if (!records.length)
            break
        const query = parseQuery(result?._links.next.href.split('?')[1])
        cursor = query.cursor
        data = [...data, ...records]
        await delay(200)
        //TODO: fix infinite loading
        break
    }
    return data
}
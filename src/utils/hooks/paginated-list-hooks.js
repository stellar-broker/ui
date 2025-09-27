import {useRef} from 'react'
import isEqual from 'react-fast-compare'
import {performApiCall} from '../../api/api-call'
import {parseQuery, stringifyQuery} from '../query'
import {navigation} from '../navigation'
import {useDependantState} from './dependant-state'

function inverseOrder(order) {
    return order === 'desc' ? 'asc' : 'desc'
}

class PaginatedListViewModel {
    /**
     * Create new instance of PaginatedListViewModel
     * @param {String} endpoint - API endpoint
     * @param {Object} [props] - Extra model params
     * @param {Number} [props.limit] - Rows limit
     * @param {Boolean} [props.autoReverseRecordsOrder] - Reverse order to match default grid order
     * @param {Boolean} [props.autoLoadLastPage] - Whether to load last page flag
     * @param {'asc'|'desc'} [props.defaultSortOrder] - Results sorting order
     * @param {Object} [props.defaultQueryParams] - Default query values - query params not set if default
     * @param {Function} [props.dataProcessingCallback] - Callback called for the fetched data
     * @param {Boolean|Function} [props.updateLocation] - Whether to update browser location
     */
    constructor(endpoint, props = {limit: 20}) {
        this.endpoint = endpoint
        this.data = []
        this.defaultQueryParams = {}
        this.limit = props.limit
        this.query = props.query
        this.dataProcessingCallback = props.dataProcessingCallback
        this.defaultSortOrder = props.defaultSortOrder
        this.updateLocation = props.updateLocation
        if (props.autoReverseRecordsOrder !== undefined) {
            this.autoReverseRecordsOrder = props.autoReverseRecordsOrder
        }
        if (props.autoLoadLastPage !== undefined) {
            this.autoLoadLastPage = props.autoLoadLastPage
        }
        //reconstruct state from query
        if (navigation.query.cursor) {
            const {cursor, sort, order} = navigation.query
            this.nextCursor = stringifyQuery({cursor, sort, order})
        }
        if (props.defaultQueryParams) {
            this.defaultQueryParams = props.defaultQueryParams
        }
    }

    /**
     * API endpoint
     * @type {String}
     */
    endpoint = ''

    /**
     * Batch size
     * @type {Number}
     */
    limit = 20

    /**
     *
     * @type {Function|Object}
     */
    query = null

    /**
     * Automatically reverse records order
     * @type {Boolean}
     */
    autoReverseRecordsOrder = false

    /**
     * Sorting order
     * @type {String}
     */
    defaultSortOrder = 'desc'

    /**
     * Load last meaningful page if now results returned from the server
     * @type {Boolean}
     */
    autoLoadLastPage = true

    /**
     * Function used to process data retrieved from the server
     * @type {Function}
     */
    dataProcessingCallback = null

    /**
     * @type {Function}
     */
    onError = null

    /**
     * Data received from server
     * @type {Object}
     */
    data

    /**
     * Response loaded flag
     * @type {Boolean}
     */
    loaded = false

    /**
     * Fetch-in-progress flag
     * @type {Boolean}
     */
    loading = false

    /**
     * Whether the next page is available
     * @type {Boolean}
     */
    canLoadNextPage = false

    /**
     * Whether the prev page is available
     * @type {Boolean}
     */
    canLoadPrevPage = false

    /**
     * Next page cursor
     * @type {String}
     */
    nextCursor

    /**
     * Previous page cursor
     * @type {String}
     */
    prevCursor

    /**
     * Current cursor
     * @type {String}
     * @private
     */
    cursor

    /**
     * @private
     * @type {Function}
     */
    updateApiResponseData = null

    /**
     * Load portion of data from the server
     * @param {1|0|-1} page
     * @return {Promise<ApiListResponse>}
     */
    load(page) {
        const paginationParams = {skip: undefined}
        const navCursor = page === 0 ?
            undefined :
            page < 0 ?
                this.prevCursor :
                this.nextCursor

        if (navCursor) {
            parseQuery(navCursor.split('?')[1] || '', paginationParams)
            this.cursor = navCursor
        } else {
            this.nextCursor = stringifyQuery({
                cursor: navigation.query.cursor,
                order: navigation.query.order
            })
            this.cursor = null
            paginationParams.cursor = null
        }
        //prepare query params
        const queryParams = Object.assign({}, this.defaultQueryParams, this.query, paginationParams, {limit: this.limit})
        return this.loadPage(queryParams)
    }

    /**
     * Reverse order and load the page
     * @param queryParams
     * @return {Promise<ApiListResponse>}
     * @private
     */
    async loadLastPage(queryParams) {
        const {order} = queryParams,
            overrides = {
                order: inverseOrder(order),
                cursor: undefined
            }

        return this.loadPage(Object.assign({}, queryParams, overrides))
    }

    /**
     * Load data page from the server
     * @param {{}} queryParams
     * @private
     */
    async loadPage(queryParams) {
        this.loaded = false
        this.loading = true
        this.updateQuery(queryParams)
        this.updateApiResponseData(this.toJSON())
        const [path] = this.endpoint.split('?')
        const endpointWithQuery = path + stringifyQuery(queryParams)
        const data = await performApiCall(endpointWithQuery)

        return this.processResponseData(endpointWithQuery, data, queryParams)
    }

    /**
     * Retrieve and convert data from the API response
     * @param {String} endpointWithQuery
     * @param {{}} data
     * @param {{}} queryParams
     * @private
     */
    processResponseData(endpointWithQuery, data, queryParams) {
        if (data.error) {
            console.error(data.error)
            this.loaded = true
            this.loading = false
            this.error = data
        } else {
            const {_links, _embedded} = data
            let records = _embedded.records.slice()
            //we reached the end of the query
            if (!records.length && this.autoLoadLastPage && this.data && this.data.length) {
                //load first/last meaningful page
                setTimeout(() => this.loadLastPage(queryParams), 500)
                return
            }
            if (this.autoReverseRecordsOrder && _links.self.href.includes('order=' + inverseOrder(this.defaultSortOrder))) {
                records.reverse()
            }
            if (this.dataProcessingCallback) {
                records = this.dataProcessingCallback(records)
            }
            this.data = records
            this.loaded = true
            this.loading = false
            this.updateNav(_links)
        }
        //update response data
        const res = this.toJSON()
        this.updateApiResponseData(res)
        return res
    }

    /**
     * Update navigation links retrieved from the response
     * @param {String} self
     * @param {String} next
     * @param {String} prev
     * @private
     */
    updateNav({self, next, prev}) {
        this.canLoadNextPage = true //this.nextCursor && this.nextCursor !== self.href && records.length >= this.limit
        this.canLoadPrevPage = true //this.prevCursor && this.prevCursor !== self.href
        const selfQuery = parseQuery(self.href.split('?')[1])
        if ((selfQuery.order === inverseOrder(this.defaultSortOrder))) {
            this.prevCursor = next ? next.href : null
            this.nextCursor = prev ? prev.href : null
            if (!selfQuery.cursor) {
                this.canLoadNextPage = false
            }
            if (this.data.length < this.limit) {
                this.canLoadPrevPage = false
            }
        } else {
            this.nextCursor = next ? next.href : null
            this.prevCursor = prev ? prev.href : null
            if (!selfQuery.cursor) {
                this.canLoadPrevPage = false
            }
            if (this.data.length < this.limit) {
                this.canLoadNextPage = false
            }
        }

        if (selfQuery.cursor === '0') {
            this.canLoadPrevPage = false
        }
    }

    /**
     * Update location query string
     * @param {{}} queryParams
     * @private
     */
    updateQuery(queryParams) {
        const {updateLocation} = this
        if (!updateLocation)
            return
        let paramsToSet = {}
        for (let key in queryParams)
            if (queryParams.hasOwnProperty(key)) {
                if (key === 'limit') continue
                let value = queryParams[key]
                //ignore default params
                if (this.defaultQueryParams[key] === value) {
                    value = undefined
                }
                paramsToSet[key] = value
            }
        if (typeof updateLocation === 'function') {
            paramsToSet = updateLocation(paramsToSet)
        }
        navigation.updateQuery(paramsToSet)
    }

    /**
     * Convert model to a plain object representation
     * @return {{loaded: Boolean, data: ({}[]), load: function, reset: function loading: Boolean, canLoadNextPage: Boolean, canLoadPrevPage: Boolean}}
     */
    toJSON() {
        return {
            data: this.data || [],
            loaded: this.loaded,
            loading: this.loading,
            canLoadPrevPage: this.canLoadPrevPage,
            canLoadNextPage: this.canLoadNextPage,
            load: this.load.bind(this),
            reset: this.reset.bind(this)
        }
    }

    /**
     * Reset model to the initial state
     */
    reset() {
        this.data = []
        this.loaded = false
        this.loading = false
        this.canLoadNextPage = false
        this.canLoadPrevPage = false
        this.nextCursor = undefined
        this.prevCursor = undefined
        this.cursor = undefined
        this.currentQueryParams = undefined
        this.updateQuery({cursor: undefined, sort: undefined, order: undefined})
    }
}


/**
 * @typedef {Object} ApiListResponse
 * @property {Object[]} data - Data retrieved from the server
 * @property {Boolean} loaded - Response result loaded flag
 * @property {Function} load - Load page function
 * @property {Boolean} canLoadPrevPage - Whether the prev page is available
 * @property {Boolean} canLoadNextPage - Whether the next page is available
 */

/**
 *
 * @param {String|APIEndpointParams} apiEndpoint - Server API endpoint to use as a data source.
 * @param {Number} [limit] - Rows per batch limit.
 * @param {Boolean} [autoReverseRecordsOrder] - Reverse order to match default grid order.
 * @param {'asc'|'desc'} [defaultSortOrder] - Reverse order to match default grid order.
 * @param {Boolean} [autoLoadLastPage] - Load last meaningful page if now results returned from the server.
 * @param {Function} [dataProcessingCallback] - Callback called for the fetched data.
 * @param {Object} [defaultQueryParams] - Default query values - query params not set if default.
 * @param {Boolean} [autoLoad] - Default query values - query params not set if default.
 * @param {Boolean} [updateLocation] - Automatically update browser query string on navigation.
 * @param {Array} [dependencies] - Additional dependencies to track for state updates.
 * @return {ApiListResponse}
 */
export function usePaginatedApi(apiEndpoint,
                                {
                                    limit = 20,
                                    autoReverseRecordsOrder = false,
                                    defaultSortOrder = 'desc',
                                    autoLoadLastPage = true,
                                    defaultQueryParams = {},
                                    dataProcessingCallback,
                                    autoLoad = true,
                                    updateLocation = true
                                } = {},
                                dependencies = []) {
    if (!apiEndpoint)
        throw new Error(`Invalid API endpoint: ${apiEndpoint}`)
    const pinRef = useRef(null)
    if (typeof apiEndpoint === 'string') {
        const [path, query] = apiEndpoint.split('?')
        apiEndpoint = {
            path,
            query: parseQuery(query)
        }
    }
    if (defaultQueryParams.order) {
        defaultSortOrder = defaultQueryParams.order
    }

    const [apiResponseData, updateApiResponseData] = useDependantState(() => {
        const res = new PaginatedListViewModel(apiEndpoint.path, {
            limit,
            query: apiEndpoint.query,
            dataProcessingCallback,
            autoLoadLastPage,
            autoReverseRecordsOrder,
            defaultSortOrder,
            defaultQueryParams,
            updateLocation
        })
        pinRef.current = res
        if (autoLoad) {
            setTimeout(() => {
                res.load(0)
            }, 100)
        }
        return res.toJSON()
    }, [JSON.stringify(apiEndpoint), limit, autoReverseRecordsOrder, autoLoadLastPage, autoLoad, ...dependencies])

    pinRef.current.updateApiResponseData = function (newData) {
        updateApiResponseData(prevListData => isEqual(prevListData, newData) ? prevListData : newData)
    }

    return apiResponseData
}
import {createBrowserHistory} from 'history'
import {parseQuery, stringifyQuery} from './query'

const history = createBrowserHistory()
const observers = []
let queryString = parseQuery()

function notifyChanged(nav) {
    for (let handler of observers) {
        handler(nav)
    }
}

function setQueryParams(paramsToSet, replace = false) {
    const prevState = JSON.stringify(queryString),
        newQuery = Object.assign({}, replace ? null : queryString, paramsToSet)
    if (JSON.stringify(newQuery) !== prevState) {
        Object.freeze(newQuery)
        queryString = newQuery
        return true
    }
    return false
}

class NavigationWrapper {
    get history() {
        return history
    }

    get query() {
        return queryString
    }

    get path() {
        return history.location.pathname
    }

    get hash() {
        return history.location.hash
    }

    set hash(value) {
        if (value[0] !== '#') value = '#' + value
        window.location.hash = value
        history.location.hash = value
    }

    preventNavigationInsideIframe = false

    /**
     * Update query string.
     * @param {Object} paramsToSet - Object containing query params to set.
     * @param {Boolean} replace - Replace previous query state entirely.
     */
    updateQuery(paramsToSet, replace = false) {
        if (setQueryParams(paramsToSet)) {
            const newUrl = this.path + stringifyQuery(queryString)
            history.replace(newUrl)
            notifyChanged(this)
        }
    }

    navigate(url) {
        //if (history.location.pathname + history.location.search === url.replace(/#.*$/, '')) return
        setQueryParams(parseQuery(url.split('?')[1] || ''), true)
        history.push(url)
        notifyChanged(this)
    }

    /**
     * @param {LocationChangeListener} handler
     * @retur {*}
     */
    listen(handler) {
        observers.push(handler)
        return this.stopListening.bind(this, handler)
    }

    stopListening(handler) {
        observers.splice(observers.indexOf(handler))
    }
}

export const navigation = new NavigationWrapper()

/**
 * @callback LocationChangeListener
 * @param {number}
 */
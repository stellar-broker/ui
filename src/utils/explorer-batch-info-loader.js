import {throttle} from 'throttle-debounce'

export class ExplorerBatchInfoLoader {
    constructor(fetchCallback, processResponseCallback) {
        this.pendingRequests = {}
        this.requestsQueue = []
        this.fetchDataFromServer = throttle(500, this.fetchDataFromServer, {noLeading: true})
        this.fetchCallback = fetchCallback
        this.processResponseCallback = processResponseCallback
    }

    pendingRequests

    requestsQueue = []

    fetchCallback

    processResponseCallback

    loadEntry(key) {
        //check whether the same address is being fetched right now
        const pending = this.pendingRequests[key]
        if (pending) return pending
        const promise = new Promise(resolve => {
            this.requestsQueue.push({
                key,
                finished: data => {
                    delete this.pendingRequests[key]
                    resolve(data)
                }
            })
            this.fetchDataFromServer()
        })
        this.pendingRequests[key] = promise
        return promise
    }

    fetchDataFromServer() {
        if (!this.requestsQueue.length) return
        const batch = this.requestsQueue.splice(0, 50)
        if (!batch.length) return
        return this.fetchCallback(batch.map(e => e.key))
            .then(data => {
                if (data.error)
                    return //TODO: handle errors in a more elegant way, with retries
                //reschedule another batch fetch if the queue is not empty
                if (this.requestsQueue.length) {
                    setTimeout(() => this.fetchDataFromServer(), 400)
                }
                //remap batch array to an object for the faster elements access
                const batchMap = {}
                for (const {key, finished} of batch) {
                    batchMap[key] = finished
                }
                for (const entry of data._embedded.records) {
                    const {key} = this.processResponseCallback(entry)
                    const finalizeRequest = batchMap[key]
                    if (finalizeRequest) {
                        finalizeRequest(entry)
                    }
                    //cleanup promise reference
                    delete batchMap[key]
                    delete this.pendingRequests[key]
                }
                //return null for all keys that have not been found
                for (const key of Object.keys(batchMap)) {
                    const finalizeRequest = batchMap[key]
                    if (finalizeRequest) {
                        finalizeRequest(null)
                    }
                    //cleanup promise reference
                    delete this.pendingRequests[key]
                }
            })
            .catch(err => {
                console.error(err)
                //finalize all pending promises with nulls
                for (const {key, finished} of batch) {
                    finished(null)
                    //cleanup promise reference
                    delete this.pendingRequests[key]
                }
            })
    }
}

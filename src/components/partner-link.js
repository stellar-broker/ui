import React, {useEffect, memo, useState} from 'react'
import {shortenString} from '@stellar-expert/formatter'
import {performApiCall} from '../api/api-call'

let prPromise

function resolvePartner(id) {
    if (!prPromise) {
        prPromise = performApiCall('partner')
            .then((result) => {
                if (result.error) {
                    notify({type: 'error', message: 'Failed to retrieve partners data. ' + result.error})
                    throw new Error(result.error)
                }
                const list = result._embedded.records.filter(user => !user.roles?.includes('admin'))
                const res = {}
                for (const entry of list) {
                    res[entry.id] = entry
                }
                return res
            })
    }
    return prPromise.then(partners => partners[id])
}

export default memo(function PartnerLink({id, apikey}) {
    const [partner, setPartner] = useState()
    useEffect(() => {
        resolvePartner(id)
            .then(p => setPartner(p))
    }, [id])
    if (!partner)
        return null
    return <span title={apikey ? 'API key: ' + shortenString(apikey, 12) : undefined}>
        {partner.email}
    </span>
})
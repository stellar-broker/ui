import {useEffect, useState} from 'react'
import {performApiCall} from '../../api/api-call'

/**
 * @param {string} [id] - ID of the user, skip to fetch self settings
 * @return {[{email: string, project: string, image: string}, function]}
 */
export function usePartnerSettings(id) {
    const [settings, setSettings] = useState({})
    useEffect(() => {
        performApiCall('partner/' + (id || 'info'))
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners settings. ' + result.error})
                setSettings(result)
            })
            .catch(e => {
                console.error(e)
                notify({type: 'error', message: 'Failed to retrieve partners settings.'})
            })
    }, [id])

    return [settings, setSettings]
}
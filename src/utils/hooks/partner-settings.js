import {useEffect, useState} from 'react'
import {performApiCall} from '../../api/api-call'

export function usePartnerSettings(id) {
    const [settings, setSettings] = useState({})
    useEffect(() => {
        if (!id)
            return null
        performApiCall('partner/' + id)
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners data. ' + result.error})
                setSettings({
                    email: result.email,
                    ...result.settings
                })
            })
    }, [id])

    return [settings, setSettings]
}
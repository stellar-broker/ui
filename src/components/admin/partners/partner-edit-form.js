import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {generatePassword} from '../../../utils/password-generator'
import {performApiCall} from '../../../api/api-call'
import {Button} from '../../ui/button'
import PartnerPasswordRecoveryView from './partner-password-recovery-view'

const feeLimit = {
    partnerVarFee: 500,
    partnerFixedFee: 50,
    brokerVarFee: 500,
    brokerFixedFee: 50
}

function PartnerEditForm({id}) {
    const navigate = useNavigate()
    const [settings, setSettings] = useState()

    useEffect(() => {
        if (!id)
            return null
        performApiCall('partner/' + id)
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners data. ' + result.error})
                setSettings({
                    email: result.email,
                    partnerVarFee: (result.settings.partnerVarFee || 0),
                    brokerVarFee: (result.settings.brokerVarFee || 0)
                })
            })
    }, [id])

    const changeValue = useCallback((key, value) => {
        const val = value.replace(/[^\d.]/g, '')
        const fee = val > feeLimit[key] ? feeLimit[key] : val
        setSettings(prev => ({...prev, [key]: fee}))
    }, [])

    const changeEmail = useCallback(e => {
        const email = e.target.value.trim()
        setSettings(prev => ({...prev, email}))
    }, [])

    const changePartnerVarFee = useCallback(e => changeValue('partnerVarFee', e.target.value), [])

    const changePartnerFixedFee = useCallback(e => changeValue('partnerFixedFee', e.target.value), [])

    const changeBrokerVarFee = useCallback(e => changeValue('brokerVarFee', e.target.value), [])

    const changeBrokerFixedFee = useCallback(e => changeValue('brokerFixedFee', e.target.value), [])

    const addPartner = useCallback(async (email) => {
        const params = {
            email,
            password: generatePassword()
        }
        await performApiCall('partner', {method: 'POST', params})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to add partner. ' + result.error})

                console.log(params)
                notify({type: 'success', message: 'New partner has been added'})
                navigate('/admin/partners')
            })
    }, [])

    const updatePartner = useCallback(async (newSettings) => {
        const params = {
            ...newSettings,
            partnerVarFee: parseInt(newSettings.partnerVarFee, 10),
            brokerVarFee: parseInt(newSettings.brokerVarFee, 10)
        }
        await performApiCall(`partner/${id}/settings`, {method: 'PUT', params})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to change partner settings. ' + result.error})

                notify({type: 'success', message: 'Partner settings successfully changed'})
                navigate('/admin/partners')
            })
    }, [])

    const onSave = useCallback(() => {
        if (id) {
            updatePartner(settings)
        } else {
            addPartner(settings.email)
        }
    }, [settings])

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13) {
            onSave()
        }
    }, [onSave])

    return <div>
        <div className="row">
            <div className="column column-50">
                <div className="space">
                    <p className="label text-small">Partner email</p>
                    <input value={settings?.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} className="styled-input"/>
                </div>
            </div>
        </div>
        <div className="row space text-small dimmed">
            <div className="column column-50">
                <p className="label">Partner profit fee (‰)</p>
                <input value={settings?.partnerVarFee || ''} onChange={changePartnerVarFee} onKeyDown={onKeyDown} className="styled-input"
                       placeholder={`0-${feeLimit['partnerVarFee']}‰`}/>
                <div className="nano-space"/>
                <div className="text-tiny">
                    Variable fee charged from the funds saved during the swap
                </div>
            </div>
            <div className="column column-50">
                <p className="label">Broker profit fee (‰)</p>
                <input value={settings?.brokerVarFee || ''} onChange={changeBrokerVarFee} onKeyDown={onKeyDown} className="styled-input"
                       placeholder={`0-${feeLimit['brokerVarFee']}‰`}/>
                <div className="nano-space"/>
                <div className="text-tiny">
                    Variable service fee charged from the funds saved during the swap
                </div>
            </div>
            <div className="column column-50">
                <p className="label">Partner fixed fee (‰)</p>
                <input value={settings?.partnerFixedFee || ''} onChange={changePartnerFixedFee} onKeyDown={onKeyDown} className="styled-input"
                       placeholder={`0-${feeLimit['partnerFixedFee']}‰`}/>
                <div className="nano-space"/>
                <div className="text-tiny">
                    Fixed partner swap fee charged from the transaction amount
                </div>
            </div>
            <div className="column column-50">
                <p className="label">Broker fixed fee (‰)</p>
                <input value={settings?.brokerFixedFee || ''} onChange={changeBrokerFixedFee} onKeyDown={onKeyDown} className="styled-input"
                       placeholder={`0-${feeLimit['brokerFixedFee']}‰`}/>
                <div className="nano-space"/>
                <div className="text-tiny">
                    Fixed service swap fee charged from the transaction
                </div>
            </div>
        </div>
        <div className="row space">
            <div className="column column-33 column-offset-33">
                <Button block onClick={onSave}>Save</Button>
            </div>
            <div className="column column-33">
                <Button block outline href="/admin/partners">Cancel</Button>
            </div>
        </div>
        <PartnerPasswordRecoveryView id={id}/>
    </div>
}

export default PartnerEditForm
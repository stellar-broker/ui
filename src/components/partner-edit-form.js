import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {CopyToClipboard} from '../utils/copy-to-clipboard'
import {performApiCall} from '../api/api-call'
import {generatePassword} from '../utils/password-generator'
import {Button} from './ui/button'

function validation({email}) {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    return emailRegex.test(email)
}

function PartnerEditForm({id}) {
    const navigate = useNavigate()
    const [isValid, setValid] = useState(false)
    const [settings, setSettings] = useState()
    const recoveryPasswordLink = window.location.origin + '/password-recovery/' + id

    useEffect(() => {
        if (!id)
            return null
        performApiCall('partner/' + id, {auth: true})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners data. ' + result.error})
                setSettings({
                    email: result.email,
                    partnerVarFee: (result.settings.partnerVarFee || 0) / 100,
                    brokerVarFee: (result.settings.brokerVarFee || 0) / 100
                })
            })
    }, [id])

    const changeValue = useCallback((key, value) => {
        setSettings(prev => {
            const newSettings = {...prev, [key]: value}
            setValid(validation(newSettings))
            return newSettings
        })
    }, [validation])

    const changeEmail = useCallback(e => changeValue('email', e.target.value.trim()), [])

    const changePartnerVarFee = useCallback(e => {
        const val = e.target.value.replace(/[^\d.]/g, '')
        changeValue('partnerVarFee', val > 50 ? 50 : val)
    }, [])

    const changeBrokerVarFee = useCallback(e => {
        const val = e.target.value.replace(/[^\d.]/g, '')
        changeValue('brokerVarFee', val > 2 ? 2 : val)
    }, [])

    const sendPassRecoveryLink = useCallback(() => {
        notify({type: "success", message: "Password recovery form has been sent"})
    }, [])

    const addPartner = useCallback(async (email) => {
        const params = {
            email,
            password: generatePassword()
        }
        await performApiCall('partner', {method: 'POST', auth: true, params})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to add partner. ' + result.error})

                console.log(params)
                notify({type: 'success', message: 'New partner has been added'})
            })
    }, [])

    const updatePartner = useCallback(async (newSettings) => {
        const params = {
            ...newSettings,
            partnerVarFee: parseInt(newSettings.partnerVarFee * 100, 10),
            brokerVarFee: parseInt(newSettings.brokerVarFee * 100, 10)
        }
        await performApiCall(`partner/${id}/settings`, {method: 'PUT', auth: true, params})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to change partner settings. ' + result.error})

                notify({type: 'success', message: 'Partner settings successfully changed'})
            })
    }, [])

    const onSave = useCallback(async () => {
        id ? await updatePartner(settings) : await addPartner(settings.email)
        navigate('/admin/partners')
    }, [settings])

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            onSave()
        }
    }, [isValid])

    return <div>
        {id && <>
            <p className="label nano-space">Partner password recovery</p>
            <div className="row micro-space">
                <div className="column column-33">
                    <Button block className="text-small" onClick={sendPassRecoveryLink}>Send Link</Button>
                </div>
                <div className="column column-33">
                    <CopyToClipboard text={recoveryPasswordLink}>
                        <Button block outline className="text-small">Copy Link</Button>
                    </CopyToClipboard>
                </div>
            </div>
            <div className="hr space"/>
        </>}
        <div className="row">
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Partner email</p>
                    <input value={settings?.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} className="styled-input"/>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Partner fee (%)</p>
                    <input value={settings?.partnerVarFee || ''} onChange={changePartnerVarFee} onKeyDown={onKeyDown} className="styled-input"
                           placeholder="Available range [0-50]%"/>
                </div>
            </div>
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Broker fee (%)</p>
                    <input value={settings?.brokerVarFee || ''} onChange={changeBrokerVarFee} onKeyDown={onKeyDown} className="styled-input"
                           placeholder="Available range [0-2]%"/>
                </div>
            </div>
        </div>
        <div className="hr space"/>
        <div className="row">
            <div className="column column-33 column-offset-66">
                <Button block disabled={!isValid} onClick={onSave}>Save</Button>
            </div>
        </div>
    </div>
}

export default PartnerEditForm
import {useCallback, useEffect, useState} from 'react'
import {navigation} from '../../utils/navigation'
import {generatePassword} from '../../utils/password-generator'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'

export default function PartnerEditForm({id}) {
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

    const changeEmail = useCallback(e => {
        const email = e.target.value.trim()
        setSettings(prev => ({...prev, email}))
    }, [])

    const onSettingsChange = useCallback(e => {
        const {field} = e.target.dataset
        const val = e.target.value.trim().replace(/[^\d.]/g, '')
        const fee = val > feeLimit[field] ?
            feeLimit[field] :
            val
        setSettings(prev => ({...prev, [field]: fee}))
    }, [])

    const onSave = useCallback(() => {
        if (id) {
            updatePartner(id, settings)
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
                    <input value={settings.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} ref={useAutoFocusRef} className="styled-input"/>
                </div>
            </div>
        </div>
        <div className="row space text-small dimmed">
            <PartnerSetting settings={settings} field="partnerVarFee" title="Partner profit fee" onChange={onSettingsChange} onKeyDown={onKeyDown}>
                Variable fee charged from the funds saved during the swap
            </PartnerSetting>
            <PartnerSetting settings={settings} field="brokerVarFee" title="Broker profit fee" onChange={onSettingsChange} onKeyDown={onKeyDown}>
                Variable service fee charged from the funds saved during the swap
            </PartnerSetting>
            <PartnerSetting settings={settings} field="partnerFixedFee" title="Partner fixed fee" onChange={onSettingsChange} onKeyDown={onKeyDown}>
                Fixed partner swap fee charged from the transaction amount
            </PartnerSetting>
            <PartnerSetting settings={settings} field="brokerFixedFee" title="Broker fixed fee" onChange={onSettingsChange} onKeyDown={onKeyDown}>
                Fixed service swap fee charged from the transaction
            </PartnerSetting>
        </div>
        <div className="row row-right space">
            <div className="column column-33">
                <Button block onClick={onSave}>Save</Button>
            </div>
            {id && <div className="column column-33">
                <Button block href={`/admin/partners/edit/${id}/password`}>Change password</Button>
            </div>}
            <div className="column column-33">
                <Button block outline href="/admin/partners">Cancel</Button>
            </div>
        </div>
        {/*<PartnerPasswordRecoveryView id={id}/>*/}
    </div>
}

function PartnerSetting({settings, field, title, children, onChange, onKeyDown}) {
    return <div className="column column-50">
        <p className="label">{title} (‰)</p>
        <input value={settings[field] || ''} className="styled-input" placeholder={`0-${feeLimit[field]}‰`}
               onChange={onChange} onKeyDown={onKeyDown} data-field={field}/>
        <div className="nano-space"/>
        <div className="text-tiny">{children}</div>
    </div>
}

async function addPartner(email) {
    const params = {
        email,
        password: generatePassword()
    }
    await performApiCall('partner', {method: 'POST', params})
        .then((result) => {
            if (result.error)
                return notify({type: 'error', message: 'Failed to add partner. ' + result.error})

            notify({type: 'success', message: 'New partner has been added'})
            navigation.navigate('/admin/partners')
        })
}

async function updatePartner(id, newSettings) {
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
            navigation.navigate('/admin/partners')
        })
}

const feeLimit = {
    partnerVarFee: 500,
    partnerFixedFee: 50,
    brokerVarFee: 500,
    brokerFixedFee: 50
}
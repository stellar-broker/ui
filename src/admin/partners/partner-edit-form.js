import {useCallback, useRef} from 'react'
import {navigation} from '../../utils/navigation'
import {generatePassword} from '../../utils/password-generator'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {usePartnerSettings} from '../../utils/hooks/partner-settings'

export default function PartnerEditForm({id}) {
    const [settings, setSettings] = usePartnerSettings(id)

    const changeEmail = useCallback(e => {
        const email = e.target.value.trim()
        setSettings(prev => ({...prev, email}))
    }, [])

    const changeName = useCallback(e => {
        const name = e.target.value.trim()
        setSettings(prev => ({...prev, name}))
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
                <PartnerImage settings={settings} onChange={setSettings}/>
            </div>
        </div>
        <div className="row">
            <div className="column column-50">
                <div className="space">
                    <p className="label text-small">Partner email</p>
                    <input value={settings.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} ref={useAutoFocusRef} className="styled-input"/>
                </div>
            </div>
            <div className="column column-50">
                <div className="space">
                    <p className="label text-small">Project name</p>
                    <input value={settings.name || ''} onChange={changeName} onKeyDown={onKeyDown} className="styled-input"/>
                </div>
            </div>
        </div>
        <div className="row micro-space text-small dimmed">
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
            {id && <div className="column column-50">
                <Button stackable secondary href={`/admin/partner/${id}/password`}>Change password</Button>
            </div>}
            <div className="column column-50 text-right">
                <Button stackable onClick={onSave}>Save</Button>
                <Button stackable outline href="/admin/partner">Cancel</Button>
            </div>
        </div>
        {/*<PartnerPasswordRecoveryView id={id}/>*/}
    </div>
}

function PartnerSetting({settings, field, title, children, onChange, onKeyDown}) {
    return <div className="column column-50">
        <div className="space">
            <p className="label">{title} (‰)</p>
            <input value={settings[field] || ''} className="styled-input" placeholder={`0-${feeLimit[field]}‰`}
                   onChange={onChange} onKeyDown={onKeyDown} data-field={field}/>
            <div className="nano-space"/>
            <div className="text-tiny dimmed-light">{children}</div>
        </div>
    </div>
}

function PartnerImage({settings, onChange}) {
    const inputRef = useRef()
    const selectFile = useCallback(e => {
        const [file] = e.target.files
        if (file) {
            const img = new Image()
            img.src = URL.createObjectURL(file)

            img.decode()
                .then(() => {
                    onChange(prev => ({...prev, image: img.src}))
                })
                .catch(() => {
                    notify({type: 'error', message: 'Failed to load image'})
                })
        }
    }, [])

    return <div className="dual-layout middle space">
        <div>
            <p className="label">Account image</p>
            <label className="upload-input-wrap">
                <span className="button button-secondary small" style={{margin: 0}}>{settings.image ? 'Update' : 'Upload'}</span>
                <input type="file" ref={inputRef} placeholder="Choose image" onChange={selectFile}/>
            </label>
        </div>
        <div className="account-image-wrap">
            {settings.image && <img src={settings.image} alt="Account image"/>}
        </div>
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
            navigation.navigate('/admin/partner')
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
            navigation.navigate('/admin/partner')
        })
}

const feeLimit = {
    partnerVarFee: 500,
    partnerFixedFee: 50,
    brokerVarFee: 500,
    brokerFixedFee: 50
}
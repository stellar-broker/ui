import {useCallback, useEffect, useState} from 'react'
import {Button} from './ui/button'
import {useNavigate} from 'react-router-dom'
import {CopyToClipboard} from '../utils/copy-to-clipboard'

const partnerTest = {
    "id": "5983b324cd3ceaa40a1ba10a",
    "email": "test-partner@test.com",
    "created": "2024-06-28T12:57:08.744Z",
    "settings": {
        "partnerVarFee": 200,
        "striderVarFee": 100
    },
    "keys": [
        "471F...dp78"
    ]
}

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
        setSettings({
            email: partnerTest.email,
            fixedFee: partnerTest.settings.partnerVarFee / 100,
            dynamicFee: partnerTest.settings.striderVarFee / 100
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
    const changeDynamicFee = useCallback(e => changeValue('dynamicFee', e.target.value.replace(/[^\d.]/g, '')), [])
    const changeFixedFee = useCallback(e => changeValue('fixedFee', e.target.value.replace(/[^\d.]/g, '')), [])

    const sendPassRecoveryLink = useCallback(() => {
        notify({type: "success", message: "Password recovery form has been sent"})
    }, [])

    const onSave = useCallback(() => {
        navigate('/admin/partners')
    }, [])

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
                    <input value={settings?.email || ''} onChange={changeEmail} className="styled-input"/>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Dynamic fee (%)</p>
                    <input value={settings?.dynamicFee || ''} onChange={changeDynamicFee} className="styled-input"
                           placeholder="Available range [0-50]%"/>
                </div>
            </div>
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Fixed fee (%)</p>
                    <input value={settings?.fixedFee || ''} onChange={changeFixedFee} className="styled-input"
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

import {useCallback, useEffect, useState} from 'react'
import {Button} from './ui/button'

function SettingsForm() {
    const [settings, setSettings] = useState({
        email: 'test@gmail.com',
        password: null
    })

    const validateEmail = useCallback(email => {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        return emailRegex.test(email)
    }, [])
    const validatePassword = useCallback(password => password?.length >= 8, [])

    const updateEmail = useCallback(email => {
        setSettings(prev => ({...prev, email}))
    }, [])
    const updatePassword = useCallback(password => {
        setSettings(prev => ({...prev, password: ''}))
    }, [])

    return <>
        <ValueSettingView title="Your email" valueDefault={settings.email} onUpdate={updateEmail} validation={validateEmail}/>
        <ValueSettingView title="Your password" valueDefault={settings.password || ''} onUpdate={updatePassword} validation={validatePassword} confirm/>
    </>
}

function ValueSettingView({title, valueDefault = '', onUpdate, validation, confirm}) {
    const [value, setValue] = useState(valueDefault)
    const [confirmValue, setConfirmValue] = useState('')
    const [isChanged, setIsChanged] = useState(false)
    const [isValid, setValid] = useState(false)

    useEffect(() => {
        setValue(valueDefault)
    }, [valueDefault])

    const changeValue = useCallback(e => {
        const val = e.target.value.trim()
        const validValue = confirm ? confirmValue === val && validation(val) : validation(val)
        setValue(val)
        setValid(validValue)
        setIsChanged(val !== valueDefault)
    }, [confirmValue, valueDefault, validation])

    const changeConfirm = useCallback(e => {
        const val = e.target.value.trim()
        setConfirmValue(val)
        setValid(value === val && validation(val))
    }, [value, valueDefault, validation])

    const onSave = useCallback(() => {
        onUpdate(value)
        setIsChanged(false)
        if (confirm) {
            setValue('')
            setConfirmValue('')
        }
        notify({type: "success", message: "Changes saved"})
    }, [value, onUpdate])

    return <div className="row">
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">{title}</p>
                <input value={value} onChange={changeValue} className="styled-input"/>
            </div>
        </div>
        {confirm && isChanged && <div className="column column-33">
            <div className="space">
                <p className="label text-small">Confirm</p>
                <input value={confirmValue} onChange={changeConfirm} className="styled-input"/>
            </div>
        </div>}
        <div className="column column-33">
            <div className="label-space"/>
            {isChanged && <Button disabled={!isValid} onClick={onSave}>Save</Button>}
        </div>
    </div>
}

export default SettingsForm
import React, {useCallback, useState} from 'react'
import {performApiCall} from '../api/api-call'
import {getAuth} from '../api/auth'
import {Button} from './ui/button'

function SettingsForm() {

    return <>
        <EmailEditForm/>
        <div className="hr space"/>
        <PasswordEditForm/>
    </>
}

function validationPassword({password, newPassword, confirm}) {
    if (!password || !confirm || newPassword === password)
        return false
    return newPassword === confirm && newPassword.length >= 8
}

function PasswordEditForm() {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const credentials = {...prev, [key]: val.trim()}
            setIsValid(validationPassword(credentials))
            return credentials
        })
    }, [])

    const updatePassword = useCallback(() => {
        const {confirm, ...params} = credentials
        performApiCall('partner/password', {method: 'PUT', params})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to update password. ' + result.error})
                //reset form
                setCredentials({})
                notify({type: "success", message: "Password changed successfully"})
            })
    }, [credentials])

    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])
    const changeNewPassword = useCallback(e => changeInfo('newPassword', e.target.value), [changeInfo])
    const changeConfirm = useCallback(e => changeInfo('confirm', e.target.value), [changeInfo])
    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            updatePassword()
        }
    }, [isValid])

    return <div className="row">
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">Password</p>
                <input type="password" value={credentials?.password || ''} onChange={changePassword} onKeyDown={onKeyDown}
                       className="styled-input"/>
            </div>
        </div>
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">New password</p>
                <input type="password" value={credentials?.newPassword || ''} onChange={changeNewPassword} onKeyDown={onKeyDown}
                       className="styled-input"/>
            </div>
        </div>
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">Confirm new password</p>
                <input type="password" value={credentials?.confirm || ''} onChange={changeConfirm} onKeyDown={onKeyDown}
                       className="styled-input"/>
            </div>
        </div>
        <div className="column column-33 column-offset-66 text-right">
            <div className="label-space"/>
            <Button disabled={!isValid} onClick={updatePassword}>Save</Button>
        </div>
    </div>
}

function EmailEditForm() {
    const userData = getAuth()
    const [email, setEmail] = useState(userData.email)
    const [isChanged, setIsChanged] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const changeEmail = useCallback(e => {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        const val = e.target.value.trim()
        setEmail(val)
        setIsValid(emailRegex.test(val))
        setIsChanged(val !== userData.email)
    }, [])

    const updateEmail = useCallback(() => {
        //TODO update email use API
        notify({type: "success", message: "Email changed successfully"})
    }, [email])

    return <div className="row">
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">Email</p>
                <input value={email || ''} onChange={changeEmail} className="styled-input"/>
            </div>
        </div>
        <div className="column column-33">
            <div className="label-space"/>
            {isChanged && <Button disabled={!isValid} onClick={updateEmail}>Save</Button>}
        </div>
    </div>
}

export default SettingsForm
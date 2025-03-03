import React, {useCallback, useState} from 'react'
import {performApiCall} from '../../../api/api-call'
import {Button} from '../../ui/button'

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

export default PasswordEditForm
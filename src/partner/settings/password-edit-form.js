import React, {useCallback, useState} from 'react'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'

function validationPassword({password, newPassword, confirm}) {
    if (!password || !confirm || newPassword === password)
        return false
    return newPassword === confirm && newPassword.length >= 8
}

export default function PasswordEditForm() {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

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
                toggleDialog()
                notify({type: "success", message: "Password changed successfully"})
            })
    }, [credentials])

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            updatePassword()
        }
    }, [isValid])

    return <div>
        <div className="space">
            <p className="label text-small">Password</p>
            <div>
                <strong>********</strong>&emsp;
                <a href="#" className="text-tiny" onClick={toggleDialog}>change</a>
            </div>
        </div>
        <Dialog dialogOpen={isOpen} className="text-left">
            <div className="micro-space"><h5>Change password</h5></div>
            <PasswordSetting title="Current password" name="password" credentials={credentials}
                             onChange={changeInfo} onKeyDown={onKeyDown}/>
            <PasswordSetting title="New password" name="newPassword" credentials={credentials}
                             onChange={changeInfo} onKeyDown={onKeyDown}/>
            <PasswordSetting title="Confirm new password" name="confirm" credentials={credentials}
                             onChange={changeInfo} onKeyDown={onKeyDown}/>
            <div className="row">
                <div className="column column-33 column-offset-33">
                    <Button outline block onClick={toggleDialog}>Cancel</Button>
                </div>
                <div className="column column-33">
                    <Button block disabled={!isValid} onClick={updatePassword}>Save</Button>
                </div>
            </div>
        </Dialog>
    </div>
}

function PasswordSetting ({title, name, value, onChange, onKeyDown}) {
    const changeValue = useCallback(e => onChange(name, e.target.value), [onChange])

    return <div className="micro-space">
        <p className="label text-small">{title}</p>
        <input type="password" value={value} onChange={changeValue} onKeyDown={onKeyDown}
               ref={(name === 'password') ? useAutoFocusRef : null} className="styled-input"/>
    </div>
}
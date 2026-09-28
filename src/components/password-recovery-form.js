import {useCallback, useState} from 'react'
import cn from 'classnames'
import {authenticate} from '../api/auth'
import {performApiCall} from '../api/api-call'
import navigateToDashboard from '../utils/navigate-to-dashboard'
import {useAutoFocusRef} from '../utils/hooks/auto-focus-ref'
import {Button} from './ui/button'

const minPasswordLength = 8

function validation({password, confirm}) {
    if (!password || !confirm)
        return false
    return password === confirm && password.length >= minPasswordLength
}

export default function PasswordRecoveryForm({token}) {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)
    const [inProgress, setInProgress] = useState(false)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const credentials = {...prev, [key]: val.trim()}
            setIsValid(validation(credentials))
            return credentials
        })
    }, [])

    const onSave = useCallback(() => {
        if (inProgress)
            return
        setInProgress(true)
        performApiCall('password/reset', {
            method: 'POST',
            auth: false,
            params: {token, newPassword: credentials.password}
        })
            .then(result => {
                setInProgress(false)
                if (result.error)
                    return notify({type: 'error', message: 'Could not reset password. ' + result.error})
                notify({type: 'success', message: 'Password changed'})
                authenticate(result.accessToken)
                navigateToDashboard()
            })
    }, [token, credentials, inProgress])

    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])
    const changeConfirm = useCallback(e => changeInfo('confirm', e.target.value), [changeInfo])
    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            onSave()
        }
    }, [onSave, isValid])

    const confirmMismatch = !!credentials?.confirm && credentials.confirm !== credentials.password

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Choose a new password</h3>
        <p className="dimmed space">Set the password for your StellarBroker account</p>
        <div className="label-space">
            <p className="label">New password</p>
            <input type="password" value={credentials?.password || ''} onChange={changePassword}
                   onKeyDown={onKeyDown} ref={useAutoFocusRef} className="styled-input"
                   placeholder={`At least ${minPasswordLength} characters`}/>
        </div>
        <div className="label-space">
            <p className="label">Confirm password</p>
            <input type="password" value={credentials?.confirm || ''} onChange={changeConfirm} onKeyDown={onKeyDown}
                   className={cn('styled-input', {invalid: confirmMismatch})} placeholder="Repeat password"/>
        </div>
        <Button block disabled={!isValid || inProgress} className="space" onClick={onSave}>
            {inProgress ? 'Saving...' : 'Save password'}
        </Button>
        <p className="text-center dimmed">
            <a href="/sign-in">Back to sign in</a>
        </p>
    </div>
}

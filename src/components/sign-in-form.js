import {useCallback, useState} from 'react'
import {authenticate} from '../api/auth'
import {performApiCall} from '../api/api-call'
import {useAutoFocusRef} from '../utils/hooks/auto-focus-ref'
import {Button} from './ui/button'
import CheckEmailView from './check-email-view'

export default function SignInForm({login}) {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [unconfirmedEmail, setUnconfirmedEmail] = useState(null)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const newInfo = {...prev, [key]: val.trim()}
            setIsValid(!!newInfo.email && !!newInfo.password)
            return newInfo
        })
    }, [])

    const onAuth = useCallback(() => {
        if (inProgress)
            return
        setInProgress(true)
        performApiCall('login', {method: 'POST', auth: false, params: credentials})
            .then(result => {
                setInProgress(false)
                if (result.error) {
                    //credentials accepted, address not confirmed
                    if (result.code === 'email_not_verified')
                        return setUnconfirmedEmail(credentials.email)
                    return notify({type: 'error', message: 'Sign in failed. ' + result.error})
                }
                login(authenticate(result.accessToken))
            })
    }, [credentials, inProgress, login])

    const changeEmail = useCallback(e => changeInfo('email', e.target.value), [changeInfo])
    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])
    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            onAuth()
        }
    }, [onAuth, isValid])

    if (unconfirmedEmail)
        return <CheckEmailView email={unconfirmedEmail} title="Confirm your email first"/>

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Sign in</h3>
        <p className="dimmed space">Access your partner account</p>
        <div className="label-space">
            <p className="label">Email</p>
            <input value={credentials?.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} ref={useAutoFocusRef}
                   className="styled-input"/>
        </div>
        <div className="label-space">
            <p className="label">Password</p>
            <input type="password" value={credentials?.password || ''} onChange={changePassword} onKeyDown={onKeyDown}
                   className="styled-input"/>
        </div>
        <p className="text-right text-small double-space">
            <a href="/forgot-password">Forgot password?</a>
        </p>
        <Button block disabled={!isValid || inProgress} className="space" onClick={onAuth}>
            {inProgress ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-center dimmed">Don't have an account?&nbsp;
            <a href="/sign-up">Sign up</a>
        </p>
    </div>
}

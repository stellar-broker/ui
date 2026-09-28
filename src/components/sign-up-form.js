import {useCallback, useState} from 'react'
import cn from 'classnames'
import {performApiCall} from '../api/api-call'
import {useAutoFocusRef} from '../utils/hooks/auto-focus-ref'
import validateEmail from '../utils/validate-email'
import {Button} from './ui/button'
import CheckEmailView from './check-email-view'

const minPasswordLength = 8

//mirrors the server rules
function validate({email, password, confirm}) {
    return validateEmail(email) && password?.length >= minPasswordLength && password === confirm
}

export default function SignUpForm() {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState(null)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const newInfo = {...prev, [key]: val.trim()}
            setIsValid(validate(newInfo))
            return newInfo
        })
    }, [])

    const onRegister = useCallback(() => {
        if (inProgress)
            return
        setInProgress(true)
        const {email, password} = credentials
        performApiCall('signup', {method: 'POST', auth: false, params: {email, password}})
            .then(result => {
                setInProgress(false)
                if (result.error)
                    return notify({type: 'error', message: 'Sign up failed. ' + result.error})
                //no session until the address is confirmed
                setRegisteredEmail(result.email || email)
            })
    }, [credentials, inProgress])

    const changeEmail = useCallback(e => changeInfo('email', e.target.value), [changeInfo])
    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])
    const changeConfirm = useCallback(e => changeInfo('confirm', e.target.value), [changeInfo])
    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            onRegister()
        }
    }, [onRegister, isValid])

    if (registeredEmail)
        return <CheckEmailView email={registeredEmail}/>

    const confirmMismatch = !!credentials?.confirm && credentials.confirm !== credentials.password

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Create account</h3>
        <p className="dimmed space">Sign up to start using the StellarBroker API</p>
        <div className="label-space">
            <p className="label">Email</p>
            <input value={credentials?.email || ''} onChange={changeEmail} onKeyDown={onKeyDown} ref={useAutoFocusRef}
                   className="styled-input" placeholder="you@company.com"/>
        </div>
        <div className="label-space">
            <p className="label">Password</p>
            <input type="password" value={credentials?.password || ''} onChange={changePassword} onKeyDown={onKeyDown}
                   className="styled-input" placeholder={`At least ${minPasswordLength} characters`}/>
        </div>
        <div className="label-space">
            <p className="label">Confirm password</p>
            <input type="password" value={credentials?.confirm || ''} onChange={changeConfirm} onKeyDown={onKeyDown}
                   className={cn('styled-input', {invalid: confirmMismatch})} placeholder="Repeat password"/>
        </div>
        <Button block disabled={!isValid || inProgress} className="space" onClick={onRegister}>
            {inProgress ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="text-center dimmed">Already have an account?&nbsp;
            <a href="/sign-in">Sign in</a>
        </p>
    </div>
}

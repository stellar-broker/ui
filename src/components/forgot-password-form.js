import {useCallback, useState} from 'react'
import {performApiCall} from '../api/api-call'
import {useAutoFocusRef} from '../utils/hooks/auto-focus-ref'
import validateEmail from '../utils/validate-email'
import {Button} from './ui/button'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [inProgress, setInProgress] = useState(false)
    const [sent, setSent] = useState(false)

    const changeEmail = useCallback(e => setEmail(e.target.value.trim()), [])

    const onSubmit = useCallback(() => {
        if (inProgress)
            return
        setInProgress(true)
        performApiCall('password/forgot', {method: 'POST', auth: false, params: {email}})
            .then(result => {
                setInProgress(false)
                if (result.error)
                    return notify({type: 'error', message: 'Request failed. ' + result.error})
                setSent(true)
            })
    }, [email, inProgress])

    const isValid = validateEmail(email)
    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            onSubmit()
        }
    }, [onSubmit, isValid])

    if (sent)
        return <div className="w-100" style={{maxWidth: '25em'}}>
            <h3>Check your email</h3>
            {/*same answer whether or not an account exists*/}
            <p className="dimmed space">
                If an account is registered to <strong>{email}</strong>, a password reset link is on its way.
            </p>
            <p className="dimmed text-small space">
                The link expires in 2 hours. If it hasn't arrived, check your spam folder.
            </p>
            <Button block href="/sign-in" className="space">Back to sign in</Button>
        </div>

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Reset password</h3>
        <p className="dimmed space">
            Enter the address on your account and we'll send you a link to choose a new password.
        </p>
        <div className="label-space">
            <p className="label">Email</p>
            <input value={email} onChange={changeEmail} onKeyDown={onKeyDown} ref={useAutoFocusRef}
                   className="styled-input" placeholder="you@company.com"/>
        </div>
        <Button block disabled={!isValid || inProgress} className="space" onClick={onSubmit}>
            {inProgress ? 'Sending...' : 'Send reset link'}
        </Button>
        <p className="text-center dimmed">
            <a href="/sign-in">Back to sign in</a>
        </p>
    </div>
}

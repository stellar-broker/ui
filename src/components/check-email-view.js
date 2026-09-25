import {useCallback, useState} from 'react'
import {performApiCall} from '../api/api-call'
import {Button} from './ui/button'

const resendCooldownSeconds = 30

/**
 * Shown after a signup and after a sign-in blocked by an unconfirmed address
 */
export default function CheckEmailView({email, title = 'Check your email'}) {
    const [inProgress, setInProgress] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const resend = useCallback(() => {
        if (inProgress || cooldown)
            return
        setInProgress(true)
        performApiCall('signup/resend', {method: 'POST', auth: false, params: {email}})
            .then(result => {
                setInProgress(false)
                if (result.error)
                    return notify({type: 'error', message: 'Could not resend. ' + result.error})
                notify({type: 'success', message: 'Confirmation email sent'})
                setCooldown(resendCooldownSeconds)
                const timer = setInterval(() => setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                }), 1000)
            })
    }, [email, inProgress, cooldown])

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>{title}</h3>
        <p className="dimmed space">
            We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account
            and sign in.
        </p>
        <p className="dimmed text-small space">
            The link expires in 24 hours. If it hasn't arrived, check your spam folder.
        </p>
        <Button block outline disabled={inProgress || cooldown > 0} className="space" onClick={resend}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : (inProgress ? 'Sending...' : 'Resend email')}
        </Button>
        <p className="text-center dimmed">
            <a href="/sign-in">Back to sign in</a>
        </p>
    </div>
}

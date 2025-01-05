import {useCallback, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button} from './ui/button'

function validation({email, password}) {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    return emailRegex.test(email) && !!password
}

function SignInForm({login}) {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const newInfo = {...prev, [key]: val.trim()}
            setIsValid(validation(newInfo))
            return newInfo
        })
    }, [])

    const onAuth = useCallback(() => {
        //TODO add logic
        login(true)
    }, [login])

    const changeEmail = useCallback(e => changeInfo('email', e.target.value), [changeInfo])
    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Sign in</h3>
        <p className="text-small dimmed space">Access your partner account</p>
        <div className="micro-space">
            <p className="label text-small">Email</p>
            <input value={credentials?.email || ''}  onChange={changeEmail} className="styled-input"/>
        </div>
        <div className="space">
            <p className="label text-small">Password</p>
            <input value={credentials?.password || ''} onChange={changePassword} className="styled-input"/>
        </div>
        <Button block disabled={!isValid} className="space" onClick={onAuth}>Sign In</Button>
        <p className="text-center dimmed text-small">Don't have an account?&nbsp;
            <Link to="/request-access">Request access</Link>
        </p>
    </div>
}

export default SignInForm
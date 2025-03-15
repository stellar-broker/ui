import {useCallback, useState} from 'react'
import {navigation} from '../utils/navigation'
import {Button} from './ui/button'

function validation({password, confirm}) {
    if (!password || !confirm)
        return false
    return password === confirm && password.length >= 8
}

function PasswordRecoveryForm({id}) {
    const [credentials, setCredentials] = useState()
    const [isValid, setIsValid] = useState(false)

    const changeInfo = useCallback((key, val) => {
        setCredentials(prev => {
            const credentials = {...prev, [key]: val.trim()}
            setIsValid(validation(credentials))
            return credentials
        })
    }, [])

    const onSave = useCallback(() => {
        navigation.navigate('/sign-in')
    }, [id])

    const changePassword = useCallback(e => changeInfo('password', e.target.value), [changeInfo])
    const changeConfirm = useCallback(e => changeInfo('confirm', e.target.value), [changeInfo])

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <h3>Password recovery</h3>
        <p className="text-small dimmed space">Change your account password</p>

        <div className="micro-space">
            <p className="label text-small">Password</p>
            <input type="password" value={credentials?.password || ''} onChange={changePassword} className="styled-input"/>
        </div>
        <div className="space">
            <p className="label text-small">Confirm password</p>
            <input type="password" value={credentials?.confirm || ''} onChange={changeConfirm} className="styled-input"/>
        </div>
        <Button block disabled={!isValid} className="space" onClick={onSave}>Save</Button>
    </div>
}

export default PasswordRecoveryForm
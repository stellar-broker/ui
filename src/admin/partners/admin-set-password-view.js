import React, {useCallback, useState} from 'react'
import {useParams} from 'react-router'
import {navigation} from '../../utils/navigation'
import {Button} from '../../components/ui/button'
import {performApiCall} from '../../api/api-call'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'

export default function AdminSetPasswordView() {
    const {id} = useParams()
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')

    const save = () => {
        if (!password)
            return notify({type: 'warning', message: 'Password is required'})
        if (!confirmation)
            return notify({type: 'warning', message: 'Password confirmation is required'})
        if (password !== confirmation)
            return notify({type: 'warning', message: 'Password doesn\'t match confirmation'})

        if (confirm(`Update password for user ${id}?`)) {
            performApiCall(`partner/${id}/password`, {
                method: 'PUT',
                params: {newPassword: password}
            })
                .then((result) => {
                    if (result.error)
                        return notify({type: 'error', message: 'Failed to update password. ' + result.error})
                    notify({type: 'success', message: 'Password updated'})
                    navigation.navigate('/admin/partner')
                })
        }
    }

    const updatePassword = useCallback(e => {
        setPassword(e.target.value.trim())
    }, [setPassword])

    const updateConfirmation = useCallback(e => {
        setConfirmation(e.target.value.trim())
    }, [setConfirmation])

    return <div>
        <div>
            <h4>Set partner password</h4>
        </div>
        <p className="text-small dimmed mini-space">
            Update password for user {id}
        </p>
        <div className="hr space"/>
        <div className="row">
            <div className="column column-50">
                <label>
                    Password
                    <input type="password" value={password} onChange={updatePassword} ref={useAutoFocusRef} className="styled-input"/>
                </label>
            </div>
            <div className="nano-space mobile-only"/>
            <div className="column column-50">
                <label>
                    Confirmation
                    <input type="password" value={confirmation} onChange={updateConfirmation} className="styled-input"/>
                </label>
            </div>
        </div>
        <div className="space"/>
        <div className="row">
            <div className="column column-50">
                <Button block onClick={save}>Set password</Button>
            </div>
            <div className="column column-50">
                <Button outline block href="/admin/partner">Cancel</Button>
            </div>
        </div>
    </div>
}
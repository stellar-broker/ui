import React, {useCallback, useState} from 'react'
import {useParams} from 'react-router'
import {navigation} from '../../utils/navigation'
import {Button} from '../../components/ui/button'
import {Breadcrumbs} from '../../components/ui/breadcrumbs'
import {performApiCall} from '../../api/api-call'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {usePartnerSettings} from '../../utils/hooks/partner-settings'

export default function AdminSetPasswordView() {
    const {id} = useParams()
    const [settings] = usePartnerSettings(id)
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const links = [
        {href: '/admin/partner', title: 'Partners'},
        {href: '/admin/partner/' + id, title: settings.email},
        {title: 'Set password'}
    ]

    const save = () => {
        if (!password)
            return notify({type: 'warning', message: 'Password is required'})
        if (!confirmation)
            return notify({type: 'warning', message: 'Password confirmation is required'})
        if (password !== confirmation)
            return notify({type: 'warning', message: 'Password doesn\'t match confirmation'})

        if (confirm(`Update password for user ${settings.email}?`)) {
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
        <Breadcrumbs links={links}/>
        <div>
            <h3>Set partner password</h3>
        </div>
        <p className="dimmed space">
            Update password for user {settings.email}
        </p>
        <div className="hr space"/>
        <div className="row micro-space">
            <div className="column column-50">
                <div className="space">
                    <p className="label">Password</p>
                    <input type="password" value={password} onChange={updatePassword} ref={useAutoFocusRef}
                           className="styled-input" placeholder="Partner password"/>
                </div>
            </div>
            <div className="nano-space mobile-only"/>
            <div className="column column-50">
                <div className="space">
                    <p className="label">Confirmation</p>
                    <input type="password" value={confirmation} onChange={updateConfirmation}
                           className="styled-input" placeholder="Repeat password"/>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="column text-right">
                <Button onClick={save}>Set password</Button>
                <Button outline href="/admin/partner">Cancel</Button>
            </div>
        </div>
    </div>
}
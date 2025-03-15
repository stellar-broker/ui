import React from 'react'
import EmailEditForm from './email-edit-form'
import PasswordEditForm from './password-edit-form'
import AccountDeleteView from './account-delete-view'

export default function SettingsForm() {
    return <>
        <h5>Authorization</h5>
        <div className="micro-space"></div>
        <div className="row">
            <div className="column column-50"><EmailEditForm/></div>
            <div className="column column-50"><PasswordEditForm/></div>
        </div>
        <div className="hr space"/>
        <AccountDeleteView/>
    </>
}
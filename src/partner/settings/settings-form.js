import React from 'react'
import EmailEditForm from './email-edit-form'
import PasswordEditForm from './password-edit-form'
import AccountDeleteView from './account-delete-view'

function SettingsForm() {

    return <>
        <EmailEditForm/>
        <PasswordEditForm/>
        <div className="hr space"/>
        <AccountDeleteView/>
    </>
}


export default SettingsForm
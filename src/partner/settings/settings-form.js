import React from 'react'
import EmailEditForm from './email-edit-form'
import PasswordEditForm from './password-edit-form'

function SettingsForm() {

    return <>
        <EmailEditForm/>
        <div className="hr space"/>
        <PasswordEditForm/>
    </>
}


export default SettingsForm
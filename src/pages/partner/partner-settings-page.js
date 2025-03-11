import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SettingsForm from '../../partner/settings/settings-form'

function PartnerDashboardPage() {
    setPageMetadata({
        title: 'Settings',
        description: 'Change partner settings.'
    })

    return <div>
        <h4>Settings</h4>
        <p className="text-small dimmed mini-space">Change your settings</p>
        <div className="hr space"/>
        <SettingsForm/>
    </div>
}

export default PartnerDashboardPage
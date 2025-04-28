import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import {usePartnerSettings} from '../../utils/hooks/partner-settings'
import {Loader} from '../../components/ui/loader'
import EmailEditForm from '../../partner/settings/email-edit-form'
import PasswordEditForm from '../../partner/settings/password-edit-form'
import AccountDeleteView from '../../partner/settings/account-delete-view'

export default function PartnerDashboardPage() {
    setPageMetadata({
        title: 'Settings',
        description: 'Change partner settings.'
    })
    const [partnerInfo] = usePartnerSettings()

    return <div>
        <h3>Settings</h3>
        <p className="dimmed space">Change account settings</p>
        <div className="hr double-space"/>
        <div className="row">
            <div className="column column-66">
                <EmailEditForm/>
                <PasswordEditForm/>
            </div>
        </div>
        <div className="row">
            <div className="column column-66">
                <div className="hr space"/>
                <PartnerFees settings={partnerInfo?.settings}/>
            </div>
        </div>
        <div className="row">
            <div className="column column-66">
                <div className="hr space"/>
                <AccountDeleteView/>
            </div>
        </div>
    </div>
}

function PartnerFees({settings}) {
    if (!settings)
        return <Loader/>
    return <div className="row text-small micro-space">
        <PartnerSetting settings={settings} field="partnerVarFee" title="Partner profit fee">
            Variable fee charged from the funds saved during the swap
        </PartnerSetting>
        <PartnerSetting settings={settings} field="brokerVarFee" title="Broker profit fee">
            Variable service fee charged from the funds saved during the swap
        </PartnerSetting>
        <PartnerSetting settings={settings} field="partnerFixedFee" title="Partner fixed fee">
            Fixed partner swap fee charged from the transaction amount
        </PartnerSetting>
        <PartnerSetting settings={settings} field="brokerFixedFee" title="Broker fixed fee">
            Fixed service swap fee charged from the transaction
        </PartnerSetting>
    </div>
}

function PartnerSetting({settings, field, title, children}) {
    let value = settings[field]
    if (!value)
        return null
    return <div className="column column-25">
        <div className="micro-space">
            <strong>{value / 1000}%</strong><br/>
            <a href="#" className="dotted dimmed text-tiny" title={children}>{title}</a>
        </div>
    </div>
}
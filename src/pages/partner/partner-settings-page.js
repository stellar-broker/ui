import React, {useEffect, useState} from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import SettingsForm from '../../partner/settings/settings-form'
import {performApiCall} from '../../api/api-call'
import {Loader} from '../../components/ui/loader'

export default function PartnerDashboardPage() {
    setPageMetadata({
        title: 'Settings',
        description: 'Change partner settings.'
    })
    const [partnerInfo, setPartnerInfo] = useState()
    useEffect(() => {
        performApiCall('partner/info')
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners settings. ' + result.error})
                setPartnerInfo(result)
            })
    }, [])

    return <div>
        <h4>Settings</h4>
        <p className="text-small dimmed mini-space">Change account settings</p>
        <PartnerFees settings={partnerInfo?.settings}/>
        <div className="hr space"/>
        <SettingsForm/>
    </div>
}

function PartnerFees({settings}) {
    if (!settings)
        return <Loader/>
    return <>
        <div className="hr space"/>
        <h5 className="nano-space">Fees</h5>
        <div className="text-small space">
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
    </>
}

function PartnerSetting({settings, field, title, children}) {
    let value = settings[field]
    if (!value)
        return null
    return <div className="nano-space">
        <span className="dimmed">{title}: </span>{value / 1000}%
        <div className="dimmed text-tiny">{children}</div>
    </div>
}
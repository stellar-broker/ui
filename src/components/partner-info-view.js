import {usePartnerSettings} from '../utils/hooks/partner-settings'

export default function PartnerInfoView({id, partner, inactive = false}) {
    if (!partner)
        return null
    const settings = id ? partner : usePartnerSettings()[0]
    const caption = settings.project || partner.email

    return <div className="partner-info">
        <div className="account-image-wrap">
            {settings.image ?
                <img src={settings.image} alt="Account image"/> :
                <span>{caption[0]}</span>}
        </div>
        <div className="account-info text-small">
            <strong className="text-overflow">{caption}</strong>
            {caption !== partner.email && <span className="text-tiny text-overflow dimmed">{partner.email}</span>}
        </div>
        {inactive && <span className="badge error bordered text-tiny">Inactive</span>}
    </div>
}
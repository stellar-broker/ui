export default function PartnerInfoView({partner, inactive = false}) {
    if (!partner) return null
    const caption = partner.name || partner.email

    return <div className="partner-info">
        <div className="account-image-wrap">
            {partner.image ?
                <img src={partner.image} alt="Account image"/> :
                <span>{caption[0]}</span>}
        </div>
        <div className="account-info text-small">
            <strong className="text-overflow">{caption}</strong>
            {caption !== partner.email && <span className="text-tiny text-overflow dimmed">{partner.email}</span>}
        </div>
        {inactive && <span className="badge error bordered text-tiny">Inactive</span>}
    </div>
}
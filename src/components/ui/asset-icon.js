export default function AssetIcon({asset, icon}) {
    if (asset === 'XLM')
        return <i className="asset-icon icon-stellar"/>
    if (!icon)
        return <span className="asset-icon" style={{backgroundImage: `url(${icon})`}}>
            <i className="icon-circle"/>
        </span>
    return <span className="asset-icon" style={{backgroundImage: `url(${icon})`}}/>
}
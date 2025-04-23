import './breadcrumbs.scss'

export function Breadcrumbs({links}) {
    const nav = links.slice(0, -1)
    return <div className='breadcrumbs text-tiny space'>
        {nav.map(link => <BreadcrumbLink key={link.href} link={link}/>)}
        <span className="badge">{links.at(-1).title}</span>
    </div>
}

function BreadcrumbLink({link}) {
    return <span>
        <a href={link.href}>{link.title}</a>
        <i className="icon-chevron-right"/>
    </span>
}
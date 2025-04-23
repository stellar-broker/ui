import cn from 'classnames'

function parseUrl() {
    const path = window.location.pathname.split('/')
    return path[2] || 'dashboard'
}

export default function NavSidebarView({navLinks}) {
    const activeLink = parseUrl()

    return <ul className="nav-sidebar">
        {Object.keys(navLinks).map(a => {
            return <li key={a} className={cn({'active': activeLink === a})}>
                <a href={navLinks[a].link} className="text-small">
                    <i className={`icon-${navLinks[a].icon}`}/>{navLinks[a].title}
                </a>
            </li>
        })}
    </ul>
}
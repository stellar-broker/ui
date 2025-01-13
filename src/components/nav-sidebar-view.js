import {Link, useLocation} from 'react-router-dom'
import cn from 'classnames'

function parseUrl() {
    const location = useLocation();
    const path = location.pathname.split('/')
    return path[2] || 'dashboard'
}

function NavSidebarView({navLinks}) {
    const activeLink = parseUrl()

    return <ul className="nav-sidebar">
        {Object.keys(navLinks).map(a => {
            return <li key={a} className={cn({'active': activeLink === a})}>
                <Link to={navLinks[a].link}>
                    <i className={`icon-${navLinks[a].icon}`}/>{navLinks[a].title}
                </Link>
            </li>
        })}
    </ul>
}

export default NavSidebarView
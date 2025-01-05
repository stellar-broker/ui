import {Link, useLocation} from 'react-router-dom'
import cn from 'classnames'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/account'},
    'transactions': {title: 'Transactions', link: '/account/transactions'}
}

function parseUrl() {
    const location = useLocation();
    const path = location.pathname.split('/')
    return path[2] || 'dashboard'
}

function NavSidebarView() {
    const activeLink = parseUrl()

    return <ul className="nav-sidebar">
        <li className={cn({'active': activeLink === 'dashboard'})}>
            <Link to={navLinks.dashboard.link}>
                <i className="icon-chart"/>{navLinks.dashboard.title}
            </Link>
        </li>
        <li className={cn({'active': activeLink === 'transactions'})}>
            <Link to={navLinks.transactions.link}>
                <i className="icon-clock"/>{navLinks.transactions.title}
            </Link>
        </li>
        <li>
            <Link to={navLinks.dashboard.link}>
                <span><i className="icon-send-circle"/>Payouts</span>
                {/*<span className="badge badge-pill">Soon</span>*/}
            </Link>
        </li>
        <li>
            <Link to={navLinks.dashboard.link}>
                <span><i className="icon-key"/>API keys</span>
                {/*<span className="badge badge-pill">Soon</span>*/}
            </Link>
        </li>
        <li>
            <Link to={navLinks.dashboard.link}>
                <span><i className="icon-document"/>Documentation</span>
                {/*<span className="badge badge-pill">Soon</span>*/}
            </Link>
        </li>
    </ul>
}

export default NavSidebarView
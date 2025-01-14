import {Link} from 'react-router-dom'
import Logo from '../layout/logo'
import NavSidebarView from './nav-sidebar-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/account', icon: 'chart'},
    'transactions': {title: 'Transactions', link: '/account/transactions', icon: 'clock'},
    'payouts': {title: 'Payouts', link: '/account/payouts', icon: 'send-circle'},
    'api-keys': {title: 'API keys', link: '/account/api-keys', icon: 'key'},
    'documentation': {title: 'Documentation', link: '/account/documentation', icon: 'document'},
}

function SidebarView() {
    return <div className="sidebar">
        <Logo/>
        <div className="double-space"/>
        <div className="partner micro-space">
            <div className="logo-partner">
                <img src="https://albedo.link/img/logo-square.svg" alt=""/>
            </div>
            <div className="info-partner">
                <strong>Albedo</strong>
                <p className="text-tiny dimmed">StellarExpert</p>
            </div>
        </div>
        <div className="hr micro-space"/>
        <NavSidebarView navLinks={navLinks}/>
        <div className="hr micro-space"/>
        <div className="links">
            <li>
                <Link to="settings" className="text-small">
                    <span><i className="icon-cog"/>Settings</span>
                </Link>
            </li>
            <li>
                <Link to="mailto:example@site.com" className="text-small">
                    <span><i className="icon-document"/>Contact Support</span>
                </Link>
            </li>
        </div>
    </div>
}

export default SidebarView
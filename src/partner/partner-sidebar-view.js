import {getAuth} from '../api/auth'
import SidebarView, {LogoutView} from '../components/sidebar-view'
import NavSidebarView from '../components/nav-sidebar-view'
import PartnerInfoView from '../components/partner-info-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/account', icon: 'dashboard'},
    'transactions': {title: 'Swap history', link: '/account/transactions', icon: 'clock'},
    'payouts': {title: 'Payouts', link: '/account/payouts', icon: 'coins'},
    'api-keys': {title: 'API keys', link: '/account/api-keys', icon: 'console'},
    'documentation': {title: 'Documentation', link: 'https://github.com/stellar-broker/client', icon: 'book'}
}

export default function PartnerSidebarView() {
    const userData = getAuth()
    return <SidebarView>
        <PartnerInfoView partner={userData}/>
        <div className="mini-space"/>
        <div className="hr mini-space"/>
        <NavSidebarView navLinks={navLinks}/>
        <ul className="links">
            <li>
                <a href="/account/settings" className="text-small">
                    <span><i className="icon-settings"/>Settings</span>
                </a>
            </li>
            <li>
                <a href="mailto:hello@stellar.broker" className="text-small">
                    <span><i className="icon-help"/>Contact support</span>
                </a>
            </li>
            <li><LogoutView/></li>
        </ul>
    </SidebarView>
}
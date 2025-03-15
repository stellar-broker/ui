import SidebarView, {LogoutView} from '../components/sidebar-view'
import NavSidebarView from '../components/nav-sidebar-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/account', icon: 'chart'},
    'transactions': {title: 'Swap history', link: '/account/transactions', icon: 'clock'},
    'payouts': {title: 'Payouts', link: '/account/payouts', icon: 'send-circle'},
    'api-keys': {title: 'API keys', link: '/account/api-keys', icon: 'key'},
    'documentation': {title: 'Documentation', link: '/account/documentation', icon: 'document'},
}

function PartnerSidebarView() {
    return <SidebarView>
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
        <ul className="links">
            <li>
                <a href="/account/settings" className="text-small">
                    <span><i className="icon-cog"/>Settings</span>
                </a>
            </li>
            <li>
                <a href="mailto:broker@stellar.expert" className="text-small">
                    <span><i className="icon-document"/>Contact support</span>
                </a>
            </li>
            <li><LogoutView/></li>
        </ul>
    </SidebarView>
}

export default PartnerSidebarView
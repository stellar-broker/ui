import SidebarView, {LogoutView} from '../components/sidebar-view'
import NavSidebarView from '../components/nav-sidebar-view'

const navLinks = {
    dashboard: {title: 'Dashboard', link: '/admin', icon: 'dashboard'},
    partners: {title: 'Partners', link: '/admin/partner', icon: 'briefcase'},
    transactions: {title: 'Swap history', link: '/admin/transactions', icon: 'clock'},
    payouts: {title: 'Payouts', link: '/admin/payouts', icon: 'coins'},
    logs: {title: 'Logs', link: '/admin/logs', icon: 'log'},
}

export default function AdminSidebarView() {
    return <SidebarView>
        <NavSidebarView navLinks={navLinks}/>
        <ul className="links">
            <li><LogoutView/></li>
        </ul>
    </SidebarView>
}
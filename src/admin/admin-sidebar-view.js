import SidebarView, {LogoutView} from '../components/sidebar-view'
import NavSidebarView from '../components/nav-sidebar-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/admin', icon: 'chart'},
    'partners': {title: 'Partners', link: '/admin/partners', icon: 'user-group'},
    'logs': {title: 'Logs', link: '/admin/logs', icon: 'warning-circle'},
}

function AdminSidebarView() {
    return <SidebarView>
        <NavSidebarView navLinks={navLinks}/>
        <ul className="links">
            <li><LogoutView/></li>
        </ul>
    </SidebarView>
}

export default AdminSidebarView
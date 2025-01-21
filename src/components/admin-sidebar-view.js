import SidebarView from './sidebar-view'
import NavSidebarView from './nav-sidebar-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/admin', icon: 'chart'},
    'partners': {title: 'Partners', link: '/admin/partners', icon: 'user-group'},
}

function AdminSidebarView() {
    return <SidebarView>
        <NavSidebarView navLinks={navLinks}/>
    </SidebarView>
}

export default AdminSidebarView
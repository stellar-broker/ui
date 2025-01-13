import Logo from '../layout/logo'
import NavSidebarView from './nav-sidebar-view'

const navLinks = {
    'dashboard': {title: 'Dashboard', link: '/admin', icon: 'chart'},
    'partners': {title: 'Partners', link: '/admin/partners', icon: 'user-group'},
}

function SidebarView() {
    return <div className="sidebar">
        <Logo/>
        <div className="double-space"/>
        <NavSidebarView navLinks={navLinks}/>
    </div>
}

export default SidebarView
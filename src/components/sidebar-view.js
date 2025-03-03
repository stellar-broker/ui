import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {logout} from '../api/auth'
import Logo from '../layout/logo'

function SidebarView({children}) {
    const [menuVisible, setMenuVisible] = useState(false)

    return <div className={`sidebar ${menuVisible && 'active'}`}>
        <div className="top-menu-block">
            <Logo/>
            <a className="toggle-menu" href="#" onClick={e => setMenuVisible(!menuVisible)}>
                <i className="icon icon-menu" style={{fontSize: '1.4em'}}/>
            </a>
        </div>
        <div className="double-space"/>
        {children}
    </div>
}

export function LogoutView() {
    const navigate = useNavigate()
    const onLogout = useCallback(() => {
        logout()
        navigate('/')
    }, [])

    return <a href="#" className="text-small" onClick={onLogout}>
        <span><i className="icon-logout"/>Logout</span>
    </a>
}

export default SidebarView
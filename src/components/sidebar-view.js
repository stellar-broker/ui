import {useState} from 'react'
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

export default SidebarView
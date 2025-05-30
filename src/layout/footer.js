import React, {memo} from 'react'

export default memo(function Footer() {
    return <div className="text-small text-center dimmed">
        <div  className="micro-space"/>
        <div>
            <span className="dimmed-light">©2025 StellarBroker by UltraStellar</span>
        </div>
        <div>
            <a href="https://github.com/stellar-broker/" target="_blank"><i className="icon-github"/> GitHub</a>
        </div>
    </div>
})

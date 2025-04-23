import React, {memo} from 'react'

export default memo(function Footer() {
    return <div className="text-small dimmed" style={{textAlign: 'center', padding: '1em'}}>
        <div>
            <a href="https://github.com/stellar-broker/" target="_blank"><i className="icon-github"/> Source Code</a>
            <span className="dimmed-light">&nbsp;|&nbsp;©2025 StellarBroker</span>
        </div>
    </div>
})

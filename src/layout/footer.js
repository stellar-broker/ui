import React, {memo} from 'react'

export default memo(function Footer() {
    return <div className="text-small dimmed" style={{textAlign: 'center', padding: '1em'}}>
        <div>
            <a href="https://github.com/stellar-broker/"><i className="icon-github"/></a>&nbsp;|&nbsp;
            StellarBroker
        </div>
        ©2024 StellarBroker
    </div>
})
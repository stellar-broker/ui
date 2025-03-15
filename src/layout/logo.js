import React, {memo} from 'react'

export default memo(function Logo() {
    return <a href="/" className="logo">
        <img src="/img/stellar-broker-logo+text-v1.png" alt="StellarBroker" style={{maxHeight: '64px'}}/>
    </a>
})
import React from 'react'

export default React.memo(function Logo() {
    return <a href="/" className="logo">
        <img src="/img/stellar-broker-logo+text-v1.png" alt="StellarBroker" style={{maxHeight: '64px'}}/>
    </a>
})
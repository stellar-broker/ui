import React, {memo} from 'react'
import {Link} from 'react-router-dom'

export default memo(function Logo() {
    return <Link to="/" className="logo">
        <img src="/img/stellar-broker-logo+text-v1.png" alt="StellarBroker" style={{maxHeight: '64px'}}/>
    </Link>
})
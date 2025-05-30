import React from 'react'
import {Button} from '../ui/button'

export default function MonetizeView() {

    return <div className="monetize-section">
        <div className="container">
            <div className="monetize-block dual-layout middle">
                <div>
                    <div className="micro-space" style={{fontSize: '1.25rem'}}>$</div>
                    <h3>Integrate StellarBroker <br/> and earn revenue on every swap</h3>
                    <div className="mini-space text-tiny" style={{maxWidth: '38em'}}>
                        Leverage StellarBroker’s optimized routes to give users better swap rates —
                        and earn revenue on every transaction.</div>
                    <Button white href="/request-access">Start earning</Button>
                </div>
                <div>
                    <img src="img/front/monetize-value.png" alt="Monetize"/>
                </div>
            </div>
        </div>
    </div>
}
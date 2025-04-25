import React from 'react'
import {Button} from '../ui/button'

export default function MonetizeView() {

    return <div className="monetize-section">
        <div className="container">
            <div className="monetize-block dual-layout middle">
                <div>
                    <div className="micro-space" style={{fontSize: '1.25rem'}}>$</div>
                    <h3>Monetize swaps with  our API integration</h3>
                    <div className="mini-space text-tiny" style={{maxWidth: '28em'}}>
                        Set the fee rate you wish to collect from each transaction, and watch your earnings grow
                        as users leverage the efficient swap routes provided by our API.</div>
                    <Button white href="/request-access">Try it now</Button>
                </div>
                <div>
                    <img src="img/front/monetize-value.png" alt="Monetize"/>
                </div>
            </div>
        </div>
    </div>
}
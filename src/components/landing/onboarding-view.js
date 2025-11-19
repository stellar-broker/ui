import React from 'react'
import {getAuth} from '../../api/auth'
import {SwapWidget} from '../../widget/swap-widget'
import {Button} from '../ui/button'

export default function OnboardingView() {

    return <div className="onboarding-section">
        <div className="container">
            <div className="row">
                <div className="column column-flex column-60">
                    <div style={{maxWidth: '45em'}}>
                        <h1 className="heading micro-space">Unlock the best swap rates on Stellar</h1>
                        <p className="dimmed mini-space" style={{fontSize: '1.25em'}}>
                            Integrate StellarBroker into your product to deliver unbeatable swap rates
                            and earn passive revenue on every transaction.</p>
                    </div>
                    <div className="w-100">
                        <Button href="/request-access">Get started</Button>
                        <Button href="/account" outline>{getAuth() ? 'Account' : 'Partner login'}</Button>
                        <div className="mobile-only double-space"></div>
                    </div>
                </div>
                <div className="column column-40">
                    <div className="widget-block">
                        <SwapWidget/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
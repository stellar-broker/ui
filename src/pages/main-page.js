import React from 'react'
import PageLayout from '../layout/page-layout'
import Logo from '../layout/logo'
import {Button} from '../components/ui/button'
import {SwapWidget} from '../widget/swap-widget'

export default function MainPage() {
    return <PageLayout>
        <div className="header">
            <Logo/>
        </div>
        <div className="row double-space">
            <div className="column column-60">
                <h1 className="heading micro-space"><span>StellarBroker</span> integration for your project on Stellar</h1>
                <p className="dimmed space">Integrate StellarBroker API into your project to leverage the most efficient swap router available
                    on Stellar and earn fees on every transaction.</p>
                <div>
                    <Button href="/request-access">Request Access</Button>
                    <Button href="/sign-in" outline>Sign In</Button>
                </div>
            </div>
            <div className="column column-40">
                <div className="widget-block">
                    <SwapWidget/>
                </div>
            </div>
        </div>
        <div className="row double-space flex-center">
            <div className="column column-25">
                <div className="card space">
                    <div className="space"><i className="icon-swap color-primary"/></div>
                    <div className="text-small micro-space"><strong>Best Exchange Rates</strong></div>
                    <p className="text-tiny dimmed micro-space flex-grow">
                        We navigate through various liquidity pools to unlock the optimal conversion paths, ensuring
                        swift and the most cost-effective swaps on Stellar.
                    </p>
                    <div className="preview">
                        <img src="img/front/widget.png"/>
                    </div>
                </div>
            </div>
            <div className="column column-25">
                <div className="card space">
                    <div className="space color-primary">%</div>
                    <div className="text-small micro-space"><strong>Earn Commissions</strong></div>
                    <p className="text-tiny dimmed micro-space flex-grow">
                        Set the fee rate you wish to collect from each transaction, and watch your earnings grow
                        as users leverage the efficient swap routes provided by our API.
                    </p>
                    <div className="preview">
                        <img src="img/front/earn.png"/>
                    </div>
                </div>
            </div>
            <div className="column column-25">
                <div className="card space">
                    <div className="space"><i className="icon-code color-primary"/></div>
                    <div className="text-small micro-space"><strong>Seamless API Integration</strong></div>
                    <p className="text-tiny dimmed micro-space flex-grow">
                        Easily integrate StellarBroker API into your existing infrastructure, ensuring a smooth transition
                        and uninterrupted access to the best exchange rates in the market.
                    </p>
                    <div className="preview">
                        <img src="img/front/integration.png"/>
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
}
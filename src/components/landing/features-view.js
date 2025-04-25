import React from 'react'

export default function FeaturesView() {

    return <div className="features-section double-space">
        <div className="container">
            <div className="row">
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-swap color-primary"/></div>
                        <div className="micro-space"><strong>Best Exchange Rates</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            We navigate through various liquidity pools to unlock the optimal conversion paths, ensuring
                            swift and the most cost-effective swaps on Stellar.
                        </p>
                        <div className="preview">
                            <img src="img/front/widget.png" alt="Best exchange rates"/>
                        </div>
                    </div>
                </div>
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-chart-up color-primary"/></div>
                        <div className="micro-space"><strong>Analytics Dashboard</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            Understand how your integration performs with transparent data on executed swaps,
                            daily activity, and your passive income.
                        </p>
                        <div className="preview">
                            <img src="img/front/volume.png" alt="Earn commissions"/>
                        </div>
                    </div>
                </div>
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-console color-primary"/></div>
                        <div className="micro-space"><strong>Seamless API Integration</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            Easily integrate StellarBroker API into your existing infrastructure, ensuring a smooth transition
                            and uninterrupted access to the best exchange rates in the market.
                        </p>
                        <div className="preview">
                            <img src="img/front/integration.png" alt="Seamless API integration"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
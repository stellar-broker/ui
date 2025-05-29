import React from 'react'

export default function FeaturesView() {

    return <div className="features-section double-space">
        <div className="container">
            <div className="row">
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-swap color-primary"/></div>
                        <div className="micro-space"><strong>Best swap rates</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            Our router efficiently scans through classic Stellar DEX, AMMs, and major liquidity pool protocols on Soroban
                            to find the most cost-effective quotes every time.
                        </p>
                        <div className="preview">
                            <img src="img/front/widget.png" alt="Best swap rates"/>
                        </div>
                    </div>
                </div>
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-chart-up color-primary"/></div>
                        <div className="micro-space"><strong>Powerful analytics dashboard</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            Track how your StellarBroker integration performs and gain insights into swap activity, volumes,
                            and revenue through our intuitive partner dashboard.
                        </p>
                        <div className="preview">
                            <img src="img/front/volume.png" alt="Powerful analytics dashboard"/>
                        </div>
                    </div>
                </div>
                <div className="column column-33">
                    <div className="card white space">
                        <div className="space"><i className="icon-console color-primary"/></div>
                        <div className="micro-space"><strong>Seamless integration</strong></div>
                        <p className="text-tiny dimmed micro-space flex-grow">
                            Easily integrate the StellarBroker API into your product’s swap interface to give users access
                            to the best exchange rates on Stellar.
                        </p>
                        <div className="preview">
                            <img src="img/front/integration.png" alt="Seamless integration"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
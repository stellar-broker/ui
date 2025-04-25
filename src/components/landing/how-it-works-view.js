import React from 'react'

export default function HowItWorksView() {

    return <div className="how-it-works-section">
        <div className="container">
            <h2 className="text-center">How it works</h2>
            <div className="double-space desktop-only"/>
            <div className="flex-center flex-wrap card-group" style={{paddingTop: '1.5rem'}}>
                <div className="card white">
                    <div className="card-preview">
                        <div className="card-preview-twix">
                            <div className="card-box">
                                <img src="/img/front/profile.png" alt=""/>
                            </div>
                            <div className="card-box">
                                <i className="icon-swap"/>
                            </div>
                        </div>
                    </div>
                    <div className="nano-space"/>
                    <div className="card-info">
                        <strong>User initiates an asset swap</strong>
                        <div className="micro-space"/>
                        <p className="text-tiny">The user opens your app and wants to swap assets using their wallet.</p>
                    </div>
                </div>
                <div className="card white connection">
                    <div className="card-preview">
                        <div className="card-box">
                            <img src="/img/front/union.png" alt=""/>
                        </div>
                    </div>
                    <div className="card-info">
                    <strong>Your app requests the best available rate</strong>
                        <div className="micro-space"/>
                        <p className="text-tiny">Your app sends a request to our API to fetch the best swap rate.</p>
                    </div>
                </div>
                <div className="card white">
                    <div className="card-preview">
                        <div className="card-box" style={{padding: '0.5rem 2rem'}}>
                            <img src="/img/stellar-broker-logo+text-v1.png" alt="StellarBroker" style={{height: '40px'}}/>
                        </div>
                    </div>
                    <div className="nano-space"/>
                    <div className="card-info">
                        <strong>Smart quote generation</strong>
                        <div className="micro-space"/>
                        <p className="text-tiny">
                            Stellar Broker finds the best price by combining routes from orderbooks, AMMs, SoroSwap, and Aquarius pools.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
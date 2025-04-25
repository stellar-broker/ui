import React from 'react'
import {setPageMetadata} from '../utils/meta-tags-generator'
import Logo from '../layout/logo'
import Footer from '../layout/footer'
import OnboardingView from '../components/landing/onboarding-view'
import FeaturesView from '../components/landing/features-view'
import MonetizeView from '../components/landing/monetize-view'
import HowItWorksView from '../components/landing/how-it-works-view'
import FaqView from '../components/landing/faq-view'
import '../components/landing/landing.scss'

export default function MainPage() {
    setPageMetadata({
        title: 'StellarBroker - Multi-source liquidity swap router for Stellar, providing access to AMMs and Stellar DEX',
        description: 'StellarBroker'
    })

    return <div className="landing-wrapper">
        <div className="container">
            <div className="header">
                <Logo/>
            </div>
        </div>
        <OnboardingView/>
        <div className="desktop-only space">&nbsp;</div>
        <FeaturesView/>
        <div className="desktop-only space">&nbsp;</div>
        <MonetizeView/>
        <div className="desktop-only space">&nbsp;</div>
        <HowItWorksView/>
        <div className="desktop-only space">&nbsp;</div>
        <div className="w-100 bg-color-white">
            <FaqView/>
            <Footer/>
            <div className="micro-space desktop-only"/>
        </div>
    </div>
}
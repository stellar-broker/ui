import React, {useEffect, useState} from 'react'
import {authenticate} from '../api/auth'
import {performApiCall} from '../api/api-call'
import navigateToDashboard from '../utils/navigate-to-dashboard'
import {setPageMetadata} from '../utils/meta-tags-generator'
import {Button} from '../components/ui/button'
import Logo from '../layout/logo'
import Footer from '../layout/footer'
import PageLayout from '../layout/page-layout'

/**
 * Landing page for the confirmation link. Spends the token and opens the dashboard
 */
export default function VerifyEmailPage() {
    const [error, setError] = useState(null)

    setPageMetadata({
        title: 'Confirm email',
        description: 'Activate your StellarBroker partner account.'
    })

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token')
        if (!token) {
            setError('This confirmation link is incomplete.')
            return
        }
        performApiCall('signup/verify', {method: 'POST', auth: false, params: {token}})
            .then(result => {
                if (result.error)
                    return setError(result.error)
                authenticate(result.accessToken)
                navigateToDashboard()
            })
    }, [])

    return <PageLayout compact>
        <div className="row row-no-padding dual-screen bg-color-white">
            <div className="column column-40">
                <div className="middle-layout">
                    <div className="space">
                        <Logo/>
                    </div>
                    <div className="w-100" style={{maxWidth: '25em'}}>
                        {error ?
                            <>
                                <h3>Link didn't work</h3>
                                <p className="dimmed space">{error}</p>
                                <p className="dimmed space">
                                    Confirmation links expire after 24 hours and can only be used once.
                                    Sign in to have a new one sent.
                                </p>
                                <Button block href="/sign-in" className="space">Go to sign in</Button>
                            </> :
                            <>
                                <h3>Confirming your email</h3>
                                <p className="dimmed space">One moment...</p>
                            </>}
                    </div>
                    <div className="space mobile-only"/>
                    <Footer/>
                </div>
            </div>
            <div className="column column-60 bg-color-primary flex-middle desktop-only overflow-hidden">
                <img src="/img/dashboard.png" className="promo" style={{maxHeight: '80vh'}} alt=""/>
            </div>
        </div>
    </PageLayout>
}

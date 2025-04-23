import React, {useCallback} from 'react'
import {navigation} from '../utils/navigation'
import {setPageMetadata} from '../utils/meta-tags-generator'
import SignInForm from '../components/sign-in-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'
import PageLayout from '../layout/page-layout'

export default function SignInPage({onLogin}) {
    const login = useCallback((authenticated) => {
        if (authenticated) {
            onLogin ? onLogin() : navigation.navigate('/')
        }
    }, [onLogin])

    setPageMetadata({
        title: 'Sign in',
        description: 'Account authorization form.'
    })

    return <PageLayout compact>
        <div className="row row-no-padding dual-screen bg-color-white">
            <div className="column column-40">
                <div className="middle-layout">
                    <div className="space">
                        <Logo/>
                    </div>
                    <SignInForm login={login}/>
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
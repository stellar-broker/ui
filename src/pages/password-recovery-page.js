import React from 'react'
import {useParams} from 'react-router'
import {setPageMetadata} from '../utils/meta-tags-generator'
import PasswordRecoveryForm from '../components/password-recovery-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'
import PageLayout from '../layout/page-layout'

export default function PasswordRecoveryPage() {
    //route param is the reset token
    const {id: token} = useParams()

    setPageMetadata({
        title: 'Password recovery',
        description: 'Choose a new password for your StellarBroker partner account.'
    })

    return <PageLayout compact>
        <div className="row row-no-padding dual-screen bg-color-white">
            <div className="column column-40">
                <div className="middle-layout">
                    <div className="space">
                        <Logo/>
                    </div>
                    <PasswordRecoveryForm token={token}/>
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

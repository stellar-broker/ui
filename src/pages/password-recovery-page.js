import React from 'react'
import SignInForm from '../components/sign-in-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'
import PasswordRecoveryForm from '../components/password-recovery-form'
import {useParams} from 'react-router-dom'

function SignInPage() {
    const {id} = useParams()

    return <div className="row row-no-padding dual-screen">
        <div className="column column-50">
            <div className="middle-layout">
                <div className="top-block space">
                    <Logo/>
                </div>
                <PasswordRecoveryForm id={id}/>
                <div className="bottom-block">
                    <Footer/>
                </div>
            </div>
        </div>
        <div className="column column-50 bg-color-primary flex-middle only-desktop">
            <img src="/img/dashboard.png" className="promo" style={{maxHeight: '80vh'}} alt=""/>
        </div>
    </div>
}

export default SignInPage
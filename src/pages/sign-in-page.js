import React, {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import SignInForm from '../components/sign-in-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'

export default function SignInPage({onLogin}) {
    const navigate = useNavigate()
    const login = useCallback((authenticated) => {
        if (authenticated) {
            onLogin ? onLogin() : navigate('/')
        }
    }, [onLogin])
    return <div className="row row-no-padding dual-screen">
        <div className="column column-50">
            <div className="middle-layout">
                <div className="top-block space">
                    <Logo/>
                </div>
                <SignInForm login={login}/>
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
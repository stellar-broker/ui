import React from 'react'
import {Route, Router, Switch} from 'react-router'
import AdminRouter from './admin-router'
import PartnerRouter from './partner-router'
import SignUpPage from './pages/sign-up-page'
import MainPage from './pages/main-page'
import NotFoundPage from './pages/not-found-page'
import SignInPage from './pages/sign-in-page'
import VerifyEmailPage from './pages/verify-email-page'
import ForgotPasswordPage from './pages/forgot-password-page'
import PasswordRecoveryPage from './pages/password-recovery-page'

export default function AppRouter({history}) {
    return <Router history={history}>
        <Switch>
            <Route path="/admin" component={AdminRouter}/>
            <Route path="/account" component={PartnerRouter}/>
            <Route path="/sign-up" exact component={SignUpPage}/>
            {/*legacy access request links*/}
            <Route path="/request-access" exact component={SignUpPage}/>
            <Route path="/sign-in" exact component={SignInPage}/>
            <Route path="/verify-email" exact component={VerifyEmailPage}/>
            <Route path="/forgot-password" exact component={ForgotPasswordPage}/>
            <Route path="/password-recovery/:id" exact component={PasswordRecoveryPage}/>
            <Route path="/" exact component={MainPage}/>
            <Route path="*" component={NotFoundPage}/>
        </Switch>
    </Router>
}
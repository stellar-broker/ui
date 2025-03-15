import React from 'react'
import {Route, Router, Switch} from 'react-router'
import AdminRouter from './admin-router'
import PartnerRouter from './partner-router'
import RequestAccessPage from './pages/request-access-page'
import MainPage from './pages/main-page'
import NotFoundPage from './pages/not-found-page'
import SignInPage from './pages/sign-in-page'
import PasswordRecoveryPage from './pages/password-recovery-page'

function AppRouter({history}) {
    return <Router history={history}>
        <Switch>
            <Route path="/admin" component={AdminRouter}/>
            <Route path="/account" component={PartnerRouter}/>
            <Route path="/request-access" exact component={RequestAccessPage}/>
            <Route path="/sign-in" exact component={SignInPage}/>
            <Route path="/password-recovery/:id" exact component={PasswordRecoveryPage}/>
            <Route path="/" exact component={MainPage}/>
            <Route path="*" component={NotFoundPage}/>
        </Switch>
    </Router>
}

export default AppRouter
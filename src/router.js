import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminRouter from './admin-router'
import PartnerRouter from './partner-router'
import RequestAccessPage from './pages/request-access-page'
import MainPage from './pages/main-page'
import NotFoundPage from './pages/not-found-page'
import SignInPage from './pages/sign-in-page'
import PasswordRecoveryPage from './pages/password-recovery-page'

function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path="/admin/*" element={<AdminRouter/>}/>
            <Route path="/account/*" element={<PartnerRouter/>}/>
            <Route path="/request-access" exact element={<RequestAccessPage/>}/>
            <Route path="/sign-in" exact element={<SignInPage/>}/>
            <Route path="/password-recovery/:id" exact element={<PasswordRecoveryPage/>}/>
            <Route path="/" exact element={<MainPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </BrowserRouter>
}

export default AppRouter
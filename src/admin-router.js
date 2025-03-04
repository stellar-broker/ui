import React from 'react'
import {Route, Routes} from 'react-router-dom'
import AuthLayout from './layout/auth-layout'
import AdminLayout from './layout/admin-layout'
import AdminDashboardPage from './pages/admin/admin-dashboard-page'
import AdminPartnersPage from './pages/admin/admin-partners-page'
import AdminPartnerEditPage from './pages/admin/admin-partner-edit-page'
import AdminSetPasswordView from './admin/partners/admin-set-password-view'

function AdminRouter() {
    return <AuthLayout role="admin">
        <AdminLayout role="admin">
            <Routes>
                <Route path="/partners/add" element={<AdminPartnerEditPage/>}/>
                <Route path="/partners/edit/:id/password" element={<AdminSetPasswordView/>}/>
                <Route path="/partners/edit/:id" element={<AdminPartnerEditPage/>}/>
                <Route path="/partners" element={<AdminPartnersPage/>}/>
                <Route path="" element={<AdminDashboardPage/>}/>
            </Routes>
        </AdminLayout>
    </AuthLayout>
}

export default AdminRouter
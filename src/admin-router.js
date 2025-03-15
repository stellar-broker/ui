import React from 'react'
import {Route, Switch} from 'react-router'
import {setPageNoIndex} from './utils/meta-tags-generator'
import AuthLayout from './layout/auth-layout'
import AdminLayout from './layout/admin-layout'
import AdminDashboardPage from './pages/admin/admin-dashboard-page'
import AdminPartnersPage from './pages/admin/admin-partners-page'
import AdminPartnerEditPage from './pages/admin/admin-partner-edit-page'
import AdminSetPasswordView from './admin/partners/admin-set-password-view'
import AdminLogsPage from './pages/admin/admin-logs-page'
import NotFoundPage from './pages/not-found-page'

function AdminRouter({match}) {
    const {path} = match
    setPageNoIndex(true)

    return <AuthLayout role="admin">
        <AdminLayout role="admin">
            <Switch>
                <Route path={`${path}partners/add`} component={AdminPartnerEditPage}/>
                <Route path={`${path}/partners/edit/:id/password`} component={AdminSetPasswordView}/>
                <Route path={`${path}/partners/edit/:id`} component={AdminPartnerEditPage}/>
                <Route path={`${path}/partners`} component={AdminPartnersPage}/>
                <Route path={`${path}/logs`} component={AdminLogsPage}/>
                <Route path={`${path}/`} exact component={AdminDashboardPage}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </AdminLayout>
    </AuthLayout>
}

export default AdminRouter
import React from 'react'
import {Route, Switch} from 'react-router'
import AdminLayout from './layout/admin-layout'
import AuthLayout from './layout/auth-layout'
import PartnerDashboardPage from './pages/partner/partner-dashboard-page'
import PartnerTransactionsPage from './pages/partner/partner-transactions-page'
import PartnerSettingsPage from './pages/partner/partner-settings-page'
import PartnerApiKeysPage from './pages/partner/partner-api-keys-page'
import PartnerPayoutsPage from './pages/partner/partner-payouts-page'
import NotFoundPage from './pages/not-found-page'

export default function PartnerRouter({match}) {
    const {path} = match
    return <AuthLayout role="partner">
        <AdminLayout>
            <Switch>
                <Route path={`${path}/transactions`} component={PartnerTransactionsPage}/>
                <Route path={`${path}/payouts`} component={PartnerPayoutsPage}/>
                <Route path={`${path}/api-keys`} component={PartnerApiKeysPage}/>
                <Route path={`${path}/settings`} component={PartnerSettingsPage}/>
                <Route path={`${path}/`} component={PartnerDashboardPage}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </AdminLayout>
    </AuthLayout>
}
import React from 'react'
import {Route, Routes} from 'react-router-dom'
import AdminLayout from './layout/admin-layout'
import AuthLayout from './layout/auth-layout'
import PartnerDashboardPage from './pages/partner/partner-dashboard-page'
import PartnerTransactionsPage from './pages/partner/partner-transactions-page'
import PartnerSettingsPage from './pages/partner/partner-settings-page'
import PartnerApiKeysPage from './pages/partner/partner-api-keys-page'
import PartnerPayoutsPage from './pages/partner/partner-payouts-page'

function PartnerRouter() {
    return <AuthLayout role="partner">
        <AdminLayout>
            <Routes>
                <Route path="" element={<PartnerDashboardPage/>}/>
                <Route path="transactions" element={<PartnerTransactionsPage/>}/>
                <Route path="payouts" element={<PartnerPayoutsPage/>}/>
                <Route path="api-keys" element={<PartnerApiKeysPage/>}/>
                <Route path="settings" element={<PartnerSettingsPage/>}/>
            </Routes>
        </AdminLayout>
    </AuthLayout>
}

export default PartnerRouter
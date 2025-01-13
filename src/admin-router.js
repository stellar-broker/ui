import React from 'react'
import {Route, Routes} from 'react-router-dom'
import AdminDashboardPage from './pages/admin/admin-dashboard-page'
import AdminPartnersPage from './pages/admin/admin-partners-page'

function AdminRouter() {
    return <Routes>
        <Route path="" element={<AdminDashboardPage/>}/>
        <Route path="/partners" element={<AdminPartnersPage/>}/>
    </Routes>
}

export default AdminRouter
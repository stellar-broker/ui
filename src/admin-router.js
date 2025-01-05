import React from 'react'
import {Route, Routes} from 'react-router-dom'
import AdminDashboardPage from './pages/admin/admin-dashboard-page'

function AdminRouter() {
    return <Routes>
        <Route path="" element={<AdminDashboardPage/>}/>
    </Routes>
}

export default AdminRouter
import React from 'react'
import AdminRouter from '../admin-router'
import PartnerRouter from '../partner-router'
import SidebarView from '../components/sidebar-view'
import AdminSidebarView from '../components/admin-sidebar-view'
import AuthLayout from './auth-layout'
import '../styles/dashboard.scss'

function AdminLayout({role}) {
    return <AuthLayout>
        {role === 'admin' ? <div className="dual-layout">
            <AdminSidebarView/>
            <div className="content w-100"><AdminRouter/></div>
        </div> : <div className="dual-layout">
            <SidebarView/>
            <div className="content w-100"><PartnerRouter/></div>
        </div>}
    </AuthLayout>
}

export default AdminLayout
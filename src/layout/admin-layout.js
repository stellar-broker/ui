import React from 'react'
import AdminRouter from '../admin-router'
import PartnerRouter from '../partner-router'
import AuthLayout from './auth-layout'
import SidebarView from '../components/sidebar-view'
import '../styles/dashboard.scss'

function AdminLayout({role}) {
    return <AuthLayout>
        <div className="dual-layout">
            <SidebarView/>
            <div className="content w-100">
                {role === 'admin' ? <AdminRouter/> : <PartnerRouter/>}
            </div>
        </div>

    </AuthLayout>
}

export default AdminLayout
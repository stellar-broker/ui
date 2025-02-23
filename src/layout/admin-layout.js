import React from 'react'
import AdminRouter from '../admin-router'
import PartnerRouter from '../partner-router'
import PartnerSidebarView from '../components/partner-sidebar-view'
import AdminSidebarView from '../components/admin-sidebar-view'
import AuthLayout from './auth-layout'
import '../styles/dashboard.scss'

function AdminLayout({role}) {
    return <AuthLayout>
        <div className="dual-layout mobile-flex-wrap">
            {role === 'admin' ? <>
                <AdminSidebarView/>
                <div className="content w-100"><AdminRouter/></div>
            </> : <>
                <PartnerSidebarView/>
                <div className="content w-100"><PartnerRouter/></div>
            </>}
        </div>
    </AuthLayout>
}

export default AdminLayout
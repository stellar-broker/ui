import React from 'react'
import PartnerSidebarView from '../partner/partner-sidebar-view'
import AdminSidebarView from '../admin/admin-sidebar-view'
import '../styles/dashboard.scss'

function AdminLayout({role, children}) {
    return <div className="dual-layout mobile-flex-wrap">
        {role === 'admin' ? <AdminSidebarView/> : <PartnerSidebarView/>}
        <div className="content w-100">
            {children}
        </div>
    </div>
}

export default AdminLayout
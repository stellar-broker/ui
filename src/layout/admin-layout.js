import React from 'react'
import PartnerSidebarView from '../partner/partner-sidebar-view'
import AdminSidebarView from '../admin/admin-sidebar-view'
import PageLayout from './page-layout'
import '../styles/dashboard.scss'

function AdminLayout({role, children}) {
    return <PageLayout compact>
        <div className="dual-layout mobile-flex-wrap bg-color-white">
            {role === 'admin' ? <AdminSidebarView/> : <PartnerSidebarView/>}
            <div className="content w-100">
                {children}
            </div>
        </div>
    </PageLayout>
}

export default AdminLayout
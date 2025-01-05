import React from 'react'
import Footer from './footer'

export default function PageLayout({children}) {
    return <div className="page-wrapper">
        <div className="container" style={{minHeight: '90vh'}}>
            {children}
        </div>
        <Footer/>
    </div>
}
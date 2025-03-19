import React from 'react'
import cn from 'classnames'
import Footer from './footer'

export default function PageLayout({compact, children}) {
    return <div className="page-wrapper">
        <div className={cn('container', {'no-padding': compact})} style={{minHeight: '90vh'}}>
            {children}
        </div>
        {!compact && <Footer/>}
    </div>
}
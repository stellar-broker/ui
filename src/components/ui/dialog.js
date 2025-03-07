import React from 'react'

export const Dialog = React.memo(function Dialog({dialogOpen, className, children}) {
    if (!dialogOpen)
        return null
    return <div className={`dialog ${className}`}>
        <div className="dialog-backdrop"/>
        <div className="dialog-content container">
            <div className="container">
                {children}
            </div>
        </div>
    </div>
})
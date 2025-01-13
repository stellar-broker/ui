import React from 'react'
import {CopyToClipboard as Copy} from 'react-copy-to-clipboard'

export const CopyToClipboard = React.memo(function CopyToClipboard({text, children, title = 'Copy to clipboard'}) {
    return <Copy text={text}>
        {children ? children : <a href="#" className="icon-copy active-icon" title={title}/>}
    </Copy>
})
import React from 'react'
import cn from 'classnames'
import './button.scss'
import {Link} from 'react-router-dom'

export const Button = React.memo(function Button({href, onClick, block, outline, clear, stackable, small, disabled, className, children, ...op}) {
    const c = cn('button', {
        small,
        disabled,
        'button-block': block,
        'button-outline': outline,
        'button-clear': clear,
        stackable
    }, className)
    const props = {className: c, onClick, ...op}
    if (href) {
        // props.onClick = function (e) {
        //     e.preventDefault()
        //     return false
        // }
        return <Link to={href} {...props}>{children}</Link>
    }
    if (disabled) {
        props.disabled = true
    }
    return <button {...props}>{children}</button>
})
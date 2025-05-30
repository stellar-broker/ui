import React from 'react'
import cn from 'classnames'
import './button.scss'

export const Button = React.memo(function Button({
                                                     href,
                                                     onClick,
                                                     block,
                                                     outline,
                                                     secondary,
                                                     white,
                                                     clear,
                                                     stackable,
                                                     small,
                                                     disabled,
                                                     className,
                                                     children,
                                                     ...op}) {
    const c = cn('button', {
        small,
        disabled,
        'button-block': block,
        'button-outline': outline,
        'button-secondary': secondary,
        'button-white': white,
        'button-clear': clear,
        stackable
    }, className)
    const props = {className: c, onClick, ...op}
    if (href) {
        // props.onClick = function (e) {
        //     e.preventDefault()
        //     return false
        // }
        return <a href={href} {...props}>{children}</a>
    }
    if (disabled) {
        props.disabled = true
    }
    return <button {...props}>{children}</button>
})
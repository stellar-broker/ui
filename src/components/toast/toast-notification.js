import React, {useCallback, useEffect, useState} from 'react'
import cn from 'classnames'

const contextIcon = {
    'info': 'icon-info',
    'success': 'icon-ok',
    'warning': 'icon-warning',
    'error': 'icon-warning'
}

function ToastNotification({notification}) {
    const {type = 'info'} = notification
    const [isClosing, setIsClosing] = useState(false)
    const close = useCallback(function () {
        if (notification.deleted)
            return
        setIsClosing(closing => {
            if (closing)
                return closing
            setTimeout(() => notification.delete(), 300)
            return true
        })
    }, [notification])

    const pauseTimer = useCallback(() => {
        notification.pauseTimer()
    }, [notification])

    const resumeTimer = useCallback(() => {
        notification.resumeTimer(close)
    }, [notification, close])

    useEffect(() => {
        notification.timer = setTimeout(close, notification.remaining)
    }, [notification, close])

    const notificationClass = cn('toast-notification segment', type, {'slide-in': !isClosing, 'slide-out': isClosing})
    return <div className={notificationClass} onMouseEnter={pauseTimer} onMouseLeave={resumeTimer}>
        <i className={cn('toast-notification-icon', contextIcon[type])}/>
        <div>{notification.message}</div>
        <a href="#" className="toast-notification-icon icon-cancel" onClick={close}/>
        <div className="lifetime" style={{animationDuration: notification.ttl + 'ms'}}/>
    </div>
}

export default ToastNotification
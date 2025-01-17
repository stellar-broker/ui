import React, {useCallback, useEffect, useState} from 'react'
import {render} from 'react-dom'
import ToastNotificationInstance from './toast-notification-instance'
import Notification from './toast-notification'
import './toast-notifications.scss'

let notificationsCounter = 0

/**
 * Initialize toast notifications, add toast notifications container to the DOM, and expose notify() global function
 * @return {HTMLDivElement}
 */
export function createToastNotificationsContainer() {
    const container = document.createElement('div')
    document.body.appendChild(container)
    render(<ToastNotificationsBlock/>, container)
    return container
}

function ToastNotificationsBlock() {
    const [notifications, setNotifications] = useState([])

    const deleteNotification = useCallback(function (id) {
        setNotifications(prev => {
            const pos = prev.findIndex(v => v.id === id)
            if (pos < 0)
                return prev
            const res = [...prev]
            res.splice(pos, 1)
            return res
        })
    }, [])

    useEffect(() => {
        //declare globally available notify() function
        window.notify = function ({type, message}) {
            const newNotification = new ToastNotificationInstance({
                type,
                message,
                id: ++notificationsCounter,
                onDelete: deleteNotification
            })
            setNotifications(prevNotifications => [newNotification, ...prevNotifications])
        }
        //set empty callback on unload
        return () => {
            window.notify = function () {
            }
        }
    }, [])

    return <div className="toast-notifications-container">
        {notifications.map(props => <Notification key={props.id} notification={props}/>)}
    </div>
}
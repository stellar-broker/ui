import React from 'react'
import {render} from 'react-dom'
import {createToastNotificationsContainer} from './components/toast/toast-notifications-block'
import Router from './router'
import './styles/styles.scss'

const appContainer = document.getElementById('root')

createToastNotificationsContainer()

render(<Router/>, appContainer)
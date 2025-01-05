import React from 'react'
import {render} from 'react-dom'
import Router from './router'
import './styles/styles.scss'

const appContainer = document.getElementById('root')

render(<Router/>, appContainer)

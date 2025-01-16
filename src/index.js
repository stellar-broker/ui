import React from 'react'
import {render} from 'react-dom'
import Router from './router'
import './styles/styles.scss'

const appContainer = document.getElementById('root')

bindClickNavHandler(appContainer)

render(<Router/>, appContainer)

function bindClickNavHandler(container) {
    container.addEventListener('click', e => {
        if (e.ctrlKey) return
        let link = e.target
        while (link && !(link.tagName === 'A' && link.href)) {
            link = link.parentElement
        }
        if (link) {
            const href = link.getAttribute('href')
            if (link.target === '_blank' || !href) return
            if (href === '#') return e.preventDefault()
            if (window.parent !== window) {
                window.top.location = /^(https?):\/\//.test(href) ? href : (window.origin + href)
                return e.preventDefault()
            }
            if (link.classList.contains('external-link')) return
            if (/^(mailto:|tel:|(https?):\/\/)/.test(href)) return

            const [pathAndQuery] = href.split('#')

            if (!pathAndQuery || (location.pathname + location.search) === pathAndQuery)
                return e.preventDefault()
            if (link.classList.contains('static-link'))
                return e.preventDefault()
            //history.pushState({}, null, href)
            //e.preventDefault()
            //window.scrollTo(0, 0)
        }
    })
}
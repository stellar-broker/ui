import React from 'react'
import {setPageMetadata} from '../utils/meta-tags-generator'

export default function NotFoundPage() {
    setPageMetadata({
        title: 'Page not found',
        description: 'Sorry, the page you are looking for was not found. Start over from the home page.',
        customMeta: {
            locator: 'name',
            tags: [
                {name: 'prerender-status-code', content: '404'}
            ]
        }
    })

    return <div className="row double-space" style={{height: '50vh'}}>
        <div className="column column-33 column-offset-34 column-center text-center">
            <h2>404<br/>PAGE NOT FOUND</h2>
            <div className="space">
                Sorry, the page you are looking for was not found.
                Start over from the <a href="/">home page</a>
            </div>
        </div>
    </div>
}
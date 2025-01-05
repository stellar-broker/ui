import React from 'react'

export default function NotFoundPage() {
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
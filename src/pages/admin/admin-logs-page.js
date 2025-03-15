import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import LogsView from '../../admin/logs/logs-view'

export default function AdminLogsPage() {
    setPageMetadata({
        title: 'Admin logs',
        description: 'System errors and warnings'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Admin logs</h4>
                <p className="text-small dimmed nano-space">System errors and warnings</p>
            </div>
        </div>
        <div className="hr space"/>
        <LogsView/>
    </div>
}
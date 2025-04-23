import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import LogsView from '../../admin/logs/logs-view'

export default function AdminLogsPage() {
    setPageMetadata({
        title: 'System logs',
        description: 'System errors and warnings'
    })

    return <div>
        <h3>System logs</h3>
        <p className="text-small dimmed space">System errors and warnings</p>
        <div className="hr space"/>
        <LogsView/>
    </div>
}
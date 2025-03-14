import React from 'react'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import LogsView from '../../admin/logs/logs-view'

function AdminLogsPage() {
    setPageMetadata({
        title: 'Admin logs',
        description: 'Report logs.'
    })

    return <div>
        <div className="row nano-space">
            <div className="column column-75">
                <h4>Admin logs</h4>
                <p className="text-small dimmed nano-space">Report logs</p>
            </div>
        </div>
        <div className="hr space"/>
        <LogsView/>
    </div>
}

export default AdminLogsPage
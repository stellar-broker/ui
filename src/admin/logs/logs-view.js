import {useCallback, useState} from 'react'
import {formatDateUTC} from '@stellar-expert/formatter'
import {usePaginatedApi} from '../../utils/hooks/paginated-list-hooks'
import {navigation} from '../../utils/navigation'
import {Loader} from '../../components/ui/loader'
import {Button} from '../../components/ui/button'
import FilterTagsView from './filter-tags-view'

export default function LogsView() {
    const [filters, setFilters] = useState({topic: navigation.query.topic})
    const logs = usePaginatedApi(
        {
            path: 'admin/logs',
            query: {
                ...filters,
                cursor: navigation.query.cursor
            }
        }, {
            autoReverseRecordsOrder: true,
            limit: 20,
            defaultQueryParams: {order: 'desc'}
        })

    const navigate = useCallback((page) => {
        logs.load(page)
    }, [])

    if (!logs.loaded) return <Loader/>

    return <div>
        <div className="table space swaps-history">
            <div className="table-header">
                <FilterTagsView selectTag={setFilters}/>
            </div>
            <table>
                <thead className="text-tiny dimmed">
                <tr>
                    <th>Message</th>
                    <th className="desktop-center" >Topic</th>
                    <th className="desktop-right">Date</th>
                </tr>
                </thead>
                <tbody>
                {logs.data?.map(log => <LogRecord log={log} key={log.paging_token}/>)}
                </tbody>
            </table>
            {!logs.data.length && <p className="empty-data">No matching entries found</p>}
        </div>
        <div className="button-group space text-center">
            <Button small disabled={logs.loading || !logs.canLoadPrevPage} onClick={() => navigate(-1)}>Prev Page</Button>
            <Button small disabled={logs.loading || !logs.canLoadNextPage} onClick={() => navigate(1)}>Next Page</Button>
        </div>
    </div>
}

function LogRecord({log}) {
    return <tr>
        <td data-header="Message: ">{log.message}</td>
        <td className="desktop-center" data-header="Topic: ">
            <span className="badge">{log.topic}</span>
        </td>
        <td className="desktop-right" data-header="Date: ">{formatDateUTC(log.date)}</td>
    </tr>
}
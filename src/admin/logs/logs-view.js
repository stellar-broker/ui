import {useCallback, useState} from 'react'
import {formatDateUTC} from '@stellar-expert/formatter'
import cn from 'classnames'
import {usePaginatedApi} from '../../utils/hooks/paginated-list-hooks'
import {navigation} from '../../utils/navigation'
import {Loader} from '../../components/ui/loader'
import {Button} from '../../components/ui/button'
import LogTopicsView from './log-topics-view'

export default function LogsView() {
    const [topicFilter, setTopicFilter] = useState(navigation.query.topic)
    const logs = usePaginatedApi(
        {
            path: 'admin/logs',
            query: {
                topic: topicFilter,
                cursor: navigation.query.cursor
            }
        }, {
            autoReverseRecordsOrder: true,
            limit: 20,
            defaultQueryParams: {order: 'desc'}
        })

    const navigate = useCallback((page) => logs.load(page), [])

    const onChangeTopic = useCallback(e => {
        const {topic} = e.target.dataset
        setTopicFilter(prev => topic === prev ? '' : topic)
    }, [setTopicFilter])

    if (!logs.loaded)
        return <Loader/>

    return <div>
        <LogTopicsView onChangeTopic={onChangeTopic} className="mini-space"/>
        <div className="table compact space swaps-history text-small">
            <table>
                <thead className="text-tiny dimmed">
                <tr>
                    <th>Log data</th>
                    <th className="desktop-right">Timestamp</th>
                </tr>
                </thead>
                <tbody className="font-mono">
                {logs.data?.map(log => <LogRecord key={log.paging_token} log={log} onChangeTopic={onChangeTopic}/>)}
                </tbody>
            </table>
            {!logs.data.length && <p className="empty-data">No matching entries found</p>}
        </div>
        <div className="button-group space text-center">
            <Button small secondary disabled={logs.loading || !logs.canLoadPrevPage} onClick={() => navigate(-1)}>Previous</Button>
            <Button small secondary disabled={logs.loading || !logs.canLoadNextPage} onClick={() => navigate(1)}>Next</Button>
        </div>
    </div>
}

function LogRecord({log, onChangeTopic}) {
    return <tr>
        <td data-header="Log: " className="word-break">
            <div className={cn({error: log.topics.includes('error')})}>
                {log.message}
                <span className="mobile-only">&emsp;</span>
            </div>
            <div>
                {log.topics.map(topic =>
                    <a key={topic} href="#" data-topic={topic} onClick={onChangeTopic}
                       className={cn('badge info text-tiny', {'error': topic === 'error', 'warning': topic === 'warn'})}>{topic}</a>)}
            </div>
        </td>
        <td className="desktop-right nowrap" data-header="Timestamp: ">{formatDateUTC(log.ts)}</td>
    </tr>
}
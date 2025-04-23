import React from 'react'
import cn from 'classnames'
import {navigation} from '../../utils/navigation'

const topics = ['error', 'warn', 'api', 'loader', 'perf', 'matcher', 'session', 'system', 'tx']

export default function LogTopicsView({onChangeTopic, className}) {
    return <div className={className}>
        <span className="text-small dimmed-light">Filter:</span>&emsp;
        {topics.map(topic => <a key={topic} href="#" data-topic={topic} onClick={onChangeTopic}
                                className={cn('badge badge-outline', {'selected': navigation.query.topic === topic})}>{topic}</a>)}
    </div>
}
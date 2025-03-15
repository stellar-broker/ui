import React from 'react'
import cn from 'classnames'
import {navigation} from '../../utils/navigation'

const topics = ['error', 'warn', 'api', 'loader', 'perf', 'matcher', 'session', 'system', 'tx']

export default function LogTopicsView({onChangeTopic}) {
    return <div>Filter:&nbsp;
        {topics.map(topic => <a key={topic} href="#" data-topic={topic} onClick={onChangeTopic}
                                className={cn('badge', {'selected': navigation.query.topic === topic})}>{topic}</a>)}
    </div>
}
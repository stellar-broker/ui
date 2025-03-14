import React, {useCallback} from 'react'
import cn from 'classnames'
import {navigation} from '../../utils/navigation'

const topics = ['error', 'warn', 'api', 'loader', 'perf', 'matcher', 'session', 'system', 'tx']

export default function FilterTagsView({selectTag}) {
    return <div>Filters:&emsp;
        {topics.map(tag => <TagView key={tag} name={tag} selected={navigation.query.topic === tag} onSelect={selectTag}/>)}
    </div>
}

function TagView({name, selected, onSelect}) {
    const selectTag = useCallback(() => {
        onSelect({topic: selected ? null : name})
    }, [name, selected])

    return <a href="#" className={cn('badge', {'selected': selected})} style={{margin: '0.25em 0.5em 0.25em 0'}} onClick={selectTag}>
        {name}
    </a>
}
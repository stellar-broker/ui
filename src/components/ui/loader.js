import cn from 'classnames'
import './loader.scss'

export function Loader({large, inline, micro}) {
    return <div className={cn('loader', {large, inline, micro})}/>
}
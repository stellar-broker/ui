import React, {useCallback, useEffect, useState} from 'react'
import cn from 'classnames'
import './accordion.scss'

/**
 * Group of collapsible panels
 * @param {{key: [String], title: String|JSX.Element, content:*}[]} options - Accordion options
 * @param {{}} otherProps
 */
export function Accordion({options, ...otherProps}) {
    const [selectedOption, setSelectedOption] = useState()
    useEffect(() => {
        const firstOption = options[0]
        setSelectedOption(firstOption.key || firstOption.title)
    }, [options])
    const changeSelected = useCallback(e => setSelectedOption(e.currentTarget.dataset.key), [options])
    return <div className="accordion" {...otherProps}>
        {options.map(({key, title, content}) => {
            const expanded = key ?
                selectedOption === key :
                selectedOption === title
            return <div key={key || title} className={cn('option', {expanded})}>
                <div className="accordion-header" data-key={key || title}
                     onClick={changeSelected}>
                    {title || key}
                </div>
                <div className="accordion-collapse">
                    <div className="accordion-body text-tiny dimmed-light">
                        {content}
                    </div>
                </div>
            </div>
        })}
    </div>
}
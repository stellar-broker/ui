import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {throttle} from 'throttle-debounce'
import cn from 'classnames'
import {useDependantState} from '../../utils/hooks/dependant-state'
import './dropdown.scss'

export const Dropdown = React.memo(function Dropdown({
                                                         options,
                                                         title,
                                                         value,
                                                         disabled,
                                                         className,
                                                         onChange,
                                                         hint,
                                                         showToggle,
                                                         solo,
                                                         hideSelected,
                                                         header,
                                                         footer,
                                                         expanded,
                                                         onScroll,
                                                         onOpen,
                                                         onClose,
                                                         maxHeight
                                                     }) {
    const headerRef = useRef()
    const listRef = useRef()
    const [listOpen, updateListOpen] = useState(false)
    const [alignRight, setAlignRight] = useState(false)
    //collapse dropdown handler
    const collapseDropdown = useCallback(function () {
        updateListOpen(open => {
            if (!open)
                return false
            onClose?.call(this, this)
            return false
        })
    }, [onClose])

    //collapse dropdown list on click
    const [selectedValue, updateSelectedValue] = useDependantState(() => {
        if (listOpen) {
            setTimeout(() => {
                document.addEventListener('click', collapseDropdown)
            }, 200)
        }
        return value
    }, [value, listOpen], () => {
        document.removeEventListener('click', collapseDropdown)
    })

    //close/open dropdown on header click
    const toggleList = useCallback(function toggleList(e) {
        e && e.nativeEvent.stopImmediatePropagation()
        updateListOpen(prevState => {
            if (disabled)
                return false;
            (prevState ? onClose : onOpen)?.call(this, this)
            return !prevState
        })
    }, [disabled, onClose, onOpen])

    //handle item select action
    const select = useCallback(function (option) {
        collapseDropdown()
        if (disabled)
            return
        onChange && onChange(option.value === undefined ? option : option.value)
        updateSelectedValue(option)
    }, [collapseDropdown, onChange])

    //handle user scroll action for infinity scroll support
    const scrollList = useMemo(() => throttle(200, e => {
        if (!onScroll)
            return
        const {target} = e
        const pos = {position: target.scrollTop, rel: 'middle'}
        if (target.scrollTop === 0)
            return onScroll({...pos, rel: 'top'})
        if (Math.ceil(target.scrollHeight - target.scrollTop - 8) < target.clientHeight)
            return onScroll({...pos, rel: 'bottom'})
        onScroll(pos)
    }), [onScroll])

    //locate currently selected option
    const {option: selectedItem, isDefault} = getSelectedOption([value, selectedValue], options)

    //check dropdown container alignment
    if (listOpen) {
        setTimeout(() => setAlignRight(isAlignedRight(listRef.current)), 200)
    }
    //show a dropdown after the initial render
    useEffect(() => {
        if (expanded === true) {
            setTimeout(() => updateListOpen(true), 200)
        }
    }, [])

    const ddTitle = title || selectedItem?.title || selectedItem?.value || selectedItem

    return <div className={cn('dd-wrapper', {disabled}, className)} title={hint}>
        <a href="#" className="dd-header" onClick={toggleList} ref={headerRef}>
            {ddTitle}{!!showToggle && <span className={cn('dd-toggle', {visible: listOpen})}/>}
        </a>
        {!!listOpen && createPortal(<div className={className}>
            <div className={cn('dd-backdrop', {solo})}/>
            <div className={cn('dd-list', {solo, visible: listOpen && !disabled, 'align-right': alignRight})}
                 style={getListPosition(headerRef.current, solo)} ref={listRef}>
                {!!header && <>
                    <div className="dd-list-header" onClick={preventClosing}>{header}</div>
                </>}
                <ul onScroll={scrollList} style={{maxHeight: `min(70vh, ${maxHeight})`}}>
                    {options.filter(opt => !opt.hidden).map((option, i) => {
                        if (option === '-') return <li className="dd-list-item" key={i + '-'}>
                            <hr className="hr"/>
                        </li>
                        const key = option.value || option.href || option
                        const isSelected = !isDefault && option === selectedItem
                        const style = isSelected && hideSelected ? {display: 'none'} : {}
                        return <DropdownOption {...{key, option, select, isSelected, style}} />
                    })}
                </ul>
                {!!footer && <>
                    <hr/>
                    <div className="dd-list-footer" onClick={preventClosing}>{footer}</div>
                </>}
            </div>
        </div>, document.body)}
    </div>
})

const DropdownOption = React.memo(function DropdownOption({option, isSelected, select, style}) {
    let {value, title, href, className} = option
    if (typeof option === 'string') {
        value = title = option
    }
    if (!title) {
        title = value
    }

    const selectOption = useCallback(function (e) {
        if (option.disabled) {
            e.stopPropagation()
            return
        }
        if (!option.href) {
            e.preventDefault()
        }
        select(option)
    }, [select, option])

    return <li className="dd-list-item" key={value || href} onClick={selectOption} style={style}>
        <a href={href || '#'} className={cn({className, selected: isSelected})}>{title}</a>
    </li>
})

function getSelectedOption(values, options) {
    for (let v of values) {
        if (v !== null && v !== undefined) {
            const option = options.find(item => item === v || item.value === v)
            if (option) return {option, isDefault: false}
        }
    }
    return {option: options.find(opt => typeof opt === 'string' || !opt.disabled), isDefault: true}
}

function getListPosition(header, solo) {
    if (solo || !header)
        return undefined
    const rect = header.getBoundingClientRect()
    return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
    }
}

function isAlignedRight(list) {
    if (!list)
        return
    const rect = list.getBoundingClientRect()
    return window.innerWidth - rect.right < 0 && rect.left - rect.width >= 0
}

function preventClosing(e) {
    e.stopPropagation()
}

Dropdown.defaultProps = {
    showToggle: true,
    disabled: false,
    hideSelected: false,
    solo: false,
    maxHeight: '35em'
}
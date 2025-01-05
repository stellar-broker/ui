import {useEffect, useRef, useState} from 'react'
import isEqual from 'react-fast-compare'

export function useDependantState(stateInitializer, dependencies, finalizer) {
    //ensureDependencies(dependencies)
    const [state, updateState] = useState(function () {
        return typeof stateInitializer === 'function' ? stateInitializer(dependencies) : stateInitializer
    })
    //pin dependencies object to invoke effect update only if dependencies changed
    const pinnedDeps = useRef(dependencies)
    let dependenciesChanged = !isEqual(dependencies, pinnedDeps.current)
    //check that dependencies really changed
    if (dependenciesChanged) {
        pinnedDeps.current = dependencies
    }

    //effect invokes the initializer each time dependencies changed
    useEffect(function () {
        //check that dependencies really changed
        if (dependenciesChanged) {
            //re-initialize state when any of the dependencies changed
            updateState(typeof stateInitializer === 'function' ? stateInitializer(dependencies, state) : stateInitializer)
        }
        return finalizer || undefined
    }, pinnedDeps.current)

    return [state, function (newState) {
        //use deep compare - as React used to in good old times
        updateState(current => {
            if (typeof newState === 'function') {
                newState = newState(current)
            }
            if (isEqual(current, newState)) return current
            return newState
        })
    }]
}
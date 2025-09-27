import React, {useCallback} from 'react'
import {Button} from './button'

export function PaginationNavigation({data}){
    return <div className="button-group space text-center">
        <PageNavButton data={data} direction={-1}>Prev Page</PageNavButton>
        <PageNavButton data={data} direction={1}>Next Page</PageNavButton>
    </div>
}

function PageNavButton({data, direction, children}) {
    const navigate = useCallback(e => {
        e.preventDefault()
        const direction = parseInt(e.target.dataset.direction)
        data.load(direction)
        return false
    }, [data])
    const disabled = data.loading ||
        !(direction === 1 ? data.canLoadNextPage : data.canLoadPrevPage)
    return <Button small secondary disabled={disabled} data-direction={direction} onClick={navigate}>
        {children}
    </Button>
}
import React, {useCallback, useEffect, useState} from 'react'
import './swap-widget.scss'
import {Button} from '../components/ui/button'
import {AssetSelector} from '../components/ui/asset-selector'
import {fetchExplorerApi} from '../utils/fetch-explorer-api'

export const SwapWidget = function SmartSwapWidget({className}) {
    const [selling, setSelling] = useState()
    const [buying, setBuying] = useState()

    useEffect(() => {
        fetchExplorerApi('asset/XLM')
            .then(res => {
                console.log(res)
            })
    }, [])

    return <div className={`swap-widget ${className}`}>
        <SwapAmount className="nano-space" placeholder="From" onChange={setSelling} defaultAmount="100,000"/>
        <div className="flex-center nano-space"><i className="icon-arrow-down dimmed"/></div>
        <SwapAmount className="space" placeholder="To (estimated)" onChange={setBuying} defaultAmount="12,574,100.32" defaultAsset="AQUA"/>
        <div style={{paddingLeft: '0.5em'}}>
            <div className="dimmed text-small micro-space">1 AQUA = 0,0079528 XLM</div>
            <div className="dual-layout middle micro-space text-small">
                <div className="dimmed">Max slippage</div>
                <span>0.2%</span>
            </div>
            <div className="dual-layout middle micro-space text-small">
                <div className="dimmed">Price impact</div>
                <span>{'<0.1%'}</span>
            </div>
            <div className="dual-layout middle">
                <div className="dimmed text-small">Savings</div>
                <div>
                    <span className="color-primary text-small">+1,207.14 AQUA</span>
                    <Button small style={{margin: '0 0 0 1em'}} onClick={initSwap}>Swap using this quote</Button>
                </div>
            </div>
        </div>
    </div>
}

function initSwap() {
    alert(`Swaps are currently disabled in demo mode.\nStay tuned, we are going live soon!`)
}

function SwapAmount({onChange, placeholder, className, defaultAmount, defaultAsset}) {
    const [amount, setAmount] = useState(defaultAmount)
    const [asset, setAsset] = useState(defaultAsset)

    const changeAmount = useCallback(e => {
        const val = e.target.value.replace(/[^\d.]/g, '')
        setAmount(val)
        onChange(val)
    }, [onChange])

    return <div className={`asset-value ${className}`}>
        <div className="label text-tiny">{placeholder}</div>
        <input value={amount || ''} readOnly onChange={changeAmount}/>
        <AssetSelector value={asset} onChange={setAsset}/>
    </div>
}
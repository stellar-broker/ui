import React, {useCallback, useEffect, useState} from 'react'
import {fromStroops, toStroops} from '@stellar-expert/formatter'
import {Button} from '../components/ui/button'
import {AssetSelector} from '../components/ui/asset-selector'
import SwapWidgetSettings from './swap-widget-settings'
import './swap-widget.scss'

export const SwapWidget = function SmartSwapWidget({className}) {
    const [update, setUpdate] = useState(0)
    const refresh = useCallback(() => setUpdate(v => ++v), [setUpdate])
    const [settings] = useState(() => {
        const settings = new SwapWidgetSettings(refresh)
        settings.asset = ['XLM', 'AQUA-GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA-1']
        settings.amount = ['1000', '']
        settings.recalculateSwap()
        return settings
    })
    let change
    let diff
    if (settings.direct) {
        change = fromStroops(toStroops(settings.amount[1]) - toStroops(settings.direct))
        diff = (((settings.amount[1] / settings.direct) - 1) * 100).toPrecision(3) + '%'
    }

    return <div className={`swap-widget ${className}`}>
        <SwapAmount className="nano-space" placeholder="From" onChange={v => settings.setAmount(v)} amount={settings.amount[0]}
                    asset={settings.asset[0]} onAssetChange={v => settings.setSellingAsset(v)}/>
        <div className="flex-center nano-space"><i className="icon-arrow-down dimmed"/></div>
        <SwapAmount className="space" placeholder="To (estimated)" amount={settings.amount[1]}
                    asset={settings.asset[1]} onAssetChange={v => settings.setBuyingAsset(v)}/>
        <div style={{paddingLeft: '0.5em'}}>
            {settings.message ? <div className="dimmed text-small">
                <i className="icon-warning"/> {settings.message}
            </div> : <div className="dual-layout middle">
                <div className="dimmed text-small">
                    {change > 0 && <div style={{margin: '0.5em 0'}}>
                        Savings: <span className="color-primary text-small">
                        {diff} (+{change} {settings.asset[1].split('-')[0]})
                        </span>
                    </div>}
                </div>
                <div>
                    <Button small style={{margin: '0 0 0 1em'}} onClick={initSwap}>SWAP</Button>
                </div>
            </div>}
            {/*<div className="dimmed text-small micro-space">1 AQUA = 0,0079528 XLM</div>
            <div className="dual-layout middle micro-space text-small">
                <div className="dimmed">Max slippage</div>
                <span>0.2%</span>
            </div>
            <div className="dual-layout middle micro-space text-small">
                <div className="dimmed">Price impact</div>
                <span>{'<0.1%'}</span>
            </div>*/}
        </div>
    </div>
}

function initSwap() {
    alert(`Swaps are currently disabled in demo mode.\nStay tuned, we are going live soon!`)
}

function SwapAmount({amount, asset, onChange, onAssetChange, placeholder, className}) {
    const changeAmount = useCallback(e => {
        const val = e.target.value.replace(/\D/g, '')
        onChange(val)
    }, [onChange])

    const props = onChange ? {onChange: changeAmount} : {readOnly: true}
    return <div className={`asset-value ${className}`}>
        <div className="label text-tiny">{placeholder}</div>
        <input value={amount || ''} {...props}/>
        <AssetSelector value={asset} onChange={onAssetChange}/>
    </div>
}
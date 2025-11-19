import React, {useCallback, useState} from 'react'
import {Mediator} from '@stellar-broker/client'
import {fromStroops, toStroops} from '@stellar-expert/formatter'
import {Button, AssetSelector, Dropdown} from '../components/ui'
import {connectWalletsKit, signTx} from './wallet-kit'
import accountLedgerData from './account-ledger-data'
import AvailableAmountLink from './available-amount-link-view'
import SwapWidgetSettings from './swap-widget-settings'
import './swap-widget.scss'

export const SwapWidget = function SmartSwapWidget({className}) {
    const connectedAddress = accountLedgerData.address
    const [update, setUpdate] = useState(0)
    const refresh = useCallback(() => setUpdate(v => ++v), [setUpdate])
    const [settings] = useState(() => {
        const settings = new SwapWidgetSettings(refresh)
        settings.asset = ['XLM', 'AQUA-GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA-1']
        settings.amount = ['1000', '']
        settings.conversionSlippage = 1 //1%
        settings.recalculateSwap()
        return settings
    })
    let change
    let diff
    if (settings.direct) {
        change = fromStroops(toStroops(settings.amount[1]) - toStroops(settings.direct))
        diff = (((settings.amount[1] / settings.direct) - 1) * 100).toPrecision(3) + '%'
    }

    const changeSlippage = useCallback(val => settings.setSlippage(val), [settings])

    const retrieveFunds = useCallback(async (address) => {
        while (Mediator.hasObsoleteMediators(address)) {
            try {
                await Mediator.disposeObsoleteMediators(address, signTx)
            } catch (e) {
                console.error(e)
            }
        }
        if (!Mediator.hasObsoleteMediators(address)) {
            await settings.refreshBalances()
            notify({type: 'success', message: 'Funds returned to main account'})
        }
    }, [settings])

    const startSwap = useCallback(async() => {
        const connect = await connectWalletsKit()
        accountLedgerData.init(connect.address)
        if (Mediator.hasObsoleteMediators(connect.address)) {
            notify({type: 'info', message: <span><strong>Retrieve Tokens from Mediator Account</strong>
                <p><a href="#" onClick={() => retrieveFunds(connect.address)}>Retrieve funds</a> to your main account.</p></span>})
        }
    }, [retrieveFunds])

    const initSwap = useCallback(() => {
        settings.confirmSwap(connectedAddress)
            .catch(err => notify({type: 'error', message: 'Swap failed: ' + err}))
    }, [connectedAddress, settings])

    return <div className={`swap-widget ${className}`}>
        <div style={{minHeight: '1.7em'}}>
            {!!connectedAddress && <AvailableAmountLink settings={settings}/>}
        </div>
        <SwapAmount className="nano-space" placeholder="From" amount={settings.amount[0]}
                    onChange={!settings.inProgress ? v => settings.setAmount(v) : null}
                    asset={settings.asset[0]} onAssetChange={!settings.inProgress ? v => settings.setSellingAsset(v) : null}/>
        <div className="flex-center nano-space"><i className="icon-arrow-down color-gray"/></div>
        <SwapAmount className="micro-space" placeholder="To (estimated)" amount={settings.amount[1]}
                    asset={settings.asset[1]} onAssetChange={!settings.inProgress ? v => settings.setBuyingAsset(v) : null}/>
        <div style={{paddingLeft: '0.5em'}}>
            {settings.message ? <div className="dimmed text-small">
                <div className="space"/>
                <i className="icon-warning-circle"/> {settings.message}
            </div> : <div>
                <div className="dual-layout middle nano-space text-tiny">
                    <div className="dimmed">Max slippage:</div>
                    <Dropdown value={settings.conversionSlippage + '%'} options={['0.5%', '1%', '2%', '5%']}
                              onChange={changeSlippage} disabled={settings.inProgress}/>
                </div>
                <div className="dual-layout middle dimmed text-tiny micro-space" style={{minHeight: '1.65em'}}>
                    {change > 0 && <>
                        <div>Savings:</div>
                        <div className="color-primary text-small">
                            {diff} (+{change} {settings.asset[1].split('-')[0]})
                        </div>
                    </>}
                </div>
                {connectedAddress ?
                    <Button block secondary disabled={!settings.isValid || settings.inProgress} onClick={initSwap}>
                        {settings.inProgress ? <span className="loader" style={{margin: '0 auto'}}/> : 'Swap'}
                    </Button> :
                    <Button block secondary onClick={startSwap}>Start swap</Button>}
            </div>}
            {/*<div className="dimmed text-small micro-space">1 AQUA = 0,0079528 XLM</div>
            <div className="dual-layout middle micro-space text-small">
                <div className="dimmed">Price impact</div>
                <span>{'<0.1%'}</span>
            </div>*/}
        </div>
    </div>
}

function SwapAmount({amount, asset, onChange, onAssetChange, placeholder, className}) {
    const changeAmount = useCallback(e => {
        const val = e.target.value.replace(/\D/g, '')
        onChange(val)
    }, [onChange])

    const props = onChange ? {onChange: changeAmount} : {readOnly: true}
    return <div className={`asset-value ${className}`}>
        <div className="dimmed-light text-tiny">{placeholder}</div>
        <input value={amount || ''} {...props}/>
        <AssetSelector value={asset} onChange={onAssetChange}/>
    </div>
}
import React, {useCallback, useEffect, useState} from 'react'
import {StrKey} from '@stellar/stellar-sdk'
import {Mediator} from '@stellar-broker/client'
import {formatWithAutoPrecision} from '@stellar-expert/formatter'
import {Button, AssetSelector, Dropdown} from '../components/ui'
import {connectWalletsKit, setWallet, signTx} from './wallet-kit'
import accountLedgerData from './account-ledger-data'
import AvailableAmountLink from './available-amount-link-view'
import SwapWidgetSettings from './swap-widget-settings'
import './swap-widget.scss'

export const SwapWidget = function SmartSwapWidget({className}) {
    const connectedAddress = getActiveAccount()
    const [widgetStatus, setWidgetStatus] = useState('ready')
    const [update, setUpdate] = useState(0)
    const refresh = useCallback(status => {
        if (status)
            setWidgetStatus(status)
        setUpdate(v => ++v)
    }, [setUpdate])
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
    if (settings.profit) {
        change = formatWithAutoPrecision(settings.profit)
        diff = formatWithAutoPrecision(parseFloat(settings.profit) * 100 / parseFloat(settings.amount[1])) + '%'
    }

    const changeSlippage = useCallback(val => settings.setSlippage(val), [settings])

    const retrieveFunds = useCallback(async (address) => {
        notify({type: 'info', message: 'Sending funds ot your account, please wait'})
        while (Mediator.hasObsoleteMediators(address)) {
            try {
                await Mediator.disposeObsoleteMediators(address, signTx)
            } catch (e) {
                console.error(e)
            }
        }
        if (!Mediator.hasObsoleteMediators(address)) {
            await settings.refreshBalances()
            notify({type: 'info', message: 'Funds have been returned to your account'})
        }
    }, [settings])

    useEffect(() => {
        if (Mediator.hasObsoleteMediators(connectedAddress)) {
            notify({
                type: 'info', message: <span>Found unfinished swap<br/>
                <a href="#" onClick={() => retrieveFunds(connectedAddress)}>Return locked
                        funds</a> to your account?</span>
            })
        }
    }, [connectedAddress, retrieveFunds])

    const startSwap = useCallback(() => {
        setWidgetStatus('confirmation')
        connectWalletsKit()
            .then(connect => {
                if (!connect)
                    throw Error
                accountLedgerData.init(connect.address)
                setWidgetStatus('authenticated')
                notify({type: 'info', message: 'Great! Now you can swap with StellarBroker!'})
            })
            .catch(() => setWidgetStatus('ready'))
    }, [])

    const initSwap = useCallback(() => {
        settings.confirmSwap(connectedAddress)
            .catch(err => {
                console.error(err)
                notify({type: 'error', message: 'Swap failed: ' + err})
            })
            .finally(() => setWidgetStatus('ready'))
    }, [connectedAddress, settings])

    return <div className={`swap-widget ${className}`}>
        <div style={{minHeight: '1.7em'}}>
            {!!connectedAddress && <AvailableAmountLink settings={settings}/>}
        </div>
        <SwapAmount className="nano-space" placeholder="From" amount={settings.amount[0]}
                    onChange={!settings.inProgress ? v => settings.setAmount(v) : null}
                    asset={settings.asset[0]}
                    onAssetChange={!settings.inProgress ? v => settings.setSellingAsset(v) : null}/>
        <div className="flex-center nano-space"><i className="icon-arrow-down color-gray"/></div>
        <SwapAmount className="micro-space" placeholder="To (estimated)" amount={settings.amount[1]}
                    asset={settings.asset[1]}
                    onAssetChange={!settings.inProgress ? v => settings.setBuyingAsset(v) : null}/>
        <div>
            {(settings.message || settings.errorMessage) ? <div className="dimmed text-tiny text-center micro-space">
                <div className="micro-space"/>
                <i className="icon-warning-circle"/> {settings.message || settings.errorMessage}
                {!!settings.message && <>&nbsp;<a href="#" onClick={() => settings.recalculateSwap()}>Resume</a>?</>}
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
            </div>}
            {connectedAddress ?
                <SwapButton disabled={!settings.isValid || settings.inProgress || settings.message}
                            status={widgetStatus} onClick={initSwap}>
                    {settings.inProgress ?
                        <span className="loader" style={{margin: '0 auto'}}/> : 'Swap'}</SwapButton> :
                <SwapButton status={widgetStatus} onClick={startSwap}>Start swap</SwapButton>}
        </div>
    </div>
}

function SwapButton({disabled, status, onClick, children}) {
    return <Button block secondary disabled={disabled || status === 'confirmation'} onClick={onClick}>
        {status === 'confirmation' ? 'Waiting for confirmation' : children}
    </Button>
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

function getActiveAccount() {
    const address = localStorage.getItem('activeAccount')
    try {
        const usedWalletsIds = JSON.parse(localStorage.getItem('@StellarWalletsKit/usedWalletsIds') || '')
        setWallet(usedWalletsIds[0])
    } catch (e) {
        return null
    }
    if (!accountLedgerData.address && StrKey.isValidEd25519PublicKey(address)) {
        accountLedgerData.init(address)
    }
    return accountLedgerData.address
}
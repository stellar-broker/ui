import React from 'react'
import {isAssetValid, isValidPoolId} from '@stellar-expert/asset-descriptor'
import {formatWithAutoPrecision, formatWithPrecision, fromStroops} from '@stellar-expert/formatter'
import {AssetLink} from './asset-link'

export const Amount = React.memo(function Amount({amount, asset, decimals, adjust, round, issuer, icon}) {
    if (amount === undefined || amount === null)
        return null
    if (adjust === true) {
        try {
            amount = fromStroops(amount)
        } catch (e) {
            console.error(e)
            return null
        }
    }
    if (round) {
        let [int, fract] = (typeof amount === 'number' ? amount.toFixed(7) : amount).split('.')
        if (fract > 0) {
            int = parseFloat(int)
            fract = parseFloat('0.' + fract)
            if (amount < 0) {
                fract *= -1
            }

            const rounded = round === 'floor' ? Math.floor(fract) : Math.round(fract)
            amount = int + rounded
        }
    }
    try {
        amount = decimals === 'auto' ? formatWithAutoPrecision(amount) : formatWithPrecision(amount, decimals)
    } catch (e) {
        console.error(e)
        return null
    }
    return <span className="amount nowrap condensed">
        {amount}
        {!!asset && <>
            {' '}{isAssetValid(asset) || isValidPoolId(asset) ? <AssetLink asset={asset} icon={icon} issuer={issuer}/> : asset.toString()}
        </>}
    </span>
})
import {fromStroops} from '@stellar-expert/formatter'
import cn from 'classnames'
import {performApiCall} from '../../api/api-call'
import {authenticate} from '../../api/auth'
import {Button} from '../../components/ui/button'
import {normalizePrice} from '../../utils/normalize-price'
import PartnerInfoView from '../../components/partner-info-view'

export default function PartnersView({partnerList}) {
    return <div>
        {partnerList?.map((partner) => {
            return <div key={partner.id} className="micro-space">
                <div className="card outline">
                    <div className="row micro-space">
                        <div className="nano-space column column-50">
                            <PartnerInfoView id={partner.id} partner={partner} inactive={!!partner.inactive}/>
                        </div>
                        <div className={cn('nano-space column column-50', {'dimmed-light': partner.inactive})}>
                            <PartnerFees settings={partner.settings}/>
                        </div>
                    </div>
                    <PartnerStatView partner={partner}/>
                    <div className="micro-space"/>
                    <div className="row">
                        <div className="column column-75">
                            <Button small stackable href={`/admin/partner/${partner.id}`} disabled={!!partner.inactive}>Settings</Button>
                            <Button small stackable outline disabled={!!partner.inactive} onClick={logInAs} data-id={partner.id}>Log in as</Button>
                        </div>
                        <div className="column column-25 text-right">
                            <div className="nano-space"/>
                            <a href="#" onClick={toggleAccount} data-id={partner.id} className="text-small">
                                {partner.inactive ?
                                    <><i className="icon-reverse-left"/>&nbsp;&nbsp;Restore</> :
                                    <span className="error"><i className="icon-cross-circle"/>&nbsp;&nbsp;Delete</span>}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        })}
    </div>
}

function logInAs(e) {
    const partnerId = e.target.dataset.id
    performApiCall('login-in-as', {method: 'POST', params: {id: partnerId}})
        .then(res => {
            if (res.error)
                return notify({type: 'warning', message: res.error})
            authenticate(res.accessToken)
            location.href = '/account'
        })
}

function toggleAccount(e) {
    const {id} = e.target.dataset
    if (!confirm(e.target.innerText + ' this account?'))
        return
    performApiCall('partner/' + id, {method: 'DELETE'})
        .then(res => {
            if (res.error)
                return notify({type: 'warning', message: res.error})
            location.reload()
        })
}

function PartnerFees({settings}) {
    if (!settings)
        return null

    const info = {
        partnerVarFee: 'Partner var fee',
        brokerVarFee: 'Broker var fee',
        partnerFixedFee: 'Partner fixed fee',
        brokerFixedFee: 'Broker fixed fee'
    }

    return <div className="row row-right text-tiny">
        {Object.entries(settings).map(([key, value]) => {
            if (!value)
                return null
            return <div key={key} className="column column-25">
                <div className="nano-space"/>
                <div className="text-nano">{info[key]}</div>
                <strong>{value / 10}%</strong>
            </div>
        }).filter(v => !!v)}
    </div>
}

function PartnerStatView({partner}) {
    if (!partner.stats)
        return null
    const aggregatedStats = {
        swaps: 0,
        fee: 0,
        txCount: 0,
        txDropped: 0,
        txFailed: 0,
        txSuccess: 0
    }
    for (let record of partner.stats) {
        aggregatedStats.swaps += record.swaps || 0
        aggregatedStats.fee += parseFloat(record.fee) || 0
        aggregatedStats.txCount += record.txCount || 0
        aggregatedStats.txDropped += record.txDropped || 0
        aggregatedStats.txFailed += record.txFailed || 0
        aggregatedStats.txSuccess += record.txSuccess || 0
    }
    return <div className="row">
        <div className="column column-60" style={{paddingRight: 0}}>
            <div className="info-block micro-space">
                <p className="text-nano bolder text-upper dimmed nano-space">Overview</p>
                <div className="row">
                    <div className="column column-33">
                        <strong>${normalizePrice(fromStroops(partner.fees))}</strong>
                        <div className="text-nano bolder dimmed">Balance</div>
                        <div className="nano-space mobile-only"/>
                    </div>
                    <div className="column column-33">
                        <strong>{normalizePrice(fromStroops(aggregatedStats.fee))}</strong>&nbsp;
                        <span className="text-nano bolder dimmed-light">USDC</span>
                        <div className="text-nano bolder dimmed">Compound fees</div>
                        <div className="nano-space mobile-only"/>
                    </div>
                    <div className="column column-33">
                        <strong>{aggregatedStats.txSuccess}</strong>
                        <span className="text-nano bolder dimmed-light"> / {aggregatedStats.txDropped} dropped</span>
                        <div className="text-nano bolder dimmed">Successful transactions</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="column column-40">
            <div className="info-block micro-space">
            <p className="text-nano bolder text-upper dimmed nano-space">Monthly stats</p>
                <div className="row">
                    <div className="column column-50">
                        <strong>{aggregatedStats.swaps}</strong>
                        <div className="text-nano bolder dimmed">Swaps</div>
                        <div className="nano-space mobile-only"/>
                    </div>
                    <div className="column column-50">
                        <strong>{aggregatedStats.txCount}</strong>
                        <span className="text-nano bolder dimmed-light"> / {aggregatedStats.txFailed} failed</span>
                        <div className="text-nano bolder dimmed">Transactions</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
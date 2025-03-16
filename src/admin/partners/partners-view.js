import {fromStroops} from '@stellar-expert/formatter'
import {performApiCall} from '../../api/api-call'
import {authenticate} from '../../api/auth'
import {Button} from '../../components/ui/button'
import {Amount} from '../../components/ui/amount'

export default function PartnersView({partnerList}) {
    return <div>
        {partnerList?.map((partner) => {
            return <div key={partner.id} className="micro-space">
                <div className="card outline">
                    <div className="row">
                        <div className="nano-space column column-50">
                            <b>{partner.email}</b>&nbsp;
                            {!!partner.inactive && <span className="badge down text-tiny">inactive</span>}
                        </div>
                        <div className="nano-space column column-50 desktop-right text-small">
                            <PartnerFees settings={partner.settings}/>
                        </div>
                    </div>
                    <div className="micro-space"/>
                    <PartnerStatView partner={partner}/>
                    <div className="micro-space"/>
                    <div className="row">
                        <div className="column column-25 text-small">
                            <div className="nano-space"/>
                            <span className="dimmed">Balance: </span>{fromStroops(partner.fees)}$
                            <div className="nano-space"/>
                        </div>
                        <div className="column column-25">
                            <Button block outline onClick={toggleAccount} data-id={partner.id}>
                                {partner.inactive ?
                                    <><i className="icon-undo-circle"/>Restore</> :
                                    <><i className="icon-delete-circle"/>Delete</>}
                            </Button>
                        </div>
                        <div className="column column-25">
                            <Button block outline onClick={logInAs} data-id={partner.id}>
                                <i className="icon-user-verified"/>
                                Log in as</Button>
                        </div>
                        <div className="column column-25">
                            <Button block href={`edit/${partner.id}`} style={{marginBottom: 0}}>
                                <i className="icon-cog"/>Settings</Button>
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
    return <span>
        {Object.entries(settings).map(([key, value]) => {
            if (!value)
                return null
            return <span key={key}>
            <span className="dimmed"> {key}: </span>{value / 10}%
        </span>
        }).filter(v => !!v)}
    </span>
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
    return <div className="text-small">
        <div className="nano-space">
            Monthly stats:
        </div>
        <div className="row">
            <div className="column column-50">
                <span className="dimmed">Swaps: </span>
                {aggregatedStats.swaps}
            </div>
            <div className="column column-50">
                <span className="dimmed">Compound fees: </span>
                <Amount amount={aggregatedStats.fee} asset="USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" adjust issuer={false}/>
            </div>
            <div className="column column-50">
                <span className="dimmed">Transactions: </span>
                {aggregatedStats.txCount}
            </div>
            <div className="column column-50">
                <span className="dimmed">Successful transactions: </span>
                {aggregatedStats.txSuccess}
            </div>
            <div className="column column-50">
                <span className="dimmed">Failed transactions: </span>
                {aggregatedStats.txFailed}
            </div>
            <div className="column column-50">
                <span className="dimmed">Dropped transactions: </span>
                {aggregatedStats.txDropped}
            </div>
        </div>
    </div>
}
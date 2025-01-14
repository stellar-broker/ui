import {useCallback, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button} from './ui/button'
import {Dialog} from './ui/dialog'
import dateFormat from '../utils/date-formater'

function PartnersView({partnerList}) {

    return <div className="table space">
        <table>
            <thead className="text-tiny dimmed">
                <tr>
                    <th>Partner</th>
                    <th>API keys</th>
                    <th>Fee</th>
                    <th>Created</th>
                    <th className="collapsing text-right">Action</th>
                </tr>
            </thead>
            <tbody className="condensed">
                {partnerList?.map((partner) => {
                    return <tr key={partner.id}>
                        <td data-header="Partner: ">
                            {partner.email}
                        </td>
                        <td data-header="API keys: ">
                            {partner.keys.map(key => <div key={partner.id + key}>{key}</div>)}
                        </td>
                        <td data-header="Fee: ">
                            {partner.settings.partnerVarFee / 100}%
                        </td>
                        <td data-header="Created: ">
                            {dateFormat(partner.created, true)}
                        </td>
                        <td><PartnerControlsView id={partner.id}/></td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

function PartnerControlsView({id}) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleStat = useCallback(() => setIsOpen(prev => !prev), [])

    return <div className="table-controls">
        <a href="#" onClick={toggleStat}><i className="icon-chart"/></a>
        <Link to={`edit/${id}`} title="Edit settings"><i className="icon-cog"/></Link>
        <Dialog dialogOpen={isOpen}>
            <div className="space"><h5>Partner statistics</h5></div>
            <PartnerStatView id={id}/>
            <div className="row">
                <div className="column column-33 column-offset-66">
                    <Button block onClick={toggleStat}>Close</Button>
                </div>
            </div>
        </Dialog>
    </div>
}

function PartnerStatView({id}) {
    return <div>
        <div className="micro-space">
            <span>Daily volume:</span> <span className="dimmed">$1,220</span>
        </div>
        <div className="micro-space">
            <span>Monthly volume:</span> <span className="dimmed">$81,220</span>
        </div>
        <div className="micro-space">
            <span>Transactions today:</span> <span className="dimmed">1,015</span>
        </div>
        <div className="micro-space">
            <span>Transactions this month:</span> <span className="dimmed">11,060</span>
        </div>
        <div className="space">
            <span>Total transactions:</span> <span className="dimmed">321,770</span>
        </div>
    </div>
}

export default PartnersView
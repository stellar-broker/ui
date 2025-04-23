import React from 'react'
import {useParams} from 'react-router'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import {usePartnerSettings} from '../../utils/hooks/partner-settings'
import {Breadcrumbs} from '../../components/ui/breadcrumbs'
import PartnerEditForm from '../../admin/partners/partner-edit-form'

export default function AdminPartnerEditPage() {
    const {id} = useParams()
    const isEdit = !!id
    const [settings] = usePartnerSettings(id)

    setPageMetadata(isEdit ? {
        title: 'Edit partner settings',
        description: `Manage partner ${id}.`
    } : {
        title: 'Add partner',
        description: 'Create new partner.'
    })

    return <div>
        <Breadcrumbs links={prepareBreadcrumbs(id, settings.email)}/>
        <div>
            <h3>{isEdit ? 'Edit partner settings' : 'Add partner'}</h3>
        </div>
        <p className="dimmed space">
            {isEdit ? `Manage partner settings` : 'Create new partner'}
        </p>
        <div className="hr space"/>
        <PartnerEditForm id={id}/>
    </div>
}

function prepareBreadcrumbs(id, email) {
    const links = [
        {href: '/admin/partner', title: 'Partners'}
    ]
    if (email) {
        links.push({href: '/admin/partner/' + id, title: email})
    }
    links.push({title: id ? 'Edit partner settings' : 'Add partner'})

    return links
}
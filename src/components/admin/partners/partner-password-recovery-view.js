import {useCallback} from 'react'
import {CopyToClipboard} from '../../../utils/copy-to-clipboard'
import {Button} from '../../ui/button'

function PartnerPasswordRecoveryView({id}) {
    const recoveryPasswordLink = window.location.origin + '/password-recovery/' + id

    const sendPassRecoveryLink = useCallback(() => {
        //TODO: Add logic password recovery
        notify({type: 'success', message: 'Password recovery form has been sent'})
    }, [])

    if (!id)
        return null

    return <div>
        <div className="hr space"/>
        <p className="label nano-space">Partner password recovery</p>
        <div className="row micro-space">
            <div className="column column-33">
                <Button block className="text-small" onClick={sendPassRecoveryLink}>Send Link</Button>
            </div>
            <div className="column column-33">
                <CopyToClipboard text={recoveryPasswordLink}>
                    <Button block outline className="text-small">Copy Link</Button>
                </CopyToClipboard>
            </div>
        </div>
    </div>
}

export default PartnerPasswordRecoveryView
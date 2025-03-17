import React, {useState} from 'react'
import {setPageMetadata} from '../utils/meta-tags-generator'
import RequestAccessForm from '../components/request-access-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'

const totalSteps = 3

export default function RequestAccessPage() {
    const [step, setStep] = useState(1)

    setPageMetadata({
        title: 'Request access',
        description: 'To start using the StellarBroker API, please fill out the form and tell us more about yourself.'
    })

    return <div className="row row-no-padding dual-screen">
        <div className="column column-33">
            <div className="middle-layout">
                <div className="space">
                    <Logo/>
                </div>
                <div>
                    <h4>Request Access</h4>
                    <p className="text-small dimmed space">
                        To get started use StellarBroker API, please fill out form and tell us more about yourself
                        <br/><br/>
                        Already have an account?&nbsp;
                        <a href="/sign-in">Sign In</a>
                    </p>
                </div>
                <div className="bottom-block">
                    <Footer/>
                </div>
            </div>
        </div>
        <div className="column column-66 bg-color-gray">
            <div className="flex-center flex-grow h-100">
                <iframe style={{width:'100%',height:'100%',minHeight: '75vh'}} src="https://docs.google.com/forms/d/e/1FAIpQLSfRfpcKK09FCms_QYyiuEVNMVke8isvxlfBDlq85__5zFZ7qw/viewform?embedded=true" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </div>
            {/*<div className="middle-layout">
                <div className="top-block">
                    {step !== totalSteps && <div className="progress-bar" data-step={`${step}/${totalSteps}`}>
                        <div style={{'width': step / totalSteps * 100 + '%'}}/>
                    </div>}
                </div>
                <RequestAccessForm step={step} updateStep={setStep} stepAmount={totalSteps}/>
                <div className="bottom-block"/>
            </div>*/}
        </div>
    </div>
}
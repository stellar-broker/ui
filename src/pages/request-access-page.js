import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import RequestAccessForm from '../components/request-access-form'
import Logo from '../layout/logo'
import Footer from '../layout/footer'

const totalSteps = 3

function RequestAccessPage() {
    const [step, setStep] = useState(1)

    return <div className="row row-no-padding dual-screen">
        <div className="column column-33">
            <div className="middle-layout">
                <div>
                    <Logo/>
                </div>
                <div>
                    <h4>Request Access</h4>
                    <p className="text-small dimmed space">
                        To get started, please fill out form and tell us more about yourself
                        <br/><br/>
                        Already have an account?&nbsp;
                        <Link to="/sign-in">Sign In</Link>
                    </p>
                </div>
                <div className="bottom-block">
                    <Footer/>
                </div>
            </div>
        </div>
        <div className="column column-66 bg-color-gray">
            <div className="middle-layout">
                <div className="top-block">
                    {step !== totalSteps && <div className="progress-bar" data-step={`${step}/${totalSteps}`}>
                        <div style={{'width': step / totalSteps * 100 + '%'}}/>
                    </div>}
                </div>
                <RequestAccessForm step={step} updateStep={setStep} stepAmount={totalSteps}/>
                <div className="bottom-block"/>
            </div>
        </div>
    </div>
}

export default RequestAccessPage

import {Accordion} from '../ui/accordion'
import faqList from './faq.json'

export default function FaqView() {

    return <div className="faq-section">
        <div className="double-space desktop-only"/>
        <div className="badge info">FAQ</div>
        <h2 className="text-center" style={{padding: '0 1rem'}}>Frequently asked questions</h2>
        <div className="space"/>
        <Accordion options={faqList}/>
        <div className="double-space desktop-only"/>
    </div>
}
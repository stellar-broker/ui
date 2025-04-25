import {Accordion} from '../ui/accordion'

const faqList = [
    {
        title: 'Is StellarBroker secure? Do you store user data?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    },
    {
        title: 'How quickly are swaps executed using StellarBroker?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    },
    {
        title: 'Who can use StellarBroker?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    },
    {
        title: 'Can I customize fees?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    },
    {
        title: 'Does using StellarBroker require KYC?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    },
    {
        title: 'Can users preview the route before confirming a transaction?',
        content: 'Anyone building on Stellar. Whether you\'re developing a wallet, DEX, trading bot or a portfolio app — if your users swap tokens, StellarBroker can enhance your product.'
    }
]

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
import {Accordion} from '../ui/accordion'

const faqList = [
    {
        title: 'What is StellarBroker and who can use it?',
        content: 'StellarBroker is a multi-source liquidity swap router for Stellar. It enables any project on the Stellar network to offer users the best available rates for asset swaps. Whether you\'re building a wallet, DEX, portfolio tracker, or any app with token swapping — StellarBroker can enhance your product.'
    },
    {
        title: 'How does StellarBroker find better swap rates?',
        content: 'StellarBroker searches across multiple liquidity sources — including classic Stellar DEX, classic AMM pools, and Soroban-based protocols like Aquarius, Soroswap, Comet, and Phoenix — to find the most efficient route for each swap. This typically results in far better rates than the standard Path Payment operation.'
    },
    {
        title: 'How can I integrate StellarBroker into my product or service?',
        content: 'StellarBroker integration is quick and simple via our client library and API. Just request access through our website to receive API credentials and documentation.'
    },
    {
        title: 'Can I earn fees by using StellarBroker in my app?',
        content: 'Yes. When your users swap assets via StellarBroker, your project can earn a share of the savings StellarBroker generates for each swap transaction. Savings are calculated by comparing the StellarBroker swap quote to the standard Path Payment transaction quote. This creates a new revenue stream while benefiting your users.'
    },
    {
        title: 'What are the liquidity sources used by StellarBroker?',
        content: 'We aggregate liquidity from Stellar’s classic DEX orderbooks, AMM pools, and Soroban smart contract-based pools, including Aquarius, Soroswap, Comet, and Phoenix.'
    },
    {
        title: 'How quickly are swaps executed using StellarBroker?',
        content: 'Swaps are usually completed at identical or slightly slower speeds than standard Path Payment transactions. This is because StellarBroker splits the swap amount across multiple swap paths to maximize savings for the end user.'
    },
    {
        title: 'What if a transaction fails?',
        content: 'StellarBroker automatically selects the most efficient route from all available liquidity sources to maximize savings. If some of submitted transactions fail during the execution due to market fluctuations, StellarBroker automatically finds alternative quote execution paths within the configured slippage tolerance to execute the confirmed quote in full.'
    },
    {
        title: 'Are there any limits when requesting swap quotes with StellarBroker?',
        content: 'The minimum swap amount is the equivalent of 1$ in the asset being sold. There’s no maximum limit. Due to our routing optimization strategies users can execute high-volume trades, taking advantage of all available on-chain liquidity.'
    },
    {
        title: 'Is StellarBroker secure?',
        content: 'StellarBroker is a non-custodial router, which means that our service does not have direct access to user funds and can only propose transactions with optimal execution price to the client software (a wallet or trading interface). Each trade requires confirmation from the owner of the funds. Transactions can be validated on the client side, and only those trades that satisfy the quote confirmed by the user get signed and submitted to the blockchain.'
    },
    {
        title: 'Do you store user data?',
        content: 'We don’t store any user data. Only public data that is also available on-chain is collected and displayed in the partner dashboard for analytics and reporting.'
    },
    {
        title: 'Can I use StellarBroker with multisig wallets or delegated signing?',
        content: 'Yes. StellarBroker supports both multisig and delegated signing flows using a mediator account setup.'
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
/**
 * @param {'account'|'asset'|'ledger'|'tx'|'op'|'offer'|'contract'} type
 * @param {String|Number} id
 * @return {String}
 */
export function formatExplorerLink(type, id) {
    let res = 'https://stellar.expert/explorer/public'
    if (type) {
        res += '/' + type
    }
    if (id) {
        res += '/' + id
    }
    return res
}
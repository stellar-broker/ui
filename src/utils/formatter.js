const formatDate = function(date, z) {
    const dateISO = new Date(date).toISOString()
    return dateISO.replace('T', ' ').replace(/\.[0-9]{3}/, '').replace('Z', '')
}

function formatStroopPrice(price, fractionDigits = 0) {
    if (!price)
        return ''
    if (fractionDigits)
        return (price / 10_000_000).toFixed(fractionDigits)
    return (price / 10_000_000).toString()
}

export {formatDate, formatStroopPrice}
export default function formatDateTime(val, onlyDate) {
    if (!val) return

    const dateISO = new Date(val).toISOString()
    const [date, time] = dateISO.split('T')
    const [year, month, day] = date.split('-')

    if (onlyDate)
        return `${day}.${month}.${year}`

    return `${day}.${month}.${year} ${time.split('.')[0]}`
}
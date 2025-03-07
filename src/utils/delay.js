export default function delay(time = 500) {
    return new Promise(res => setTimeout(res, time))
}
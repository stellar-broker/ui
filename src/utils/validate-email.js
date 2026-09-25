//permissive, mirrors the server rule
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function validateEmail(email) {
    return typeof email === 'string' && email.length <= 254 && emailRegex.test(email)
}

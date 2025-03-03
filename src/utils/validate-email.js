export default function validateEmail(email) {
    const emailRegex = /^(.+@.+)$/
    return emailRegex.test(email)
}
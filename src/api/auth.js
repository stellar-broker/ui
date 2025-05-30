import {jwtDecode} from 'jwt-decode'

const authKey = 'auth'

export function getAuth() {
    const token = getJwt()
    if (!token)
        return null
    const parsed = parseJwt(token)
    if (!checkJwt(parsed)) {
        logout()
        return null
    }
    return {
        inactive: parsed.inactive,
        id: parsed.id,
        roles: parsed.roles,
        email: parsed.email
    }
}

export function logout() {
    localStorage.removeItem(authKey)
}

export function authenticate(token) {
    if (!checkJwt(token))
        return false
    localStorage.setItem(authKey, token)
    return true
}

function checkJwt(token) {
    if (typeof token === 'string') {
        token = parseJwt(token)
    }
    return token.exp > new Date().getTime() / 1000
}

export function parseJwt(token) {
    return jwtDecode(token)
}

export function getJwt() {
    return localStorage.getItem(authKey)
}
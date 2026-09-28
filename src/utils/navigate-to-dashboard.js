import {getAuth} from '../api/auth'
import {navigation} from './navigation'

/**
 * Send an authenticated user to the dashboard for their role
 */
export default function navigateToDashboard() {
    const auth = getAuth()
    navigation.navigate(auth?.roles?.includes('admin') ? '/admin/' : '/account/')
}

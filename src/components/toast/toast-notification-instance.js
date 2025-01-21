export default class ToastNotificationInstance {
    constructor(props) {
        Object.assign(this, props)
        this.timer = null
        this.started = new Date()
        this.remaining = props.ttl || ToastNotificationInstance.ttl
    }

    id

    type

    message = ''

    onDelete

    deleted = false

    started

    remaining

    delete() {
        this.deleted = true
        this.onDelete(this.id)
    }

    pauseTimer() {
        clearTimeout(this.timer)
        this.timer = null
        this.remaining -= new Date() - this.started
    }

    resumeTimer(action) {
        if (this.timer)
            return

        this.started = new Date()
        this.timer = setTimeout(action, this.remaining)
    }

    static ttl = 10_000 // 10 seconds by default
}
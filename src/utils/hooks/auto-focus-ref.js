export function useAutoFocusRef(inputRef) {
    if (!inputRef)
        return
    setTimeout(() => {
        if (document.body.contains(inputRef)) {
            inputRef.focus()
        }
    }, 200)
}
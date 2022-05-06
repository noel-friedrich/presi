document.onkeydown = function(e) {
    if (e.ctrlKey) {
        if (e.key.toLowerCase() == "s") {
            save()
            e.preventDefault()
        }
    }

    if (e.key == "F4") {
        e.preventDefault()
        if (!presentation.isPresenting) {
            CONSTANTS.PRESENT_BNT.click()
        }
    }

    if (e.key.toUpperCase() == "Z" && e.ctrlKey) {
        e.preventDefault()
        undo()
    }

    if (e.key.toUpperCase() == "Y" && e.ctrlKey) {
        e.preventDefault()
        redo()
    }

    if (presentation.isPresenting && (e.key == "Enter" || e.key == " ")) {
        e.preventDefault()
        CONSTANTS.PRESENT_OVER_OVERLAY.click()
    }
}

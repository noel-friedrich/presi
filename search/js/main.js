const INPUT = document.querySelector("input")
const BUTTON = document.querySelector("button")
const INPUT_REGEX = /^[a-zA-Z0-9\-_]{0,20}$/
INPUT.pattern = INPUT_REGEX.source

INPUT.focus()

INPUT.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() == "enter") {
        BUTTON.focus()
        BUTTON.click()
    }
})

let prevValue = ""

INPUT.addEventListener("input", function(e) {
    INPUT.value = INPUT.value.trim().toLowerCase()
    if (INPUT_REGEX.test(INPUT.value)) {
    } else {
        INPUT.value = prevValue
    }
    prevValue = INPUT.value
})

BUTTON.addEventListener("click", function(e) {
    let value = INPUT.value
    if (value.match(INPUT_REGEX) && value.length > 0) {
        window.location.href = `https://noel-friedrich.de/presi?n=${value}`
    } else {
        alert("Please enter a valid name.")
    }
})

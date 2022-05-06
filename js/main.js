CONSTANTS.ADD_SLIDE_BTN.addEventListener("click", function() {
    presentation.makeSlide()
    tempSave()
})

CONSTANTS.ADD_SLIDE_ELEMENT_BTN.addEventListener("click", function() {
    if (!selectedSlide) return
    selectedSlide.makeElement()
    tempSave()
})

window.addEventListener("resize", () => {
    if (presentation.isPresenting) {
        makeSlideNotMaxSize()
        makeSlideMaxSize()
        presentation.update()
    } else {
        CONSTANTS.SLIDE_CONTAINER.style = ""
        fixSlideSize()
        presentation.update()
    }
    
})

CONSTANTS.MAIN_CONTENT_AREA.addEventListener("mousemove", function(e) {
    let rect = CONSTANTS.SLIDE.getBoundingClientRect()

    if (expandingElement) {
        let pos = new Vector2d(
            (e.clientX - rect.left) / rect.width * CONSTANTS.SLIDE_WIDTH - (CONSTANTS.SLIDE_WIDTH / 2),
            (e.clientY - rect.top) / rect.height * CONSTANTS.SLIDE_HEIGHT - (CONSTANTS.SLIDE_HEIGHT / 2)
        )
        let direction = pos.sub(expandingElement.position)
        if (expandingDirection == EXPAND.EAST || expandingDirection == EXPAND.WEST) {
            direction.y = 0
        } else if (expandingDirection == EXPAND.NORTH || expandingDirection == EXPAND.SOUTH) {
            direction.x = 0
        }
        expandingElement.expand(direction, expandingDirection)
    }

    if (draggingElement) {
        let pos = new Vector2d(
            (e.clientX - rect.left) / rect.width * CONSTANTS.SLIDE_WIDTH - (CONSTANTS.SLIDE_WIDTH / 2) - (draggingElement.size.x / 2),
            (e.clientY - rect.top) / rect.height * CONSTANTS.SLIDE_HEIGHT - (CONSTANTS.SLIDE_HEIGHT / 2) + (20 * (rect.height / CONSTANTS.SLIDE_HEIGHT))
        )
        e.preventDefault()
        draggingElement.setPosition(pos)
    }
}.bind(this))

document.body.addEventListener("mouseup", function() {
    let temp = draggingElement
    draggingElement = null
    if (temp) {
        temp.update()
        tempSave()
    }

    temp = expandingElement
    expandingElement = null
    if (temp) {
        temp.update()
        tempSave()
    }
})

function pleaseChooseElement() {
    alert("Wähle zuerst ein Element aus, um es zu bearbeiten.")
}

CONSTANTS.INCREASE_FONT_SIZE_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.textSize = Math.min(selectedElement.textSize * 1.1, 500)
    selectedElement.update()
    tempSave()
})

CONSTANTS.DECREASE_FONT_SIZE_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.textSize = Math.max(selectedElement.textSize * 0.9, 1)
    selectedElement.update()
    tempSave()
})

CONSTANTS.SET_TEXTLAYOUT_LEFT_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.textAlign = "left"
    selectedElement.update()
    tempSave()
})

CONSTANTS.SET_TEXTLAYOUT_CENTER_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.textAlign = "center"
    selectedElement.update()
    tempSave()
})

CONSTANTS.SET_TEXTLAYOUT_RIGHT_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.textAlign = "right"
    selectedElement.update()
    tempSave()
})

CONSTANTS.BACKGROUND_COLOR_INPUT.addEventListener("input", function(e) {
    if (!selectedElement) {
        return
    }
    selectedElement.backgroundPureColor = e.target.value
    selectedElement.backgroundColor = addAlpha(e.target.value, selectedElement.backgroundTransparency)
    selectedElement.update()
})

CONSTANTS.BACKGROUND_COLOR_INPUT.addEventListener("change", function(e) {
    tempSave()
})

CONSTANTS.BACKGROUND_TRANSPAENCY_INPUT.addEventListener("input", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        return
    }
    selectedElement.backgroundTransparency = 1 - parseFloat(e.target.value) / 255
    selectedElement.backgroundColor = addAlpha(selectedElement.backgroundPureColor, selectedElement.backgroundTransparency)
    selectedElement.update()
})

CONSTANTS.BACKGROUND_TRANSPAENCY_INPUT.addEventListener("change", function(e) {
    tempSave()
})

CONSTANTS.BORDER_COLOR_INPUT.addEventListener("input", function(e) {
    if (!selectedElement) {
        return
    }
    if (selectedElement.borderColor != e.target.value) {
        selectedElement.borderColor = e.target.value
        selectedElement.update()
    }
})

CONSTANTS.BORDER_COLOR_INPUT.addEventListener("change", function(e) {
    tempSave()
})

CONSTANTS.INCREASE_BORDER_WIDTH_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.borderWidth = Math.min(selectedElement.borderWidth + 1, 100)
    selectedElement.update()
    tempSave()
})

CONSTANTS.DECREASE_BORDER_WIDTH_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.borderWidth = Math.max(selectedElement.borderWidth - 1, 0)
    selectedElement.update()
    tempSave()
})

CONSTANTS.TEXT_COLOR_INPUT.addEventListener("input", function(e) {
    if (!selectedElement) {
        return
    }
    selectedElement.textColor = e.target.value
    selectedElement.update()
})

CONSTANTS.TEXT_COLOR_INPUT.addEventListener("change", function(e) {
    tempSave()
})

CONSTANTS.INCREASE_BORDER_RADIUS_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    if (selectedElement.borderRadius === 0)
        selectedElement.borderRadius = 1
    else
        selectedElement.borderRadius = Math.min(selectedElement.borderRadius * 1.3, Math.min(selectedElement.size.y, selectedElement.size.x) / 2)
    selectedElement.update()
    tempSave()
})

CONSTANTS.DECREASE_BORDER_RADIUS_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.borderRadius = Math.max(selectedElement.borderRadius * 0.7, 0)
    selectedElement.update()
    tempSave()
})

CONSTANTS.DELETE_SLIDE_ELEMENT_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.remove()
    selectedElement = null
    CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.display = "none"
    tempSave()
})

CONSTANTS.PRESENT_BNT.addEventListener("click", function(e) {
    presentation.present()
})

CONSTANTS.BRING_SLIDE_ELEMENT_TO_FRONT_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.bringToFront()
    tempSave()
})

CONSTANTS.BRING_SLIDE_ELEMENT_TO_BACK_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.bringToBack()
    tempSave()
})

CONSTANTS.FONT_FAMILY_SELECT.addEventListener("change", function(e) {
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.fontFamily = e.target.value
    selectedElement.update()
    tempSave()
})

CONSTANTS.FONT_STYLE_SELECT.addEventListener("change", function(e) {
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.fontStyle = e.target.value
    selectedElement.update()
    tempSave()
})

CONSTANTS.PRESENT_OVER_OVERLAY.addEventListener("click", function(e) {
    if (nextSlideFunc && presentation.isPresenting)
        nextSlideFunc(presentation)
})

CONSTANTS.DUPLICATE_SLIDE_ELEMENT_BTN.addEventListener("mousedown", function(e) {
    e.preventDefault()
    if (!selectedElement) {
        pleaseChooseElement()
        return
    }
    selectedElement.duplicate()
    tempSave()
})

document.body.addEventListener("click", function(e) {
    // if target is not in the SLIDE_ELEMENT_CONTEXTMENU, hide it
    if (!e.target.closest(".slide-element-contextmenu")) {
        CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.display = "none"
    }
})

let NAME = null

let presentation = null
let lastSaveDate = Date.now()
let lastTransmittedData = null

async function save() {
    let data = JSON.stringify(presentation.export())
    if (data != lastTransmittedData) {
        await postRequest(`/presi/api/set.php`, {
            name: NAME,
            data: data
        })
        lastTransmittedData = data
        console.log("Uploaded Changes")
    }
    lastSaveDate = Date.now()
}

function updateSaveDisplay() {
    let seconds = Math.floor((Date.now() - lastSaveDate) / 1000)
    CONSTANTS.SAVED_SECONDS_AGO_OUTPUT.textContent = seconds
}

async function main() {
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("n")) {
        NAME = urlParams.get("n").toLowerCase()
    } else {
        window.location.href = "https://noel-friedrich.de/presi/search"
        return
    }

    CONSTANTS.PRESENTATION_NAME_OUTPUT.textContent = NAME

    let data
    try {
        data = JSON.parse(await getRequest(`/presi/api/get.php?name=${NAME}`))
    } catch (e) {
        alert("Es ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.")
        return
    }

    if (data == null) {
        presentation = new Presentation()
    } else {
        presentation = Presentation.fromData(JSON.parse(data.data))
    }

    if (urlParams.has("p") || urlParams.has("present")) {
        presentation.present()
    }

    lastTransmittedData = JSON.stringify(presentation.export())

    tempSave()

    setInterval(save, 10000)
    setInterval(updateSaveDisplay, 1000)

}

main()

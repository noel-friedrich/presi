function rgba(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`
}

function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`
}

// from https://stackoverflow.com/questions/46503249/color-input-with-transparency
function addAlpha(color, opacity) {
    // coerce values so ti is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    if (opacity === 0) {
        return 'transparent';
    }
    return color + _opacity.toString(16).toUpperCase();
}

function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

class Vector2d {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(v) {
        return new Vector2d(this.x + v.x, this.y + v.y)
    }

    sub(v) {
        return new Vector2d(this.x - v.x, this.y - v.y)
    }

    scale(s) {
        return new Vector2d(this.x * s, this.y * s)
    }

    abs() {
        return new Vector2d(Math.abs(this.x), Math.abs(this.y))
    }

    copy() {
        return new Vector2d(this.x, this.y)
    }

    export() {
        return {
            x: this.x,
            y: this.y
        }
    }

    static fromData(data) {
        return new Vector2d(data.x, data.y)
    }

}

function makeSlideMaxSize() {
    CONSTANTS.SLIDE_CONTAINER.style = ""
    CONSTANTS.SLIDE_CONTAINER.classList.add("presenting")
    let currWidth = CONSTANTS.SLIDE_CONTAINER.clientWidth
    let currHeight = CONSTANTS.SLIDE_CONTAINER.clientHeight
    let currRatio = currWidth / currHeight
    if (currRatio > CONSTANTS.SLIDE_ASPECT_RATIO) {
        let width = currHeight * CONSTANTS.SLIDE_ASPECT_RATIO
        CONSTANTS.SLIDE_CONTAINER.style.width = `${width}px`
        CONSTANTS.SLIDE_CONTAINER.style.left = `${(currWidth - width) / 2}px`
    } else {
        let height = currWidth * (1 / CONSTANTS.SLIDE_ASPECT_RATIO)
        CONSTANTS.SLIDE_CONTAINER.style.height = `${height}px`
        CONSTANTS.SLIDE_CONTAINER.style.top = `${(currHeight - height) / 2}px`
    }
}

function makeSlideNotMaxSize() {
    CONSTANTS.SLIDE_CONTAINER.classList.remove("presenting")
    CONSTANTS.SLIDE_CONTAINER.style = ""
    fixSlideSize()
}

function updateCSSVariables() {
    document.documentElement.style.setProperty("--slide-aspect-ration", CONSTANTS.SLIDE_ASPECT_RATIO_STR)
}

function fixSlideSize() {
    
    if (CONSTANTS.SLIDE_CONTAINER.clientHeight > CONSTANTS.MAIN_CONTENT_AREA.clientHeight * 0.9) {
        CONSTANTS.SLIDE_CONTAINER.style.height = `${CONSTANTS.MAIN_CONTENT_AREA.clientHeight * 0.9}px`
        CONSTANTS.SLIDE_CONTAINER.style.width = `${(CONSTANTS.MAIN_CONTENT_AREA.clientHeight * 0.9) * CONSTANTS.SLIDE_ASPECT_RATIO}px`
    }

}

updateCSSVariables()
fixSlideSize()

//from https://stephenhaney.com/2020/get-contenteditable-plaintext-with-correct-linebreaks/

function getInnertextWithLineBreaks(element) {
    let newValue = '';
    let isOnFreshLine = true;

    // Recursive function to navigate childNodes and build linebreaks with text
    function parseChildNodesForValueAndLines(childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];

        if (childNode.nodeName === 'BR') {
        // BRs are always line breaks which means the next loop is on a fresh line
        newValue += '\n';
        isOnFreshLine = true;
        continue;
        }

        // We may or may not need to create a new line
        if (childNode.nodeName === 'DIV' && isOnFreshLine === false) {
        // Divs create new lines for themselves if they aren't already on one
        newValue += '\n';
        }

        // Whether we created a new line or not, we'll use it for this content so the next loop will not be on a fresh line:
        isOnFreshLine = false;

        // Add the text content if this is a text node:
        if (childNode.nodeType === 3 && childNode.textContent) {
        newValue += childNode.textContent;
        }

        // If this node has children, get into them as well:
        parseChildNodesForValueAndLines(childNode.childNodes);
    }
    }

    // Parse the child nodes for HTML and newlines:
    parseChildNodesForValueAndLines(element.childNodes);

    // Return the value with line breaks:
    return newValue;
}

function loadtextContentWithLineBreaks(element, text) {
    let lines = text.split("\n")
    element.innerHTML = ""
    for (let line of lines) {
        let div = document.createElement("div")
        div.textContent = line
        element.appendChild(div)
    }
}

function spawnSlideElementContextmenu(event) {
    CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.display = "block"
    CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.left = `${event.clientX}px`
    CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.top = `${event.clientY}px`
    if (event.clientY + CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.clientHeight > CONSTANTS.MAIN_CONTENT_AREA.clientHeight) {
        CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.style.top = `${CONSTANTS.MAIN_CONTENT_AREA.clientHeight - CONSTANTS.SLIDE_ELEMENT_CONTEXTMENU.clientHeight}px`
    }
}

let diff = (a, b) => Math.abs(a - b)

function getHighestZIndex() {
    let highest = 0
    for (let element of document.querySelectorAll(".slide-element")) {
        if (element.style.zIndex) {
            highest = Math.max(highest, parseInt(element.style.zIndex))
        }
    }
    return highest
}

function getLowestZIndex() {
    let lowest = 0
    for (let element of document.querySelectorAll(".slide-element")) {
        if (element.style.zIndex) {
            lowest = Math.min(lowest, parseInt(element.style.zIndex))
        }
    }
    return lowest
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let contextMenuChoice = {
    set: false,
    textColor: null,
    fontFamily: null,
    textSize: null,
}

function adjustContextmenu(slideElement) {
    CONSTANTS.TEXT_COLOR_INPUT.value = slideElement.textColor
    CONSTANTS.FONT_FAMILY_SELECT.value = slideElement.fontFamily
    CONSTANTS.FONT_STYLE_SELECT.value = slideElement.fontStyle
    CONSTANTS.BACKGROUND_COLOR_INPUT.value = slideElement.backgroundPureColor
    CONSTANTS.BACKGROUND_TRANSPAENCY_INPUT.value = (1 - slideElement.backgroundTransparency) * 255
    CONSTANTS.BORDER_COLOR_INPUT.value = slideElement.borderColor

    contextMenuChoice.set = true
    contextMenuChoice.textColor = slideElement.textColor
    contextMenuChoice.fontFamily = slideElement.fontFamily
    contextMenuChoice.textSize = slideElement.textSize
}

function adjustElementToContextMenu(slideElement) {
    if (contextMenuChoice.set) {
        slideElement.textColor = contextMenuChoice.textColor
        slideElement.fontFamily = contextMenuChoice.fontFamily
        slideElement.textSize = contextMenuChoice.textSize
        slideElement.update()
    }
}

function duplicateSlide(slide) {
    if (presentation.isPresenting) return

    let slideData = slide.export()
    let newSlide = Slide.fromData(slideData, presentation)
    presentation.slides.splice(presentation.slides.indexOf(slide) + 1, 0, newSlide)

    newSlide.load()
}

const STATE_CACHE_SIZE = 10
let stateCache = Array()
let tempRedoState = null

function tempSave() {
    let currState = presentation.export()
    if (!(stateCache.length > 0 && stateCache[stateCache.length - 1] == currState)) {
        stateCache.push(currState)
    }
    if (stateCache.length > STATE_CACHE_SIZE) {
        stateCache.shift()
    }
}

function undo() {
    if (presentation.isPresenting) return

    if (stateCache.length <= 1) {
        alert("Ups, es gibt nichts (mehr) zum rückgängig machen.")
        return
    }

    let currIndex = presentation.slides.indexOf(selectedSlide)
    tempRedoState = stateCache.pop()
    presentation = Presentation.fromData(stateCache[stateCache.length - 1])
    presentation.slides[currIndex].load()
}

function redo() {
    if (presentation.isPresenting) return

    if (tempRedoState == null) {
        alert("Ups, es gibt nichts (mehr) zum wiederherstellen.")
        return
    }

    let currIndex = presentation.slides.indexOf(selectedSlide)
    stateCache.push(tempRedoState)
    tempRedoState = null
    presentation = Presentation.fromData(stateCache[stateCache.length - 1])
    presentation.slides[currIndex].load()
}

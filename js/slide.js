let selectedSlide = null
let selectedElement = null

let draggingElement = null
let expandingElement = null
let expandingDirection = null
const EXPAND = {
    EAST: "east",
    WEST: "west",
    NORTH: "north",
    SOUTH: "south",
    NORTH_EAST: "north-east",
    NORTH_WEST: "north-west",
    SOUTH_EAST: "south-east",
    SOUTH_WEST: "south-west"
}

class SlideElement {

    addMovementOptions() {
        if (this.movementOptionspresent) return
        this.movementOptionspresent = true

        this.moveButton = document.createElement("button")
        this.moveButton.classList.add("move-button")

        this.moveButton.setAttribute("contentEditable", "false")
        this.moveButton.addEventListener("mousedown", function(e) {
            draggingElement = this
        }.bind(this))

        function createButton(direction, element) {
            let btn = document.createElement("button")
            btn.classList.add("expand")
            btn.classList.add(direction)
            btn.addEventListener("mousedown", function(e) {
                expandingElement = element
                expandingDirection = direction
                e.preventDefault()
            }.bind(element))
            return btn
        }

        let onGeneralExpansion = () => null

        this.expandEastButton = createButton(EXPAND.EAST, this)
        this.expandWestButton = createButton(EXPAND.WEST, this)
        this.expandNorthButton = createButton(EXPAND.NORTH, this)
        this.expandSouthButton = createButton(EXPAND.SOUTH, this)
        this.expandNorthEastButton = createButton(EXPAND.NORTH_EAST, this)
        this.expandNorthWestButton = createButton(EXPAND.NORTH_WEST, this)
        this.expandSouthEastButton = createButton(EXPAND.SOUTH_EAST, this)
        this.expandSouthWestButton = createButton(EXPAND.SOUTH_WEST, this)

        this.container.appendChild(this.moveButton)
        this.container.appendChild(this.expandEastButton)
        this.container.appendChild(this.expandWestButton)
        this.container.appendChild(this.expandNorthButton)
        this.container.appendChild(this.expandSouthButton)
        this.container.appendChild(this.expandNorthEastButton)
        this.container.appendChild(this.expandNorthWestButton)
        this.container.appendChild(this.expandSouthEastButton)
        this.container.appendChild(this.expandSouthWestButton)
    }

    removeMovementOptions() {
        if (!this.movementOptionspresent) return
        if (this.moveButton) this.moveButton.remove()
        if (this.expandEastButton) this.expandEastButton.remove()
        if (this.expandWestButton) this.expandWestButton.remove()
        if (this.expandNorthButton) this.expandNorthButton.remove()
        if (this.expandSouthButton) this.expandSouthButton.remove()
        if (this.expandNorthEastButton) this.expandNorthEastButton.remove()
        if (this.expandNorthWestButton) this.expandNorthWestButton.remove()
        if (this.expandSouthEastButton) this.expandSouthEastButton.remove()
        if (this.expandSouthWestButton) this.expandSouthWestButton.remove()
        this.movementOptionspresent = false
    }

    setPosition(pos) {
        this.position = pos
        this.adjustPos()
        this.updatePos()
    }

    adjustPos() {
        const ACCURACY = 10
        if (diff(this.position.x, -CONSTANTS.SLIDE_WIDTH / 2) < ACCURACY) {
            this.position.x = -CONSTANTS.SLIDE_WIDTH / 2
            if (diff(this.size.x, CONSTANTS.SLIDE_WIDTH) < ACCURACY)
                this.size.x = CONSTANTS.SLIDE_WIDTH
        }
        if (diff(this.position.y, -CONSTANTS.SLIDE_HEIGHT / 2) < ACCURACY) {
            this.position.y = -CONSTANTS.SLIDE_HEIGHT / 2
            if (diff(this.size.y, CONSTANTS.SLIDE_HEIGHT) < ACCURACY)
                this.size.y = CONSTANTS.SLIDE_HEIGHT
        }

        if (diff(this.position.x + this.size.x, CONSTANTS.SLIDE_WIDTH / 2) < ACCURACY) {
            this.position.x = CONSTANTS.SLIDE_WIDTH / 2 - this.size.x
        }
        if (diff(this.position.y + this.size.y, CONSTANTS.SLIDE_HEIGHT / 2) < ACCURACY) {
            this.position.y = CONSTANTS.SLIDE_HEIGHT / 2 - this.size.y
        }
    }

    expand(newSize, direction) {
        if (direction == EXPAND.EAST || direction == EXPAND.SOUTH || direction == EXPAND.SOUTH_EAST) {
            if (newSize.x < 0) return
            this.size.x = (newSize.x > CONSTANTS.MIN_ELEMENT_SIZE) ? newSize.x : this.size.x
            this.size.y = (newSize.y > CONSTANTS.MIN_ELEMENT_SIZE) ? newSize.y : this.size.y
        } else if (direction == EXPAND.WEST) {
            if (this.size.x - newSize.x < CONSTANTS.MIN_ELEMENT_SIZE) return
            this.position.x += newSize.x
            this.size.x += newSize.x * -1
        } else if (direction == EXPAND.NORTH) {
            if (this.size.y - newSize.y < CONSTANTS.MIN_ELEMENT_SIZE) return
            this.position.y += newSize.y
            this.size.y += newSize.y * -1
        } else if (direction == EXPAND.SOUTH_WEST) {
            if (this.size.x - newSize.x < CONSTANTS.MIN_ELEMENT_SIZE) return
            this.size.y = (newSize.y > CONSTANTS.MIN_ELEMENT_SIZE) ? newSize.y : this.size.y
            this.position.x += newSize.x
            this.size.x += newSize.x * -1
        } else if (direction == EXPAND.NORTH_EAST) {
            if (this.size.y - newSize.y < CONSTANTS.MIN_ELEMENT_SIZE) return
            this.size.x = (newSize.x > CONSTANTS.MIN_ELEMENT_SIZE) ? newSize.x : this.size.x
            this.position.y += newSize.y
            this.size.y += newSize.y * -1
        } else if (direction == EXPAND.NORTH_WEST) {
            if (this.size.x - newSize.x < CONSTANTS.MIN_ELEMENT_SIZE) return
            if (this.size.y - newSize.y < CONSTANTS.MIN_ELEMENT_SIZE) return
            this.position.x += newSize.x
            this.size.x += newSize.x * -1
            this.position.y += newSize.y
            this.size.y += newSize.y * -1
        }

        this.adjustPos()
        this.updatePos()
    }

    makeDOM() {
        let container = document.createElement("div")
        container.classList.add("slide-element")

        container.addEventListener("input", function() {
            let prevText = this.text
            let text = container.textContent.trim()
            this.text = container.textContent
            if (text.match(/(https?:\/\/.*\.(?:png|jpg))/i)) {
                this.image = text.match(/(https?:\/\/.*\.(?:png|jpg))/i)[0]
                this.container.textContent = ""
                this.text = ""
                this.update()
            } else if(this.image) {
                this.image = null
                this.update()
            }
            if (prevText != this.text) {
                tempSave()
            }
        }.bind(this))

        container.addEventListener("focus", function() {
            if (selectedElement) {
                if (selectedElement.container.classList.contains("customFocus"))
                    selectedElement.container.classList.remove("customFocus")
                selectedElement.removeMovementOptions()
                selectedElement.update()
            }

            if (!this.container.classList.contains("customFocus")) {
                this.container.classList.add("customFocus")
                this.addMovementOptions()
            }
            selectedElement = this
        }.bind(this))

        container.addEventListener("contextmenu", function(e) {
            e.preventDefault()
            if (selectedElement) {
                if (selectedElement.container.classList.contains("customFocus"))
                    selectedElement.container.classList.remove("customFocus")
                selectedElement.removeMovementOptions()
                selectedElement.update()
            }
            if (!this.container.classList.contains("customFocus")) {
                this.container.classList.add("customFocus")
                this.addMovementOptions()
            }
            selectedElement = this
            spawnSlideElementContextmenu(e)
            adjustContextmenu(this)
        }.bind(this))

        CONSTANTS.MAIN_CONTENT_AREA.addEventListener("click", function(e) {
            if (e.target != CONSTANTS.SLIDE && e.target != CONSTANTS.MAIN_CONTENT_AREA) return
            if (draggingElement) return
            if (this.container.classList.contains("customFocus")) {
                this.container.classList.remove("customFocus")
            }
            selectedElement = null
            this.removeMovementOptions()
            this.update()
        }.bind(this))

        container.addEventListener("paste", function(event) {
            event.preventDefault()
            document.execCommand("inserttext", false, event.clipboardData.getData("text/plain"))
        })

        return container
    }

    duplicate() {
        let myData = this.export()
        let myClone = SlideElement.fromData(myData)
        this.slide.elements.push(myClone)
        this.slide.load()
        myClone.slide = this.slide
        myClone.position.x += 50
        myClone.position.y += 50
        myClone.updatePos()
        myClone.container.focus()
    }

    updatePos() {
        let scaleFactor = new Vector2d(
            CONSTANTS.SLIDE.clientWidth / CONSTANTS.SLIDE_WIDTH,
            CONSTANTS.SLIDE.clientHeight / CONSTANTS.SLIDE_HEIGHT
        )
        let actualSize = new Vector2d(
            this.size.x * scaleFactor.x,
            this.size.y * scaleFactor.y
        )
        let actualPosition = new Vector2d(
            (this.position.x + (CONSTANTS.SLIDE_WIDTH / 2)) * scaleFactor.x,
            (this.position.y + (CONSTANTS.SLIDE_HEIGHT / 2)) * scaleFactor.y
        )

        this.container.style.width = `${Math.round(actualSize.x)}px`
        this.container.style.height = `${Math.round(actualSize.y)}px`

        this.container.style.left = `${Math.round(actualPosition.x)}px`
        this.container.style.top = `${Math.round(actualPosition.y)}px`
    }

    update() {
        this.updatePos()

        let heightRatio = CONSTANTS.SLIDE.clientHeight / CONSTANTS.SLIDE_HEIGHT

        this.container.style.transform = `rotate(${this.rotation}deg) scale(${this.scale})`
        this.container.style.opacity = this.opacity
        this.container.style.backgroundColor = this.backgroundColor
        this.container.style.borderColor = this.borderColor
        this.container.style.borderWidth = `${this.borderWidth}px`
        this.container.style.borderRadius = `${this.borderRadius}px`
        this.container.style.borderStyle = this.borderStyle
        this.container.style.boxShadow = this.boxShadow
        this.container.style.color = this.textColor
        this.container.style.fontSize = `${this.textSize * heightRatio}px`
        this.container.style.textAlign = this.textAlign
        this.container.style.zIndex = this.zIndex
        this.container.style.fontFamily = this.fontFamily
        this.container.style.fontStyle = this.fontStyle
        if (this.fontStyle == "bold") {
            this.container.style.fontWeight = "bold"
        } else {
            this.container.style.fontWeight = "normal"
        }

        if (this.image) {
            this.container.style.backgroundImage = `url(${this.image})`
            this.container.style.backgroundSize = "contain"
            this.container.style.backgroundPosition = "center"
            this.container.style.backgroundRepeat = "no-repeat"
        } else {
            this.container.style.backgroundImage = ""
        }

        this.container.setAttribute("contentEditable", "true")
    }

    constructor() {
        this.size = new Vector2d(700, 100)
        this.position = new Vector2d(
            -this.size.x / 2,
            -this.size.y / 2
        )
        this.rotation = 0
        this.scale = 1
        this.opacity = 1
        this.borderColor = rgb(0, 0, 0, 0)
        this.borderWidth = 0
        this.borderRadius = 0
        this.borderStyle = "solid"
        this.boxShadow = "none"
        this.text = "text"
        this.textColor = rgba(0, 0, 0, 1)
        this.textSize = 30
        this.textAlign = "center"
        this.backgroundTransparency = 0
        this.backgroundPureColor = "#000000"
        this.backgroundColor = rgba(0, 0, 0, this.backgroundTransparency)
        this.zIndex = 1000000
        this.fontFamily = "Arial"
        this.fontStyle = "normal"
        this.image = null

        this.container = this.makeDOM()
        this.update()

        this.movementOptionspresent = false
        this.container.textContent = this.text
        this.slide = null
    }

    export() {
        return {
            size: this.size.export(),
            position: this.position.export(),
            rotation: this.rotation,
            scale: this.scale,
            opacity: this.opacity,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
            borderRadius: this.borderRadius,
            borderStyle: this.borderStyle,
            boxShadow: this.boxShadow,
            text: getInnertextWithLineBreaks(this.container),
            textColor: this.textColor,
            textSize: this.textSize,
            textAlign: this.textAlign,
            backgroundTransparency: this.backgroundTransparency,
            backgroundPureColor: this.backgroundPureColor,
            backgroundColor: this.backgroundColor,
            zIndex: this.zIndex,
            fontFamily: this.fontFamily,
            fontStyle: this.fontStyle,
            image: this.image
        }
    }

    static fromData(data) {
        let slideElement = new SlideElement()
        slideElement.size = Vector2d.fromData(data.size)
        slideElement.position = Vector2d.fromData(data.position)
        slideElement.rotation = data.rotation
        slideElement.scale = data.scale
        slideElement.opacity = data.opacity
        slideElement.borderColor = data.borderColor
        slideElement.borderWidth = data.borderWidth
        slideElement.borderRadius = data.borderRadius
        slideElement.borderStyle = data.borderStyle
        slideElement.boxShadow = data.boxShadow
        slideElement.text = data.text
        slideElement.textColor = data.textColor
        slideElement.textSize = data.textSize
        slideElement.textAlign = data.textAlign
        slideElement.backgroundTransparency = data.backgroundTransparency
        slideElement.backgroundColor = data.backgroundColor
        slideElement.backgroundPureColor = data.backgroundPureColor
        slideElement.textContent = ""
        slideElement.zIndex = data.zIndex
        slideElement.fontFamily = data.fontFamily
        slideElement.fontStyle = data.fontStyle
        slideElement.image = data.image
        loadtextContentWithLineBreaks(slideElement.container, data.text)
        slideElement.update()
        return slideElement
    }

    bringToFront() {
        let largestZIndex = getHighestZIndex()
        this.zIndex = largestZIndex + 1
        this.update()
    }

    bringToBack() {
        let smallestZIndex = getLowestZIndex()
        this.zIndex = smallestZIndex - 1
        this.update()
    }

    remove() {
        this.container.remove()
        this.slide.elements.splice(this.slide.elements.indexOf(this), 1)
    }

}

class Slide {

    makeDOM() {
        let container = document.createElement("div")
        container.classList.add("sidebar-slide")
        let text = document.createElement("div")
        text.classList.add("sidebar-slide-text")
        let numSlides = document.querySelectorAll(".sidebar-slide").length
        text.textContent = `Folie #${numSlides + 1}`
        let deleteButton = document.createElement("div")
        deleteButton.classList.add("sidebar-slide-delete")
        deleteButton.title = "Folie löschen"
        deleteButton.textContent = "-"
        let duplicateButton = document.createElement("div")
        duplicateButton.classList.add("sidebar-slide-duplicate")
        duplicateButton.title = "Folie duplizieren"
        duplicateButton.textContent = "+"
        container.appendChild(text)
        container.appendChild(deleteButton)
        container.appendChild(duplicateButton)

        deleteButton.onclick = function() {
            container.remove()
            this.presentation.slides.splice(this.presentation.slides.indexOf(this), 1)
            this.presentation.updateSlideNumbers()
        }.bind(this)

        duplicateButton.onclick = function() {
            duplicateSlide(this)
        }.bind(this)

        CONSTANTS.SIDEBAR.appendChild(container)

        container.addEventListener("click", function() {
            this.load()
        }.bind(this))

        return container
    }

    constructor(presentation) {
        this.presentation = presentation
        this.container = this.makeDOM()
        this.elements = Array()
        this.num = this.presentation.slides.length + 1
    }

    drawElements() {
        if (!this.presentation.isPresenting)
            CONSTANTS.SLIDE.innerHTML = ""
        for (let element of this.elements) {
            element.update()
            if (element.container.classList.contains("unload"))
                element.container.classList.remove("unload")
            if (this.presentation.isPresenting) {
                element.container.classList.add("presenting")
            } else if (element.container.classList.contains("presenting")) {
                element.container.classList.remove("presenting")
            }
            CONSTANTS.SLIDE.appendChild(element.container)
        }
    }

    load() {
        for (let slideContainer of document.querySelectorAll(".sidebar-slide")) {
            if (slideContainer.classList.contains("active")) {
                slideContainer.classList.remove("active")
            }
        }
        this.container.classList.add("active")
        this.drawElements()
        selectedSlide = this
        if (selectedElement) {
            selectedElement.removeMovementOptions()
            selectedElement.container.classList.remove("customFocus")
            selectedElement = null
        }
    }

    unload() {
        return new Promise(async function(resolve, reject) {
            for (let element of this.elements) {
                if (element.container.classList.contains("presenting")) {
                    element.container.classList.remove("presenting")
                    element.container.classList.add("unload")
                }
            }
            resolve()
        }.bind(this))
    }

    makeElement() {
        let element = new SlideElement()
        this.elements.push(element)
        element.slide = this
        adjustElementToContextMenu(element)
        this.load()
        return element
    }

    export() {
        return {
            index: this.num,
            elements: this.elements.map(element => element.export())
        }
    }

    static fromData(data, presentation) {
        let slide = new Slide(presentation)
        slide.num = data.index
        for (let element of data.elements) {
            let sElement = SlideElement.fromData(element)
            slide.elements.push(sElement)
            sElement.slide = slide
        }
        return slide
    }

}

let nextSlideFunc = null

class Presentation {

    update() {
        for (let slide of this.slides) {
            for (let element of slide.elements) {
                element.update()
            }
        }
    }

    constructor(makeSlide=true) {
        this.slides = Array()
        if (makeSlide) {
            let newSlide = this.makeSlide()
            newSlide.load()
        }
        this.isPresenting = false
    }

    makeSlide() {
        let newSlide = new Slide(this)
        this.slides.push(newSlide)
        this.update()
        return newSlide
    }

    updateSlideNumbers() {
        let slideElements = document.querySelectorAll(".sidebar-slide")
        for (let i = 0; i < slideElements.length; i++) {
            slideElements[i].querySelector(".sidebar-slide-text").textContent = `Folie #${i + 1}`
            slideElements[i].num = i + 1
        }
    }

    present() {
        if (selectedElement) {
            selectedElement.removeMovementOptions()
            selectedElement.container.classList.remove("customFocus")
            selectedElement = null
        }

        let PRESENTATION_RUNNING = true
        this.isPresenting = true

        CONSTANTS.PRESENT_OVERLAY.style.display = "block"
        CONSTANTS.PRESENT_OVER_OVERLAY.style.display = "block"

        console.log("presentation started")

        function stopPresentation(presentation) {
            if (!PRESENTATION_RUNNING) return
            CONSTANTS.PRESENT_OVERLAY.style.display = "none"
            CONSTANTS.PRESENT_OVER_OVERLAY.style.display = "none"
            makeSlideNotMaxSize()
            presentation.isPresenting = false
            presentation.slides[0].load()
            console.log("presentation stopped")
            PRESENTATION_RUNNING = false
            nextSlideFunc = null
        }

        makeSlideMaxSize()

        let slideIndex = -1

        let endBlackScreenShown = false

        let nextSlide = async function(presentation) {
            if (slideIndex < presentation.slides.length - 1) {
                if (presentation.slides[slideIndex])
                    await presentation.slides[slideIndex].unload()
                slideIndex++
                presentation.slides[slideIndex].load()
            } else if(!endBlackScreenShown) {
                endBlackScreenShown = true
                await presentation.slides[slideIndex].unload()
                CONSTANTS.SLIDE_CONTAINER.style.opacity = "0"
            } else {
                CONSTANTS.SLIDE_CONTAINER.style.opacity = "1"
                stopPresentation(presentation)
            }
        }

        nextSlideFunc = nextSlide
        
        let previousSlide = async function(presentation) {
            if (endBlackScreenShown) {
                nextSlide(presentation)
                return
            }
            if (slideIndex > 0) {
                await presentation.slides[slideIndex].unload()
                slideIndex--
                presentation.slides[slideIndex].load()
            }
        }

        document.addEventListener("keydown", function(e) {
            if (!PRESENTATION_RUNNING) return
            if (e.key === "ArrowRight") {
                nextSlide(this)
            } else if (e.key === "ArrowLeft") {
                previousSlide(this)
            } else if (e.key === "Escape") {
                stopPresentation(this)
            }
        }.bind(this))

        CONSTANTS.SLIDE.innerHTML = ""
        nextSlide(this)
    }

    export() {
        return {
            slides: this.slides.map(slide => slide.export())
        }
    }

    static fromData(data) {
        CONSTANTS.SLIDE.innerHTML = ""
        CONSTANTS.SIDEBAR.innerHTML = ""
        let presentation = new Presentation(false)
        for (let slide of data.slides) {
            let newSlide = Slide.fromData(slide, presentation)
            presentation.slides.push(newSlide)
            presentation.update()
        }
        presentation.updateSlideNumbers()
        presentation.slides[0].load()
        return presentation
    }

}

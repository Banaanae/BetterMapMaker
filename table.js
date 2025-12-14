let size = { // Defaults
    tile: 20,

    mapWidth: 22,
    mapHeight: 32,

    blockWidth: 20,
    blockHeight: 30,

    floorWidth: 20,
    floorHeight: 20,

    playerspawnWidth: 32,
    playerspawnHeight: 32,

    largeWidth: 40,
    largeHeight: 40,

    tileOffsetY: 10
}

let colours = {"Default": ["#ec9e6f", "#f9a575"]}

const canvas = document.getElementById("map")
const ctx = canvas.getContext("2d")

let mapData = []


function getSizeAndCreateTable() {
    switch (gamemodes[gmSelector.value][0]) {
        case "normal":   size.mapWidth  = 22
                         size.mapHeight = 32
                         spriteAndTileSize(20)
                         break
        case "siege":    size.mapWidth  = 28
                         size.mapHeight = 38
                         spriteAndTileSize(20)
                         break
        case "large":    size.mapWidth  = 60
                         size.mapHeight = 60
                         spriteAndTileSize(10)
                         break
        case "training": size.mapWidth  = 17
                         size.mapHeight = 33
                         spriteAndTileSize(20)
                         break
    }

    canvas.width = size.mapWidth * size.tile
    canvas.height = size.mapHeight * size.tile + size.tileOffsetY

    mapData = Array.from({ length: size.mapHeight }, () =>
        Array(size.mapWidth).fill(null)
    )

    drawMap()
}

function spriteAndTileSize(tileSizeCalc) {
    size.tile = tileSizeCalc

    size.blockWidth = tileSizeCalc
    size.blockHeight = tileSizeCalc * 1.5

    size.floorWidth = tileSizeCalc
    size.floorHeight = tileSizeCalc

    size.playerspawnWidth = tileSizeCalc + (7 * (tileSizeCalc / 10))  // Where 7 is the px amount over the tile
    size.playerspawnHeight = tileSizeCalc + (7 * (tileSizeCalc / 10))

    size.largeWidth = tileSizeCalc * 2
    size.largeHeight = tileSizeCalc * 2

    size.tileOffsetY = size.blockHeight - size.blockWidth
}

function drawTiles() {
    for (let y = 0; y < size.mapHeight; y++) {
        for (let x = 0; x < size.mapWidth; x++) {
            ctx.fillStyle = colours.Default[(x + y) % 2]
            ctx.fillRect(
                x * size.tile,
                y * size.tile + size.tileOffsetY,
                size.tile,
                size.tile
            )
        }
    }
}

let sprites = {}

function drawSprites() {
    for (let y = 0; y < size.mapHeight; y++) {
        for (let x = 0; x < size.mapWidth; x++) {
            if (mapData[y][x] !== null) {
                if (!sprites.hasOwnProperty(tileSelector.value)) {
                    let spriteImg = new Image()
                    spriteImg.src = `assets/${tileSet[tileSelector.value][2] ? "Default/" : ""}${tileSet[tileSelector.value][0]}.png`
                    sprites[tileSelector.value] = spriteImg
                }
                let type = tileSet[mapData[y][x]][1]
                ctx.drawImage(
                    sprites[mapData[y][x]],
                    getXFromType(type, x),
                    getYFromType(type, y),
                    getSizeFromType(type, "width"),
                    getSizeFromType(type, "height")
                )
            }
        }
    }
}

function getXFromType(type, x) {
    if (type === "playerspawn")
        return x * size.tile - (size.playerspawnHeight - size.tile) / 2
    return x * size.tile
}

function getYFromType(type, y) {
    switch (type) {
        case 'block': return (y + 1) * size.tile - size.blockHeight + size.tileOffsetY
        case 'floor': return (y + 1) * size.tile - size.tileOffsetY
        case 'playerspawn': return (y + 1) * size.tile - size.tileOffsetY - (size.playerspawnHeight - size.tile) / 2
        case 'large': return (y + 1) * size.tile - size.tileOffsetY
    }
}

function getSizeFromType(type, axis) {
    switch (type) {
        case 'block': return (axis === "width" ? size.blockWidth : size.blockHeight)
        case 'floor': return (axis === "width" ? size.floorWidth : size.floorHeight)
        case 'playerspawn': return (axis === "width" ? size.playerspawnWidth : size.playerspawnHeight)
        case 'large': return (axis === "width" ? size.largeWidth : size.largeHeight)
    }
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTiles()
    drawSprites()
}

let isDrawing = false

const dragDraw = document.getElementById("dragDraw")

canvas.addEventListener("mousedown", e => {
    isDrawing = true
    paintTile(e)
})

canvas.addEventListener("mousemove", e => {
    if (dragDraw.checked && isDrawing) paintTile(e)
})

document.addEventListener("mouseup", () => {
    isDrawing = false
})

function paintTile(e) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / size.tile)
    const y = Math.floor((e.clientY - rect.top - size.tileOffsetY) / size.tile)

    if (x < 0 || y < 0 || x >= size.mapWidth || y >= size.mapHeight) return

    mapData[y][x] = drawingTileCode
    drawMap()
}

const tileSelector = document.getElementById("tiles")
for (let tile in tileSet) {
    const opt = document.createElement("option")
    opt.innerText = tileSet[tile][0]
    opt.value = tile
    tileSelector.appendChild(opt)
}

let drawingTileCode = ".";
tileSelector.addEventListener("change", function () {
    drawingTileCode = tileSelector.value
})

const gmSelector = document.getElementById("gm")
for (let gamemode in gamemodes) {
    const opt = document.createElement("option")
    opt.innerText = gamemode
    gmSelector.appendChild(opt)
}

gmSelector.addEventListener("change", getSizeAndCreateTable)
getSizeAndCreateTable()

// Map content management

function loadContentFromString(content) {
    // Normalise

}

function getTemplate(gmData) {

}

function saveMapToString() {

}
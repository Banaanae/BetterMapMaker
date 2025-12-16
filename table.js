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
        case "normal":   size.mapWidth  = 21
                         size.mapHeight = 33
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

    if (gamemodes[gmSelector.value][1] === "default") {
        mapData = Array.from({ length: size.mapHeight }, () =>
            Array(size.mapWidth).fill(".")
        )
    } else {
        mapData = gamemodes[gmSelector.value][1]
        let i = 0
        mapData.forEach(row => {
            mapData[i] = row.split("")
            i++
        })
    }

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
            const tile = mapData[y][x]
            if (tile === ".") continue

            if (!sprites[tile]) {
                const img = new Image()
                img.onload = () => {
                    requestAnimationFrame(drawSprites)
                }
                img.src = `assets/${tileSet[tile][2] ? "Default/" : ""}${tileSet[tile][0]}.png`
                sprites[tile] = img
            }

            const img = sprites[tile]
            if (!img.complete) continue // not loaded

            const type = tileSet[tile][1]
            ctx.drawImage(
                img,
                getXFromType(type, x),
                getYFromType(type, y),
                getSizeFromType(type, "width"),
                getSizeFromType(type, "height")
            )
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

    let mirrorMode = document.getElementById("mirror").value

    mapData[y][x] = drawingTileCode
    if (mirrorMode === "Horizontal" || mirrorMode === "All") {
        mapData[y][size.mapWidth - x - 1] = drawingTileCode
    }
    if (mirrorMode === "Vertical" || mirrorMode === "All") {
        mapData[size.mapHeight - y - 1][x] = drawingTileCode
    }
    if (mirrorMode === "Diagonal" || mirrorMode === "All") {
        mapData[size.mapHeight - y - 1][size.mapWidth - x - 1] = drawingTileCode
    }
    drawMap()
}

const tileSelector = document.getElementById("tiles")
for (let tile in tileSet) {
    const opt = document.createElement("option")
    opt.innerText = tileSet[tile][0]
    opt.value = tile
    tileSelector.appendChild(opt)
}

let drawingTileCode = "1";
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

document.getElementById("load").addEventListener("click", function () {
    const input = document.createElement("input")
    input.type = "file"
    input.click()
    input.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const fileContents = e.target.result;
                mapData = loadContentFromString(fileContents)
                drawMap()
            };

            reader.onerror = function(e) {
                console.error(e.target.error);
            };

            reader.readAsText(file);
            
        }
    })
})

function loadContentFromString(content) {
    content = content.replace(/[^,]*/, "") // We can store name for csv gen
    content = content.replaceAll(/^,|["\n]/gm, "")
    let rowArr = content.split(","), i = 0
    rowArr.forEach(row => {
        rowArr[i] = row.split("")
        i++
    })
    return rowArr
}

document.getElementById("save").addEventListener("click", function () {
    saveMapToString(mapData, "todo")
})

function saveMapToString(mapData, mapName) {
    let mapStr = '';
    mapData.forEach(row => {
        mapStr += ',"'
        row.forEach(tile => {
            mapStr += tile
        })
        mapStr += '",\n'
    });

    const blob = new Blob([mapStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = "maps.csv"

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById("saveImg").addEventListener("click", function () {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'map.png');
    canvas.toBlob(blob => {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
})
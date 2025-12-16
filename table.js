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

    hotzoneWidth: 140, // Technically 141 but i dont want it to
    hotzoneHeight: 140,

    largeWidth: 40,
    largeHeight: 40,

    tileOffsetY: 10
}

let colours = {"Default": ["#ec9e6f", "#f9a575"]}

const canvas = document.getElementById("map")
const ctx = canvas.getContext("2d")

let mapData = [], obData = []
const drawingOb = document.getElementById("ob")


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
        obData = Array.from({ length: size.mapHeight }, () =>
            Array(size.mapWidth).fill(false) // May move away from bool if used for id
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

    size.hotzoneWidth = tileSizeCalc + (60 * (tileSizeCalc / 10))
    size.hotzoneHeight = tileSizeCalc + (60 * (tileSizeCalc / 10))

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

            if (tile === "8" && gmSelector.value !== tileSet["8"][0]) {
                console.log("8")
                if (!sprites["8"]) {
                    sprites["8"] = new Image()
                }
                const img = sprites["8"]
                img.onload = () => {
                    requestAnimationFrame(drawSprites)
                }
                switch (gmSelector.value) {
                    case "Gem Grab": img.src = "assets/Default/Gem Mine.png"; tileSet["8"] = ["Gem Grab", "playerspawn", true]; break
                    case "Heist": img.src = "assets/Default/Safe.png"; tileSet["8"] = ["Heist", "floor", true]; break
                    case "Bounty": img.src = "assets/Default/Blue Star.png"; tileSet["8"] = ["Bounty", "floor", true]; break
                    case "Brawl Ball": img.src = "assets/Default/Brawl Ball.png"; tileSet["8"] = ["Brawl Ball", "floor", true]; break
                    case "Trophy Thieves": img.src = "assets/Trophy.png"; tileSet["8"] = ["Trophy Thieves", "floor", true]; break
                    case "Hot Zone": img.src = "assets/Hot Zone.png"; tileSet["8"] = ["Hot Zone", "hotzone", false]; break
                    case "Basket Brawl": img.src = "assets/Basket Ball.png"; tileSet["8"] = ["Basket Brawl", "floor", false]; break
                    case "Brawl Hockey": img.src = "assets/Hockey Puck.png"; tileSet["8"] = ["Brawl Hockey", "floor", false]; break
                    case "Volley Brawl": img.src = "assets/Volley Ball.png"; tileSet["8"] = ["Volley Brawl", "floor", false]; break
                    case "Paint Brawl": img.src = "assets/Default/Paint Ball.png"; tileSet["8"] = ["Paint Brawl", "floor", true]; break
                    // case "Payload": img.src = "assets/Default/Payload.png"; tileSet["8"] = ["Payload", "floor", true]; break
                    case "Carry the Gift": img.src = "assets/Gift.png"; tileSet["8"] = ["Carry the Gift", "floor", false]; break
                    default: console.warn("Tile code 8 in:", gmSelector.value); continue
                }
            } else if (!sprites[tile]) {
                const img = new Image()
                img.onload = () => {
                    requestAnimationFrame(drawSprites)
                }
                if (tileSet[tile]) {
                    img.src = `assets/${tileSet[tile][2] ? "Default/" : ""}${tileSet[tile][0]}.png`
                } else {
                    console.warn("Unknown tile code:", tile)
                    continue
                }
                sprites[tile] = img
            }

            const img = sprites[tile]
            if (!img.complete) continue // not loaded

            const type = tileSet[tile][1]
            console.log(tile, type)
            try {
                ctx.drawImage(
                    img,
                    getXFromType(type, x),
                    getYFromType(type, y),
                    getSizeFromType(type, "width"),
                    getSizeFromType(type, "height")
                )
            } catch {
                console.warn("Missing image for tile code:", tile)
            }
        }
    }
}

const obImg = new Image()
obImg.src = "assets/ob.png"

function drawOb() {
    for (let y = 0; y < size.mapHeight; y++) {
        for (let x = 0; x < size.mapWidth; x++) {
            const tile = obData[y][x]
            if (!tile) continue

            ctx.drawImage(
                obImg,
                getXFromType("floor", x),
                getYFromType("floor", y),
                getSizeFromType("floor", "width"),
                getSizeFromType("floor", "height")
            )
        }
    }
}

function getXFromType(type, x) {
    if (type === "playerspawn")
        return x * size.tile - (size.playerspawnWidth - size.tile) / 2
    else if (type === "hotzone")
        return x * size.tile - (size.hotzoneWidth - size.tile) / 2
    return x * size.tile
}

function getYFromType(type, y) {
    switch (type) {
        case 'block': return (y + 1) * size.tile - size.blockHeight + size.tileOffsetY
        case 'floor': return (y + 1) * size.tile - size.tileOffsetY
        case 'playerspawn': return (y + 1) * size.tile - size.tileOffsetY - (size.playerspawnHeight - size.tile) / 2
        case 'hotzone': return (y + 1) * size.tile - size.tileOffsetY - (size.hotzoneHeight - size.tile) / 2
        case 'large': return (y + 1) * size.tile - size.tileOffsetY
    }
}

function getSizeFromType(type, axis) {
    switch (type) {
        case 'block': return (axis === "width" ? size.blockWidth : size.blockHeight)
        case 'floor': return (axis === "width" ? size.floorWidth : size.floorHeight)
        case 'playerspawn': return size.playerspawnWidth
        case 'hotzone': return size.hotzoneWidth
        case 'large': return size.largeWidth
    }
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTiles()
    drawSprites()
    drawOb()
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
    let offset = 1 + (tileSet[tileSelector.value][1] === "large")

    let data = (drawingOb.checked ? obData : mapData)

    data[y][x] = drawingTileCode
    if (mirrorMode === "Horizontal" || mirrorMode === "All") {
        data[y][size.mapWidth - x - offset] = drawingTileCode
    }
    if (mirrorMode === "Vertical" || mirrorMode === "All") {
        data[size.mapHeight - y - offset][x] = drawingTileCode
    }
    if (mirrorMode === "Diagonal" || mirrorMode === "All") {
        data[size.mapHeight - y - offset][size.mapWidth - x - offset] = drawingTileCode
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

const envSelector = document.getElementById("env")
for (let environment in environments) {
    const opt = document.createElement("option")
    opt.innerText = environment
    envSelector.appendChild(opt)
}

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
    content = content.replace(/\{.*/, "") // MetaData
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
    let first = true
    let mapStr = '';
    mapData.forEach(row => {
        mapStr += ',"'
        row.forEach(tile => {
            mapStr += tile
        })
        mapStr += '",\n'
        if (first) {
            let meta = '"{""data"":['
            first = false
            mapStr = mapStr.replace("\n", "")
            for (const [y, row] of obData.entries()) {
                for (const [x, ob] of row.entries()) { // Quadruple nested for loop yippee
                    if (ob)
                        meta += `{""x"":${x},""y"":${y},""ob"":true},`
                }
            }
            meta = meta.replace(/,$/, ']}"\n')
            if (meta !== '"{""data"":[')
                mapStr += meta
            else
                mapStr += "\n"
        }
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
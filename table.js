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
        let i = 0
        gamemodes[gmSelector.value][1].forEach(row => {
            mapData[i] = row.split("")
            i++
        })
    }

    const teamSize = document.getElementById("teamSize")
    teamSize.replaceChildren()
    gamemodes[gmSelector.value][2].forEach(size => {
        let opt = document.createElement("option")
        opt.innerText = size
        teamSize.appendChild(opt)
    })

    drawMap()
    buildTilePicker()
    document.querySelector("#tileWrapper span").id = "selected"
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
                if (!sprites["8"]) {
                    sprites["8"] = new Image()
                }
                const img = sprites["8"]
                img.onload = () => {
                    requestAnimationFrame(drawSprites)
                }
                if (!setupTile8(gmSelector.value, img))
                    continue
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

function setupTile8(gm, img) {
    switch (gm) {
        case "Gem Grab": img.src = "assets/Default/Gem Mine.png"; tileSet["8"] = ["Gem Grab", "playerspawn", true, "Special"]; return true
        case "Heist": img.src = "assets/Default/Safe.png"; tileSet["8"] = ["Heist", "floor", true, "Special"]; return true
        case "Bounty": img.src = "assets/Default/Blue Star.png"; tileSet["8"] = ["Bounty", "floor", true, "Special"]; return true
        case "Brawl Ball": img.src = "assets/Default/Brawl Ball.png"; tileSet["8"] = ["Brawl Ball", "floor", true, "Special"]; return true
        case "Trophy Thieves": img.src = "assets/Trophy.png"; tileSet["8"] = ["Trophy Thieves", "floor", true, "Special"]; return true
        case "Hot Zone": img.src = "assets/Hot Zone.png"; tileSet["8"] = ["Hot Zone", "hotzone", false, "Special"]; return true
        case "Basket Brawl": img.src = "assets/Basket Ball.png"; tileSet["8"] = ["Basket Brawl", "floor", false, "Special"]; return true
        case "Brawl Hockey": img.src = "assets/Hockey Puck.png"; tileSet["8"] = ["Brawl Hockey", "floor", false, "Special"]; return true
        case "Volley Brawl": img.src = "assets/Volley Ball.png"; tileSet["8"] = ["Volley Brawl", "floor", false, "Special"]; return true
        case "Paint Brawl": img.src = "assets/Default/Paint Ball.png"; tileSet["8"] = ["Paint Brawl", "floor", true, "Special"]; return true
        // case "Payload": img.src = "assets/Default/Payload.png"; tileSet["8"] = ["Payload", "floor", true, "Special"]; return true
        case "Carry the Gift": img.src = "assets/Gift.png"; tileSet["8"] = ["Carry the Gift", "floor", false, "Special"]; return true
        default: console.warn("Tile code 8 in:", gm); return false
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

canvas.addEventListener("pointerdown", startDraw)
canvas.addEventListener("pointermove", paintHelper)
document.addEventListener("pointerup", stopDraw)
canvas.addEventListener("pointerleave", stopDraw)


function startDraw(e) {
    canvas.setPointerCapture(e.pointerId)
    isDrawing = true
    paintTile(e)
}

function paintHelper(e) {
    if (dragDraw.checked && isDrawing)
        paintTile(e)
}

function stopDraw(e) {
    isDrawing = false
    canvas.releasePointerCapture?.(e.pointerId)
}

function paintTile(e) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / size.tile)
    const y = Math.floor((e.clientY - rect.top - size.tileOffsetY) / size.tile)

    if (x < 0 || y < 0 || x >= size.mapWidth || y >= size.mapHeight) return

    let mirrorMode = document.getElementById("mirror").value
    let offset = 1 + (tileSet[document.getElementById("selected").getAttribute("code")][1] === "large")

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

let tilePicker = {
    "Map": document.createElement("div"),
    "Special": document.createElement("div"),
    "Movement": document.createElement("div"),
    "Decoration": document.createElement("div"),
}

const tileWrapper = document.getElementById("tileWrapper")
const gmSelector = document.getElementById("gm")
const envSelector = document.getElementById("env")

function buildTilePicker() {
    tilePicker.Map.replaceChildren()
    tilePicker.Special.replaceChildren()
    tilePicker.Movement.replaceChildren()
    tilePicker.Decoration.replaceChildren()
    for (let tile in tileSet) {
        let allowed = isAllowedInGmAndEnv(tile)
        if (allowed === false) continue

        const opt = document.createElement("span")
        opt.title = tileSet[tile][0]
        opt.setAttribute("code", tile)
        opt.addEventListener("click", setDrawingCode)
        const optImg = document.createElement("img")
        if (tile !== "8")
            optImg.src = `assets/${tileSet[tile][2] ? "Default/" : ""}${tileSet[tile][0]}.png`
        else
            optImg.src = allowed.src
        opt.appendChild(optImg)
        tilePicker[tileSet[tile][3]].appendChild(opt)
    }

    tileWrapper.appendChild(tilePicker.Map)
    tileWrapper.appendChild(tilePicker.Special)
    tileWrapper.appendChild(tilePicker.Movement)
    tileWrapper.appendChild(tilePicker.Decoration)
}

let drawingTileCode = ".";

function setDrawingCode(event) {
    document.getElementById("selected").id = ""

    let selectedSpan;
    if (event.target.tagName === "SPAN")
        selectedSpan = event.target
    else
        selectedSpan = event.target.parentElement

    selectedSpan.id = "selected"
    drawingTileCode = selectedSpan.getAttribute("code")
}

function isAllowedInGmAndEnv(tile) {
    const gm = gmSelector.value
    const env = envSelector.value
    let img = {} // bit janky, but gets src to use in tile picker

    if (tile === "8") {
        if (!setupTile8(gm, img))
            return false
        else return img // not false, also not true
    } else if (tile === "o" && !(gm === "Brawl Ball" || gm === "Volley Brawl" ||
        gm === "Basket Brawl" || gm === "Paint Brawl" || gm === "Brawl Hockey"))
        return false
    // else if !((tile === "6" || tile === "7") && (gm === "Brawl Ball" ||
    //    gm === "Volley Brawl" || gm === "Paint Brawl" || gm === "Brawl Hockey"))
    //    return false
    // TODO: Check this, dodgeball has both with and without
    //       so it might just be sd and knockout duels
    //       also to consider: if no effect just put in info?
    
    return true
}

for (let environment in environments) {
    const opt = document.createElement("option")
    opt.innerText = environment
    envSelector.appendChild(opt)
}

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

    const blob = new Blob([mapStr], { type: 'text/csv;charset=utf-8' });
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

// Error checking

document.getElementById("errors").addEventListener("click", checkErrors)
const errorList = document.getElementById("errorList")

function checkErrors() {
    let errors = ["Errors (cause crashes):"]
    let warnings = ["Warning (potentially unintended):"]
    let info = ["Info (not immediately obvious):"]
    errorList.value = ""

    let gm = gmSelector.value
    
    // Most checks are just counting tiles
    let counter1 = 0, counter2 = 0, counter8 = 0

    mapData.forEach(row => {
        row.forEach(tile => {
            switch (tile) {
                case "1": counter1++; break
                case "2": counter2++; break
                case "8": counter8++; break
            }
        })
    })

    let teamMax = getTeamMax(gm)

    if (counter1 < teamMax)
        warnings.push(`Not enough blue team spawns, extra players will get stuck at (0,0) (wanted ${teamMax}; got ${counter1})`)

    if (((gm === "Duo Showdown" || gm === "Trio Showdown") && counter2 < (teamMax)))
        warnings.push(`Not enough spawns, extra players will get stuck at (0,0) (wanted ${teamMax}; got ${counter2})`) // TODO: may be error
    else if (counter2 < teamMax && getTeamCount(gm) > 1)
        warnings.push(`Not enough red team spawns, extra players will get stuck at (0,0) (wanted ${teamMax}; got ${counter2})`)

    if (gm === "Gem Grab") {
        if (counter8 > 2)
            warnings.push(`Too many gem mines, only first 2 will load (got ${counter8})`)
        else if (counter8 === 0)
            info.push("No gem mines placed, will default to centre (regardless if empty)")
    }

    if (errors.length === 1)
        errors.push("  (none found)")
    if (warnings.length === 1)
        warnings.push("  (none found)")
    if (info.length === 1)
        info.push("  (none found)")

    errors.forEach(error => {
        errorList.value += error + "\n"
    })
    errorList.value += "\n"
    warnings.forEach(warning => {
        errorList.value += warning + "\n"
    })
    errorList.value += "\n"
    info.forEach(knowledge => {
        errorList.value += knowledge + "\n"
    })
}

function getTeamMax(gm) {
    const size = document.getElementById("teamSize").value

    if (size === "2v2") {
        return 2
    } else if (size === "3v3") {
        return 3
    } else if (size === "5v5") {
        return 5
    } else if (size === "Solo") {
        if (gm === "Training Grounds" || gm === "Tutorial" || gm === "Duels") {
            return 1
        } else {
            return 10
        }
    }

    console.warn("Falling back to 3\ngm:", gm, "size:", size)
    return 3 // fallback
}

function getTeamCount(gm) {
    if (gm === "Training Grounds" || gm === "Tutorial" || gm === "Duels") // not sd as solo and duo are merged (todo)
        return 1

    console.log("Falling back to 2\ngm:", gm)
    return 2
}
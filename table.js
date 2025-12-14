let tileSize = 20
let spriteWidth = 20
let spriteHeight = 30
let tileOffsetY = 10

let colours = ["#ec9e6f", "#f9a575"]

const canvas = document.getElementById("map")
const ctx = canvas.getContext("2d")

let width = 1
let height = 1

let mapData = []


function getSizeAndCreateTable() {
    switch (gamemodes[gmSelector.value][0]) {
        case "normal":   width  = 22
                         height = 32
                         spriteAndTileSize(20)
                         break
        case "siege":    width  = 28
                         height = 38
                         spriteAndTileSize(20)
                         break
        case "large":    width  = 60
                         height = 60
                         spriteAndTileSize(10)
                         break
        case "training": width  = 17
                         height = 33
                         spriteAndTileSize(20)
                         break
    }

    canvas.width = width * tileSize
    canvas.height = height * tileSize + tileOffsetY

    mapData = Array.from({ length: height }, () =>
        Array(width).fill(null)
    )

    drawMap()
}

function spriteAndTileSize(tileSizeCalc) {
    tileSize = tileSizeCalc
    spriteHeight = tileSize * 1.5
    spriteWidth = tileSizeCalc
    tileOffsetY = spriteHeight - spriteWidth
}

function drawTiles() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = colours[(x + y) % 2]
            ctx.fillRect(
                x * tileSize,
                y * tileSize + tileOffsetY,
                tileSize,
                tileSize
            )
        }
    }
}

const sprite = new Image()
sprite.src = "assets/Indestructible.png"

function drawSprites() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (mapData[y][x] === "I") {
                ctx.drawImage(
                    sprite,
                    x * tileSize,
                    (y + 1) * tileSize - spriteHeight + tileOffsetY, // bottom align
                    spriteWidth,
                    spriteHeight
                )
            }
        }
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
    const x = Math.floor((e.clientX - rect.left) / tileSize)
    const y = Math.floor((e.clientY - rect.top - tileOffsetY) / tileSize)

    if (x < 0 || y < 0 || x >= width || y >= height) return

    mapData[y][x] = drawingTileCode
    drawMap()
}



const tileSet = {
    "Open": ".",
    "Wall 1": "M",
    "Wall 2": "X",
    "Crate": "Y",
    "Barrel": "C",
    "Intangible Decoration": "D",
    "Indestructible": "I",
    "Bush": "F",
    "Bush 2": "R",
    "Water": "W",
    "Wall 3": "T",
    "Invisible Water": "V",
    "Fragile Decoration": "B",
    "Fence": "N",
    "Invisible Indestructible": "J",
    "Rope Fence": "a",
    "Poison Cloud": "x",
    "Slow": "z",
    "Fast": "w",
    "Spikes": "v",
    "Bouncer": "o",
    "Indestructible Fence": "E",
    "Snow": "S",
    "Ice": "q",

    //"ExtraBush": "-",
    "Blue spawn": "1",
    "Red Spawn": "2",
    "Solo Showdown Spawn": "1",
    "Duo Showdown Spawn": "2",
    "Trio Showdown Spawn": "3",
    "Blue Respawn": "6",
    "Red Respawn": "7",
    "Power Crate": "4",
    "Heist": "8",
    "Hot Zone": "8",
    "SpringBoard": ".",
    "Blue Teleport": "c",
    "Green Teleport": "d",
    "Red Teleport": "e",
    "Yellow Teleport": "f",
    //"Siege Bolt": ".",
    "Healing": "y",
    "Brawl Ball": "8",
    "Spring Board N": "K",
    "Spring Board NE": "U",
    "Spring Board E": "H",
    "Spring Board SE": "P",
    "Spring Board S": "L",
    "Spring Board SW": "O",
    "Spring Board W": "G",
    "Spring Board NW": "Z",
}

const gamemodes = { // "Gamemode": ["map size", "template"]
    "Training Grounds": ["training", "default"],
    // "Tutorial": ["training", "default"],
    "Gem Grab": ["normal", "default"],
    "Heist": ["normal", "default"],
    "Bounty": ["normal", "default"],
    "Brawl Ball": ["normal", "default"],
    "Trophy Thieves": ["normal", "default"],
    "Hot Zone": ["normal", "default"],
    "Knockout": ["normal", "default"],
    "Basket Brawl": ["normal", "default"],
    "Wipeout": ["normal", "default"],
    "Brawl Hockey": ["normal", "default"],
    "Treasure Hunt": ["normal", "default"],
    "Dodgebrawl": ["normal", "default"],
    "Volley Brawl": ["normal", "default"],
    "Paint Brawl": ["normal", "default"],
    "Siege": ["siege", "default"],
    "Payload": ["normal", "default"],
    "Carry the Gift": ["normal", "default"],
    "Bot Drop": ["normal", "default"],
    "Godzilla City Smash": ["large", "default"],
    "Cleaning Duty": ["normal", "default"],
    "Special Delivery": ["normal", "default"],
    "Solo Showdown": ["large", "default"],
    "Duo Showdown": ["large", "default"],
    "Trio Showdown": ["large", "default"],
    "Duels": ["normal", "default"],
    "Hunters": ["large", "default"],
    "Takedown": ["large", "default"],
    "Lone Star": ["large", "default"],
    "Trophy Escape": ["large", "default"],
    "Drum Roll": ["large", "default"],
    "Big Game": ["large", "default"],
    "Boss Fight": ["large", "default"],
    "Robo Rumble": ["large", "default"],
    "Super City Rampage": ["large", "default"],
    "Last Stand": ["large", "default"],
}

const gmSelector = document.getElementById("gm")
for (let gamemode in gamemodes) {
    const opt = document.createElement("option")
    opt.innerText = gamemode
    gmSelector.appendChild(opt)
}

gmSelector.addEventListener("change", getSizeAndCreateTable)
getSizeAndCreateTable()

const tileSelector = document.getElementById("tiles")
for (let tile in tileSet) {
    const opt = document.createElement("option")
    opt.innerText = tile
    tileSelector.appendChild(opt)
}

let drawingTileCode = ".";
tileSelector.addEventListener("change", function () {
    drawingTileCode = tileSet[tileSelector.value]
})

// Map content management

function loadContentFromString(content) {
    // Normalise

}

function getTemplate(gmData) {

}

function saveMapToString() {

}
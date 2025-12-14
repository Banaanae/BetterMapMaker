let size = { // Defaults
    tile: 20,

    mapWidth: 22,
    mapHeight: 32,

    blockWidth: 20,
    blockHeight: 30,

    floorWidth: 20,
    floorHeight: 20,

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
                ctx.drawImage(
                    sprites[mapData[y][x]],
                    x * size.tile,
                    getYFromType(tileSet[mapData[y][x]][1], y), // bottom align
                    getSizeFromType(tileSet[mapData[y][x]][1], "width"),
                    getSizeFromType(tileSet[mapData[y][x]][1], "height")
                )
            }
        }
    }
}

function getYFromType(type, y) {
    switch (type) {
        case 'block': return (y + 1) * size.tile - size.blockHeight + size.tileOffsetY
        case 'floor': return (y + 1) * size.tile - size.tileOffsetY
        case 'large': return (y + 1) * size.tile - size.tileOffsetY
    }
}

function getSizeFromType(type, axis) {
    switch (type) {
        case 'block': return (axis === "width" ? size.blockWidth : size.blockHeight)
        case 'floor': return (axis === "width" ? size.floorWidth : size.floorHeight)
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



const tileSet = { // "tile code": ["tile name", "tile size", "is themed"]
    ".": ["Open", "floor", false],
    "M": ["Wall 1", "block", true],
    "X": ["Wall 2", "block", true],
    "Y": ["Crate", "block", true],
    "C": ["Barrel", "block", true],
    "D": ["Intangible Decoration", "block", true],
    "I": ["Indestructible", "block", false],
    "F": ["Bush", "block", true],
    "R": ["Bush 2", "block", true],
    "W": ["Water", "floor", true],
    "T": ["Wall 3", "block", true],
    "V": ["Invisible Water", "floor", false],
    "B": ["Fragile Decoration", "block", true],
    "N": ["Fence", "block", true],
    "J": ["Invisible Indestructible", "block", false],
    "a": ["Rope Fence", "block", true],
    "x": ["Poison Cloud", "block", false], // We dont count CN
    "z": ["Slow", "floor", false],
    "w": ["Fast", "floor", false],
    "v": ["Spikes", "floor", false],
    "o": ["Bouncer", "block", false], // confirm theme here
    "E": ["Indestructible Fence", "block", true],
    "S": ["Snow", "block", false], // confirm size here
    "q": ["Ice", "floor", false],

    //"-": ["ExtraBush", "block", true],
    "1": ["Blue spawn", "floor", false],
    "2": ["Red Spawn", "floor", false],
    "1_": ["Solo Showdown Spawn", "floor", false],
    "2_": ["Duo Showdown Spawn", "floor", false],
    "3": ["Trio Showdown Spawn", "floor", false],
    "6": ["Blue Respawn", "floor", false],
    "7": ["Red Respawn", "floor", false],
    "4": ["Power Crate", "block", false],
    "4_": ["TNT", "block", false],
    "8": ["Heist", "block", false],
    "8_": ["Hot Zone", "hotzone", false],
    "c": ["Blue Teleport", "large", false],
    "d": ["Green Teleport", "large", false],
    "e": ["Red Teleport", "large", false],
    "f": ["Yellow Teleport", "large", false],
    //".": ["Siege Bolt", "block", false],
    "y": ["Healing", "large", false],
    "8_": ["Brawl Ball", "block", false],
    "K": ["Spring Board N", "large", false],
    "U": ["Spring Board NE", "large", false],
    "H": ["Spring Board E", "large", false],
    "P": ["Spring Board SE", "large", false],
    "L": ["Spring Board S", "large", false],
    "O": ["Spring Board SW", "large", false],
    "G": ["Spring Board W", "large", false],
    "Z": ["Spring Board NW", "large", false],
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

const environments = { // "environment": "gmSize avail in"
    "Retropolis": "normal", // TODO: string or array?
    // "OldTownLNY": "normal", 
    "OldTown": "normal",
    "OldTownTutorial": "training",
    "Mine": "normal",
    // "MineTrainTracks": "normal",
    "Warehouse": "normal",
    "Oasis": "normal",
    "OasisBeach": "normal",
    "Mortuary": "normal",
    // "MortuaryHW": "normal", // HW?
    "MortuaryShowdown": "large",
    // "MortuaryShowdownHW": "normal",
    "Grassfield": "normal",
    "GrassfieldBeachBall": "normal",
    "Default": "normal",
    "DefaultShowdown": "large",
    "IslandShowdown": "large",
    "DarrylsShip": "normal",
    "DarrylsXmas": "normal",
    "Arcade": "normal",
    "BBArena": "normal",
    // "BBArenaPSG": "normal",
    "Bazaar": "normal",
    "Minicity": "normal",
    "GiftShop": "normal",
    "BandStand": "normal",
    // "BandStandHW": "normal",
    // "SnowtelXmas": "normal",
    "Snowtel": "normal",
    "Scrapyard": "siege",
    "StarrForce": "normal",
    "ActionShow": "normal",
    "WaterPark": "normal",
    "ArcadeBasket": "normal",
    "BBArenaVolley": "normal",
    "CastleCourtyard": "normal",
    "Brawlywood": "normal",
    "FightingGame": "normal",
    "Biodome": "normal",
    "StuntShow": "normal",
    "StuntShowBB": "normal",
    "DeepSea": "normal",
    "RobotFactory": "normal",
    "RobotFactoryShowdown": "large",
    "GhostMetro": "normal",
    "CandyStand": "normal",
    "Hub": "normal",
    "Rooftop": "normal",
    "RumbleJungle": "normal",
    "ArcadeShowdown": "large",
    "StuntShowdown": "large",
    "StuntShowVolley": "normal",
    "EnchantedForest": "normal",
    "RangerRanch": "normal",
    "BizarreCircus": "normal",
    "CoinFactory": "normal",
    "CoinFactoryBB": "normal",
    // "IceIslandShowdownBB": "large", // BB neq brawl ball?
    "IceIslandShowdown": "large",
    "StarrToonsStudio": "normal",
    "LoveSwamp": "normal",
    "BazaarIslandShowdown": "large",
    "MadEvilManor": "normal",
    "MadEvilIslandShowdown": "large",
    "Godzilla": "normal",
    "GodzillaIslandShowdown": "large",
    "MadEvilManorShowdown": "large",
    "Spongebob": "normal",
    "SpongebobBB": "normal",
    "SpongebobShowdown": "large",
    "SpongebobIslandShowdown": "large",
    "MortuaryVolley": "normal",
    "OdditiesShop": "normal",
    "AirHockey": "normal",
    "Skatepark": "normal",
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
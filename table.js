/* let size = document.getElementById("size")
let widthInput = document.getElementById("width")
let heightInput = document.getElementById("height")

size.addEventListener("change", getSizeAndCreateTable)
widthInput.addEventListener("change", getSizeAndCreateTable)
heightInput.addEventListener("change", getSizeAndCreateTable) */

function getSizeAndCreateTable() {
    let width, height;

    switch (gamemodes[gmSelector.value][0]) {
        case "normal":   width  = 22
                         height = 32
                         break
        case "siege":    width  = 28
                         height = 38
                         break
        case "large":    width  = 60
                         height = 60
                         break
        case "training": width  = 17
                         height = 33
                         break
    }

    const table = document.createElement("table")
    const tbody = document.createElement("tbody")
    const fragment = document.createDocumentFragment()

    for (let r = 0; r < height; r++) {
        const tr = document.createElement("tr")

        for (let c = 0; c < width; c++) {
            tr.appendChild(document.createElement("td"))
        }

        fragment.appendChild(tr)
    }

    tbody.appendChild(fragment)
    table.appendChild(tbody)

    const container = document.getElementById("table")
    container.replaceChildren(table)
}

let isDrawing = false

const container = document.getElementById("table")
const dragDraw = document.getElementById("dragDraw")

container.addEventListener("mousedown", e => {
    if (e.target.tagName === "TD") {
        isDrawing = true
        e.target.textContent = drawingTileCode
        e.preventDefault()
    }
})

container.addEventListener("mouseover", e => {
    if (dragDraw.checked && isDrawing && e.target.tagName === "TD") {
        e.target.textContent = drawingTileCode
    }
})

document.addEventListener("mouseup", () => {
    isDrawing = false
})


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
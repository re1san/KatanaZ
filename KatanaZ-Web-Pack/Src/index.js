import "./Styles/app.css";
import loadImage from "./Utils/PromisifyImageLoad";
// =====================< IMPORT ASSETS >====================== //
import BgLight from "./Assets/BgLight.png";
import StaticCave from "./Assets/BgStatic.png";
import Lights from "./Assets/Lights.png";
import Cliffs from "./Assets/MovingCliffs.png";
import LongPlatform from "./Assets/LongPlatform.png";
import Platform1 from "./Assets/Platform1.png";
// console.log(PlatformSrc);
// =====================< IMPORT SPRITES >===================== //
import spriteIdle from "./Sprites/spriteIdle.png";
import spriteIdleLeft from "./Sprites/spriteIdleLeft.png";
import spriteRun from "./Sprites/spriteRun.png";
import spriteRunLeft from "./Sprites/spriteRunLeft.png";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;


const gravity = 0.15;
// =====================< PLAYER CLASS >====================== //
let spriteIdleImg = await loadImage(spriteIdle);
let spriteIdleLeftImg = await loadImage(spriteIdleLeft);
let spriteRunImg = await loadImage(spriteRun);
let spriteRunLeftImg = await loadImage(spriteRunLeft);

class Player {
    constructor() {
        this.speed = 3;
        this.position = {
            x: 80,
            y: 100
        }
        this.width = 115;
        this.height = 112;

        this.velocity = {
            x: 0,
            y: 1
        }
        this.Image = spriteIdleImg;
        this.frames = 0;

        this.sprites = {
            stand: {
                right: spriteIdleImg,
                left: spriteIdleLeftImg,
                cropWidth: 115,
                cropHeight: 112,
                width: 115,
                height: 112
            },
            run: {
                right: spriteRunImg,
                left: spriteRunLeftImg,
                cropWidth: 134,
                cropHeight: 99,
                width: 134,
                height: 99
            }
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 115;
        this.currentCropHeight = 112;
    }
    drawPlayer() {

        ctx.drawImage(this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            this.currentCropHeight,
            this.position.x, this.position.y,
            this.width, this.height);
    }

    // drawPlayer() {
    //     ctx.fillStyle = "#EB4747";
    //     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // }

    updatePlayer() {
        this.frames++;
        if (this.frames > 69) this.frames = 0;

        this.drawPlayer();
        this.position.x = this.position.x + this.velocity.x;
        this.position.y = this.position.y + this.velocity.y;
        if ((this.position.y + this.height) + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }
        // Fall in Death Pit == Game Restart
        // else {
        //     this.velocity.y = 0;
        // }
    }
}
// =====================< PLATFORM CLASS >===================== //
class Platform {
    constructor({ x, y, Image }) {
        this.position = {
            x: x,
            y: y
        }
        this.Image = Image;
        this.width = Image.width;
        this.height = Image.height;
    }

    drawPlatform() {
        ctx.drawImage(this.Image, this.position.x, this.position.y);
        // ctx.fillStyle = "#2C3639";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
// ======================< STATIC PROPS >====================== //
class StaticProp {
    constructor({ x, y, Image }) {
        this.position = {
            x: x,
            y: y
        }
        this.Image = Image;
        this.width = Image.width;
        this.height = Image.height;
    }

    drawProp() {
        ctx.drawImage(this.Image, this.position.x, this.position.y);
        // ctx.fillStyle = "#2C3639";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
// =======================< MOVING CLIFF >====================== //
class DynamicProp {
    constructor({ Image }) {
        this.Image = Image;
    }

    drawProp(x, y) {
        ctx.drawImage(this.Image, x, y);
    }
}
// ===========================| </> |=========================== //

let BgLightImg = await loadImage(BgLight);
let BgObj = new StaticProp({ x: 0, y: 0, Image: BgLightImg });

let CaveImg = await loadImage(StaticCave);
let CaveObj = new StaticProp({ x: 0, y: 0, Image: CaveImg });

let LightsImg = await loadImage(Lights);
let LightObj = new StaticProp({ x: 0, y: 0, Image: LightsImg });

let CliffImg = await loadImage(Cliffs);
let cliffWidth = 0;
let CliffObj1 = new DynamicProp({ Image: CliffImg });
let CliffObj2 = new DynamicProp({ Image: CliffImg });
let CliffObj0 = new DynamicProp({ Image: CliffImg });

let Img0 = await loadImage(LongPlatform);
// let Img0 = new Image(); // NEED TO WAIT FOR IMAGE TO LOAD OR ELSE, WE WILL PASS AN 0X0 OBJECT IN PLATFORM()
// Img0.src = PlatformSrc0;

// ===========================| </> |=========================== //
let player = new Player();
// let player = new Player({ Image: await loadImage(spriteIdle) });

let platforms = [];

let scrollOffset = 0; // For Win 

let lastKey;
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

async function init() {
    BgLightImg = await loadImage(BgLight);
    BgObj = new StaticProp({ x: 0, y: 0, Image: BgLightImg });

    CaveImg = await loadImage(StaticCave);
    CaveObj = new StaticProp({ x: 0, y: 0, Image: CaveImg });

    LightsImg = await loadImage(Lights);
    LightObj = new StaticProp({ x: 0, y: 0, Image: LightsImg });

    CliffImg = await loadImage(Cliffs);
    cliffWidth = 0;
    CliffObj1 = new DynamicProp({ Image: CliffImg });
    CliffObj2 = new DynamicProp({ Image: CliffImg });
    CliffObj0 = new DynamicProp({ Image: CliffImg });

    Img0 = await loadImage(LongPlatform);

    player = new Player({ Image: spriteIdleImg });

    platforms = [new Platform({ x: -10, y: 476, Image: Img0 }), new Platform({ x: 800, y: 476, Image: Img0 })];

    scrollOffset = 0; // For Win 
}

function animate() {
    requestAnimationFrame(animate); // Calls the function passed in over and over
    ctx.clearRect(0, 0, 1024, 576);

    BgObj.drawProp();

    // Implementing Moving Cliffs
    CliffObj0.drawProp(cliffWidth - canvas.width, 0);
    CliffObj1.drawProp(cliffWidth, 0);
    CliffObj2.drawProp(cliffWidth + canvas.width, 0);

    CaveObj.drawProp();

    platforms.forEach((platform) => {
        platform.drawPlatform();
    })

    player.updatePlayer();

    LightObj.drawProp();

    // Beyond 500 stop the player to move right and scroll background
    // Same for left
    if (keys.right.pressed && player.position.x < 500) {
        player.velocity.x = player.speed;
    } else if ((keys.left.pressed && player.position.x > 50)
        || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
        // Scroll platform/background // 
        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach((platform) => {
                platform.position.x -= player.speed;
            })
            // Parallax Cliff Logic
            cliffWidth -= player.speed * 0.6;
            console.log(cliffWidth);
            if (cliffWidth == -1014) {
                cliffWidth = 0;
            }
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach((platform) => {
                platform.position.x += player.speed;
            })

            // Parallax Cliff Logic
            cliffWidth += player.speed * 0.6;
            console.log(cliffWidth);
            if (cliffWidth == +1014) {
                cliffWidth = 0;
            }

        }
    }
    // Landing the player on the platform 
    platforms.forEach(platform => {

        if (player.position.y + player.height - 20 <= platform.position.y
            && player.position.y + player.height + player.velocity.y - 20 >= platform.position.y
            && player.position.x + player.width - 40 >= platform.position.x
            && player.position.x + 40 <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    })

    // Switch between Right and Left Movement
    if (keys.right.pressed &&
        lastKey === "right" && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.currentCropHeight = player.sprites.run.cropHeight;
        player.width = player.sprites.run.width;
        player.height = player.sprites.run.height;
    } else if (keys.left.pressed &&
        lastKey === "left" && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.currentCropHeight = player.sprites.run.cropHeight;
        player.width = player.sprites.run.width;
        player.height = player.sprites.run.height;
    }
    else if (!keys.left.pressed &&
        lastKey === "left" && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.currentCropHeight = player.sprites.stand.cropHeight;
        player.width = player.sprites.stand.width;
        // player.height = player.sprites.stand.height;
    }
    else if (!keys.right.pressed &&
        lastKey === "right" && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.currentCropHeight = player.sprites.stand.cropHeight;
        player.width = player.sprites.stand.width;
        // player.height = player.sprites.stand.height;
    }

    // =========================< WIN >========================= //
    if (scrollOffset > 2000) {
        console.log("YOU WIN!");
    }
    // ========================< LOSE >========================= //
    if (player.position.y > canvas.height) {
        console.log("YOU LOSE!");
        init();
    }
}

init();

animate();

window.addEventListener("keydown", ({ key }) => {
    // console.log(key);
    switch (key) {
        case "w":
            player.velocity.y -= 8;
            break;
        case "a":
            keys.left.pressed = true;
            lastKey = "left";
            break;
        case "d":
            keys.right.pressed = true;
            lastKey = "right";
            break;
    }
})

window.addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            break;
        case "a":
            keys.left.pressed = false;
            break;
        case "d":
            keys.right.pressed = false;
            break;
    }
})
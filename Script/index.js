const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.15;
// =====================< PLAYER CLASS >====================== //
class Player {
    constructor() {
        this.position = {
            x: 80,
            y: 250
        }
        this.width = 30;
        this.height = 30;

        this.velocity = {
            x: 0,
            y: 1
        }
    }

    drawPlayer() {
        ctx.fillStyle = "#EB4747";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    updatePlayer() {
        this.drawPlayer();
        this.position.x = this.position.x + this.velocity.x;
        this.position.y = this.position.y + this.velocity.y;
        if ((this.position.y + this.height) + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}
// =====================< PLATFORM CLASS >===================== //
class Platform {
    constructor({ x, y }) {
        this.position = {
            x: x,
            y: y
        }

        this.width = 200;
        this.height = 20;
    }

    drawPlatform() {
        ctx.fillStyle = "#2C3639";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// ===========================| </> |=========================== //
const player = new Player();
// player.drawPlayer();
// const platform = new Platform();
const platforms = [new Platform({ x: 200, y: 200 }), new Platform({ x: 500, y: 320 })];

let scrollOffset = 0; // For Win 

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate); // Calls the function passed in over and over
    ctx.clearRect(0, 0, 1024, 576);
    player.updatePlayer();

    platforms.forEach((platform) => {
        platform.drawPlatform();
    })

    // Beyond 500 stop the player to move right and scroll background
    // Same for left
    if (keys.right.pressed && player.position.x < 500) {
        player.velocity.x = 2.5;
    } else if (keys.left.pressed && player.position.x > 50) {
        player.velocity.x = -2.5;
    } else {
        player.velocity.x = 0;
        // Scroll platform/background
        if (keys.right.pressed) {
            scrollOffset += 2.5;
            platforms.forEach((platform) => {
                platform.position.x -= 2.5;
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 2.5;
            platforms.forEach((platform) => {
                platform.position.x += 2.5;
            })
        }
    }
    // Landing the player on the platform 
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    })

    if (scrollOffset > 2000) {
        console.log("You Win");
    }
}

animate();

window.addEventListener("keydown", ({ key }) => {
    // console.log(key);
    switch (key) {
        case "w":
            player.velocity.y -= 8;
            break;
        case "a":
            keys.left.pressed = true;
            break;
        case "d":
            keys.right.pressed = true;
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

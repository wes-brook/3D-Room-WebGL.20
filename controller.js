// controller.js
const keysPressed = {};

document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
});

function updateMovement() {
    let isMoving = false;

    if (keysPressed["ArrowLeft"]) {
        cubeRotationY -= 0.1;
        isMoving = true;
    }
    if (keysPressed["ArrowRight"]) {
        cubeRotationY += 0.1;
        isMoving = true;
    }
    if (keysPressed["ArrowUp"]) {
        cubeRotationX -= 0.1;
        isMoving = true;
    }
    if (keysPressed["ArrowDown"]) {
        cubeRotationX += 0.1;
        isMoving = true;
    }
    if (keysPressed["w"]) {
        light.position[1] += 0.1;
    }
    if (keysPressed["s"]) {
        light.position[1] -= 0.1;
    }
    if (keysPressed["a"]) {
        light.position[0] -= 0.1;
    }
    if (keysPressed["d"]) {
        light.position[0] += 0.1;
    }
    if (keysPressed["1"]) {
        usePositionalLight = true;
    }
    if (keysPressed["2"]) {
        usePositionalLight = false;
    }
    if (keysPressed["3"]) {
        useDirectionalLight = true;
    }
    if (keysPressed["4"]) {
        useDirectionalLight = false;
    }

    if (!isMoving) {
        cubeRotationY += 0.006;
        cubeRotationX += 0.006;
    }

    requestAnimationFrame(updateMovement);
}

// Start the movement update loop
updateMovement();

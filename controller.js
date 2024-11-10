/* ===========================================================================================================================
 * File: controller.js
 * Author: Wesly Barayuga
 * Date: 12/9/2024
 * Purpose: Define webpage controller for the webgl viewport
 * 
 * User Notice:
 *  - ///
 * =========================================================================================================================== */

const keysPressed = {};
let pointerLocked = false;

canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
    pointerLocked = document.pointerLockElement === canvas;
    console.log("Pointer locked:", pointerLocked); // Debugging to check pointer lock status

    if (pointerLocked) {
        // Enable mouse movement for camera control only when locked
        document.addEventListener("mousemove", handleMouseMove);
        
        // Add key listeners only when pointer is locked
        document.addEventListener("keydown", (event) => {
            keysPressed[event.key] = true;
        });

        document.addEventListener("keyup", (event) => {
            keysPressed[event.key] = false;
        });
    } else {
        // Disable mouse movement and key listeners when unlocked
        document.removeEventListener("mousemove", handleMouseMove);

        document.removeEventListener("keydown", (event) => {
            keysPressed[event.key] = true;
        });

        document.removeEventListener("keyup", (event) => {
            keysPressed[event.key] = false;
        });
    }
});

function handleMouseMove(event) {
    if (!pointerLocked) return;

    const sensitivity = 0.002; // Adjust sensitivity as needed
    yaw += event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;

    // Clamp the pitch to prevent flipping
    const maxPitch = Math.PI / 2 - 0.1;
    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));

    updateCameraDirection();
}

function updateCameraDirection() {
    cameraDirection[0] = Math.cos(pitch) * Math.cos(yaw);
    cameraDirection[1] = Math.sin(pitch);
    cameraDirection[2] = Math.cos(pitch) * Math.sin(yaw);
}

function updateMovement() {
    // Camera movement with WASD
    if (keysPressed["w"]) {
        cameraPosition[0] += cameraDirection[0] * cameraSpeed;
        cameraPosition[2] += cameraDirection[2] * cameraSpeed;
    }
    if (keysPressed["s"]) {
        cameraPosition[0] -= cameraDirection[0] * cameraSpeed;
        cameraPosition[2] -= cameraDirection[2] * cameraSpeed;
    }
    if (keysPressed["a"]) {
        cameraPosition[0] += cameraDirection[2] * cameraSpeed; // Strafe left
        cameraPosition[2] -= cameraDirection[0] * cameraSpeed;
    }
    if (keysPressed["d"]) {
        cameraPosition[0] -= cameraDirection[2] * cameraSpeed; // Strafe right
        cameraPosition[2] += cameraDirection[0] * cameraSpeed;
    }

    // Light toggles
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

    requestAnimationFrame(updateMovement);
}

function updateCubeRotation() {
    cubeRotationY += 0.0006;
    cubeRotationX += 0.0006;

    // Keep updating cube rotation
    requestAnimationFrame(updateCubeRotation);
}

// Start the update loops
updateMovement();
updateCubeRotation();

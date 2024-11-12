/* ===========================================================================================================================
 * File: main.js
 * Author: Wesly Barayuga
 * Date: 11/9/2024
 * Purpose: Define internal state for WebGL 2.0 to model, render, and control a 3D environment
 * 
 * User Notice:
 *  - ///
 * =========================================================================================================================== */

let cubeRotationX = 0;
let cubeRotationY = 0;
let useDirectionalLight = false;
let usePositionalLight = true;

let cameraPosition = [-9.5, 5, 9.5]; // Setting the camera 10 units from environment center
let cameraDirection = [0.57, -0.1, -0.64]; // Initially looking along the -Z axis
let cameraSpeed = 0.25; // Adjust for faster/slower movement

let pitch = 0; // Up/Down rotation (in radians)
let yaw = -Math.PI / 2; // Left/Right rotation (in radians, starts looking -Z)

// Main shader program initialization
const vsSource = document.getElementById('vshader').textContent.trim();
const fsSource = document.getElementById('fshader').textContent.trim();
const shaderProgram = initShaders();

// Torch shader program initialization
const torchVsSource = document.getElementById('torch-vshader').textContent.trim();
const torchFsSource = document.getElementById('torch-fshader').textContent.trim();
const torchShaderProgram = initShaders(torchVsSource, torchFsSource);


// Create index and vertex buffer for the cube
const { cubeVertexBuffer, cubeIndexBuffer } = createCubeBuffers();

const room = new Room();
const desk = new Desk();
const desk2 = new Desk2();
const monitor1 = new Monitor1();
// Need to add other objects here...



// Define attribute locations
const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
const normalLocation = gl.getAttribLocation(shaderProgram, "aNormal");
const texCoordLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");

// Set up uniforms
const uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
const uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
const uLightDirectionLocation = gl.getUniformLocation(shaderProgram, "uLightDirection");
const uLightPositionLocation = gl.getUniformLocation(shaderProgram, "uLightPosition");
const uLightColorLocation = gl.getUniformLocation(shaderProgram, "uLightColor");
const uAmbientColorLocation = gl.getUniformLocation(shaderProgram, "uAmbientColor");
const uUseDirectionalLightLocation = gl.getUniformLocation(shaderProgram, "uUseDirectionalLight");
const uUsePositionalLightLocation = gl.getUniformLocation(shaderProgram, "uUsePositionalLight");


// Light and material properties
const light = {
    direction: [1.0, -1.0, -1.0],
    position: [2.0, 2.0, 2.0],
    color: [1.0, 1.0, 1.0],
    ambientColor: [0.1, 0.1, 0.1]
};


// Function to update the camera direction based on pitch and yaw
function updateCameraDirection() {
    cameraDirection[0] = Math.cos(pitch) * Math.cos(yaw);
    cameraDirection[1] = Math.sin(pitch);
    cameraDirection[2] = Math.cos(pitch) * Math.sin(yaw);
}

// Initialize shaders and program
function initShaders() {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
}

function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(shaderProgram);

    // Set up the model view matrix for the camera
    const modelViewMatrix = mat4.create();
    const lookAtPosition = [
        cameraPosition[0] + cameraDirection[0],
        cameraPosition[1] + cameraDirection[1],
        cameraPosition[2] + cameraDirection[2],
    ];
    mat4.lookAt(modelViewMatrix, cameraPosition, lookAtPosition, [0, 1, 0]);

    // Set up the projection matrix
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);

    // Send matrices and light data to shaders
    gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
    gl.uniform3fv(uLightDirectionLocation, light.direction);
    gl.uniform3fv(uLightPositionLocation, light.position);
    gl.uniform3fv(uLightColorLocation, light.color);
    gl.uniform3fv(uAmbientColorLocation, light.ambientColor);
    gl.uniform1i(uUseDirectionalLightLocation, useDirectionalLight);
    gl.uniform1i(uUsePositionalLightLocation, usePositionalLight);

    // DRAW THE ROOM
    room.drawFloor();
    room.drawWalls();

    // DRAW MY DESK
    desk.drawDesk(modelViewMatrix);
    desk2.drawDesk(modelViewMatrix);

    // DRAW MY MONITORS
    //monitor1.drawMonitor(modelViewMatrix);

    // Rotate the cube and set the model view matrix for it
    const cubeModelViewMatrix = mat4.clone(modelViewMatrix);
    mat4.scale(cubeModelViewMatrix, cubeModelViewMatrix, [0.5, 0.5, 0.5]);
    mat4.rotate(cubeModelViewMatrix, cubeModelViewMatrix, cubeRotationX, [1, 0, 0]);
    mat4.rotate(cubeModelViewMatrix, cubeModelViewMatrix, cubeRotationY, [0, 1, 0]);

    // Send the cube's model view matrix to the shaders
    gl.uniformMatrix4fv(uModelViewMatrixLocation, false, cubeModelViewMatrix);

    // DRAW THE CUBE
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(normalLocation);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    //drawTorch(modelViewMatrix, projectionMatrix);
}

function render() {
    // Draw the scene
    drawScene();
    // Request to render the next frame
    requestAnimationFrame(render);
}

// Start rendering
render();

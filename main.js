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

let cameraPosition = [-9.425, 5, -10.759]; // Setting the camera 10 units from environment center
let cameraDirection = [0.761, -0.0719, 0.645]; // Initially looking along the -Z axis
let cameraSpeed = 0.25; // Adjust for faster/slower movement

let pitch = 0; // Up/Down rotation (in radians)
let yaw = Math.PI / 4; // Left/Right rotation (in radians, starts looking -Z)

// Main shader program initialization
const vsSource = document.getElementById('vshader').textContent.trim();
const fsSource = document.getElementById('fshader').textContent.trim();
const shaderProgram = initShaders(vsSource, fsSource);

//
// Initialize shaders for the transparent cube
const vsSourceTransparent = document.getElementById('vshader_transparent').textContent.trim();
const fsSourceTransparent = document.getElementById('fshader_transparent').textContent.trim();
const transparentShaderProgram = initShaders(vsSourceTransparent, fsSourceTransparent);

// Define attribute locations for the transparent shader
const positionLocationTransparent = gl.getAttribLocation(transparentShaderProgram, "aPosition");
const normalLocationTransparent = gl.getAttribLocation(transparentShaderProgram, "aNormal");

// Set up uniforms for the transparent shader
const uModelViewMatrixLocationTransparent = gl.getUniformLocation(transparentShaderProgram, "uModelViewMatrix");
const uProjectionMatrixLocationTransparent = gl.getUniformLocation(transparentShaderProgram, "uProjectionMatrix");
const uLightDirectionLocationTransparent = gl.getUniformLocation(transparentShaderProgram, "uLightDirection");
const uLightColorLocationTransparent = gl.getUniformLocation(transparentShaderProgram, "uLightColor");
const uAmbientColorLocationTransparent = gl.getUniformLocation(transparentShaderProgram, "uAmbientColor");

// Get the resolution of the canvas
const resolution = [canvas.width, canvas.height];

// Get the location of the resolution uniform
const uTransparentResolutionLocation = gl.getUniformLocation(transparentShaderProgram, "uResolution");

//

// Create index and vertex buffer for the cube
const { cubeVertexBuffer, cubeIndexBuffer } = createCubeBuffers();

const room = new Room();
const desk = new Desk();
const desk2 = new Desk2();
const monitor1 = new Monitor();
const monitor2 = new Monitor();
const monitor3 = new Monitor();



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
function initShaders(vsSource, fsSource) {
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

    

    // Use the transparent shader program for the cube
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(transparentShaderProgram);

    // Send matrices and light data to the transparent shaders
    gl.uniformMatrix4fv(uModelViewMatrixLocationTransparent, false, modelViewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrixLocationTransparent, false, projectionMatrix);
    gl.uniform3fv(uLightDirectionLocationTransparent, light.direction);
    gl.uniform3fv(uLightColorLocationTransparent, light.color);
    gl.uniform3fv(uAmbientColorLocationTransparent, light.ambientColor);

    // Rotate the cube and set the model view matrix for it
    const cubeModelViewMatrix = mat4.clone(modelViewMatrix);
    mat4.scale(cubeModelViewMatrix, cubeModelViewMatrix, [0.5, 0.5, 0.5]);
    mat4.rotate(cubeModelViewMatrix, cubeModelViewMatrix, cubeRotationX, [1, 0, 0]);
    mat4.rotate(cubeModelViewMatrix, cubeModelViewMatrix, cubeRotationY, [0, 1, 0]);

    // Send the cube's model view matrix to the transparent shaders
    gl.uniformMatrix4fv(uModelViewMatrixLocationTransparent, false, cubeModelViewMatrix);

    // DRAW THE CUBE with the transparent shader
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(positionLocationTransparent, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.vertexAttribPointer(normalLocationTransparent, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(positionLocationTransparent);
    gl.enableVertexAttribArray(normalLocationTransparent);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    gl.disable(gl.BLEND);
    gl.useProgram(shaderProgram);
    
    // DRAW MY MONITORS
    monitor1.drawMonitor(modelViewMatrix, [0, 5.5, -10], Math.PI / -4, "screen2");
    monitor2.drawMonitor(modelViewMatrix, [2.25, 5.5, -8.75], 0.0, "screen3");
    monitor3.drawMonitor(modelViewMatrix, [-2.5, 5.5, -9], Math.PI / 2 + Math.PI, "screen1");
}

function render() {
    // Draw the scene
    drawScene();
    // Request to render the next frame
    requestAnimationFrame(render);
}

// Start rendering
render();

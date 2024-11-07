/* ===========================================================================================================================
 * File: main.js
 * Author: Wesly Barayuga
 * Date: 10/30/2024
 * Purpose: Define internal state for WebGL 2.0 to model, render, and control a 3D Cube with PHONG lighting 
 * 
 * User Notice:
 *  - Includes a Cube composed of 12 triangles
 *  - Includes a posisional light
 *  - Includes a directional light
 *  - This was fun to make :)
 * =========================================================================================================================== */

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

// main.js
let cameraPosition = [0, 0, 5];
let cameraDirection = [0, 0, -1]; // Initially looking along the -Z axis
let cameraSpeed = 0.1; // Adjust for faster/slower movement

let pitch = 0; // Up/Down rotation (in radians)
let yaw = -Math.PI / 2; // Left/Right rotation (in radians, starts looking -Z)

// Vertex shader program
const vsSource = document.getElementById('vshader').textContent.trim();
// Fragment shader program
const fsSource = document.getElementById('fshader').textContent.trim();

// Define the cube vertices, normals, and indices
const vertices = new Float32Array([
    // Front face
    -1, -1,  1,   0,  0,  1,
     1, -1,  1,   0,  0,  1,
     1,  1,  1,   0,  0,  1,
    -1,  1,  1,   0,  0,  1,
    // Back face
    -1, -1, -1,   0,  0, -1,
    -1,  1, -1,   0,  0, -1,
     1,  1, -1,   0,  0, -1,
     1, -1, -1,   0,  0, -1,
    // Left face
    -1, -1, -1,  -1,  0,  0,
    -1, -1,  1,  -1,  0,  0,
    -1,  1,  1,  -1,  0,  0,
    -1,  1, -1,  -1,  0,  0,
    // Right face
     1, -1, -1,   1,  0,  0,
     1,  1, -1,   1,  0,  0,
     1,  1,  1,   1,  0,  0,
     1, -1,  1,   1,  0,  0,
    // Top face
    -1,  1, -1,   0,  1,  0,
     1,  1, -1,   0,  1,  0,
     1,  1,  1,   0,  1,  0,
    -1,  1,  1,   0,  1,  0,
    // Bottom face
    -1, -1, -1,   0, -1,  0,
    -1, -1,  1,   0, -1,  0,
     1, -1,  1,   0, -1,  0,
     1, -1, -1,   0, -1,  0,
]);

const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
]);

// Floor vertices and indices
const floorVertices = new Float32Array([
    -5, -1, 5, 0, 1, 0,  // bottom-left
    5, -1, 5, 0, 1, 0,   // bottom-right
    5, -1, -5, 0, 1, 0,  // top-right
    -5, -1, -5, 0, 1, 0  // top-left
]);
const floorIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

// Pyramid vertices and indices
const pyramidVertices = new Float32Array([
    // Base
    -1, -1, -1, 0, -1, 0,   // bottom-left
     1, -1, -1, 0, -1, 0,   // bottom-right
     1, -1,  1, 0, -1, 0,   // top-right
    -1, -1,  1, 0, -1, 0,   // top-left
    // Peak
     0,  1,  0, 0, 1, 0,    // top point
]);
const pyramidIndices = new Uint16Array([
    0, 1, 4,   1, 2, 4,   2, 3, 4,   3, 0, 4,   // Sides
    0, 1, 2,   0, 2, 3    // Base
]);


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

const shaderProgram = initShaders();

// Create buffer for vertices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);



// Create buffer for indices
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);



// Define attribute locations
const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
const normalLocation = gl.getAttribLocation(shaderProgram, "aNormal");

// Enable vertex attributes
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
gl.enableVertexAttribArray(positionLocation);
gl.enableVertexAttribArray(normalLocation);

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

let cubeRotationX = 0;
let cubeRotationY = 0;
let useDirectionalLight = true;
let usePositionalLight = true;

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

    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotationX, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotationY, [0, 1, 0]);

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}



function render() {
    drawScene();
    requestAnimationFrame(render);
}

// Start rendering
render();

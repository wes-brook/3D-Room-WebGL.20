// Torch mesh setup (simplified, for a basic cylinder-like object)
const torchVertices = new Float32Array([
    // Positions        // Normals
    0.2,  0.0, 0.0,     0.0, -1.0, 0.0,  // Bottom-center
    0.2,  2.0, 0.0,     0.0, -1.0, 0.0,  // Top-center
    -0.2, 2.0, 0.5,     0.0, -1.0, 0.0,  // Top-edge
    0.2,  2.0, 0.5,     0.0, -1.0, 0.0   // Top-edge
]);

const torchIndices = new Uint16Array([
    0, 1, 2,  1, 2, 3   // Simple face
]);

const torchVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, torchVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, torchVertices, gl.STATIC_DRAW);

const torchIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torchIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, torchIndices, gl.STATIC_DRAW);


const torchPosition = [4.5, -1.0, -4.0]; // Position the torch at the corner

const torchLight = {
    direction: [1.0, -1.0, -1.0],
    position: [14.0, -1.0, -4.0],
    color: [1.0, 1.0, 1.0],
    ambientColor: [1.1, 1.1, 0.1]
};

function drawTorch(modelViewMatrix, projectionMatrix) {
    // Ensure that we are using the torch shader program
    gl.useProgram(torchShaderProgram);  // Use the torch shader program
    
    // Set up the model view matrix for the torch
    const torchModelViewMatrix = mat4.create();
    mat4.translate(torchModelViewMatrix, modelViewMatrix, torchPosition);


    // Send matrices and light data to shaders
    gl.uniformMatrix4fv(gl.getUniformLocation(torchShaderProgram, "uModelViewMatrix"), false, torchModelViewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(torchShaderProgram, "uProjectionMatrix"), false, projectionMatrix);

    // Set the light and other uniforms for the torch shader
    gl.uniform3fv(gl.getUniformLocation(torchShaderProgram, "uLightPosition"), torchLight.position);
    gl.uniform3fv(gl.getUniformLocation(torchShaderProgram, "uLightColor"), torchLight.color);
    gl.uniform3fv(gl.getUniformLocation(torchShaderProgram, "uAmbientColor"), torchLight.ambientColor);
    gl.uniform1i(gl.getUniformLocation(torchShaderProgram, "uUsePositionalLight"), true);

    // Bind buffers and draw the torch
    gl.bindBuffer(gl.ARRAY_BUFFER, torchVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(normalLocation);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torchIndexBuffer);
    gl.drawElements(gl.TRIANGLES, torchIndices.length, gl.UNSIGNED_SHORT, 0);
}


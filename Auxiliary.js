/* ===========================================================================================================================
 * File: Auxiliary.js
 * Author: Wesly Barayuga
 * Date: 12/9/2024
 * Purpose: Helper functions for buffer creation, cube setup, and texture loading in WebGL
 * =========================================================================================================================== */

function initVertexBuffer(vertices) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    return vertexBuffer;
}

function initIndexBuffer(indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indexBuffer;
}

 function createCubeBuffers() {
     const { vertices, indices } = createCube(); // Import cube vertices and indices
     const cubeVertexBuffer = initVertexBuffer(vertices);
     const cubeIndexBuffer = initIndexBuffer(indices);
 
     return { cubeVertexBuffer, cubeIndexBuffer };
}

// Load texture function
function loadTexture(id) {
    var Image = document.getElementById(id);

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, Image);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    return texture;
}
// Auxiliary.js
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

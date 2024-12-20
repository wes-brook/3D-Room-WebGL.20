/* ===========================================================================================================================
 * File: cube.js
 * Author: Wesly Barayuga
 * Date: 11/12/2024
 * Purpose: Generate a 3D cube geometry for WebGL rendering
 * 
 * User Notice:
 *  - Creates vertices and indices for a cube with six faces and normal vectors
 *  - Cube is represented in normalized space with side length 2
 *  - Returns arrays for vertices and indices to create vertex buffers
 * =========================================================================================================================== */

function createCube() {
    vertices = new Float32Array([
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

    indices = new Uint16Array([
        0,  1,  2,  0,  2,  3,
        4,  5,  6,  4,  6,  7,
        8,  9, 10,  8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    return { vertices, indices }
}

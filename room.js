/* ===========================================================================================================================
 * File: room.js
 * Author: Wesly Barayuga
 * Date: 11/12/2024
 * Purpose: Define a 3D room with floor and wall geometry in WebGL
 * 
 * User Notice:
 *  - This class handles the creation and rendering of a room with textured floor and walls
 *  - Includes methods to initialize geometry, buffers, and textures for the floor and walls
 *  - Uses WebGL to draw the floor and walls with appropriate textures
 * =========================================================================================================================== */

class Room {
    constructor() {
        // Initialize floor buffers
        const { floorVertices, floorIndices } = this.createFloor();
        this.floorVertexBuffer = initVertexBuffer(floorVertices);
        this.floorIndexBuffer = initIndexBuffer(floorIndices);
        // Load floor texture
        this.floorTexture = loadTexture('floor');

        // Initialize wall buffers
        const { wallVertices, wallIndices } = this.createWalls();
        this.wallVertexBuffer = initVertexBuffer(wallVertices);
        this.wallIndexBuffer = initIndexBuffer(wallIndices);
        // Load the wall texture
        this.wallTexture = loadTexture('wall');

        this.createFloorBuffers();
    }

    drawFloor() {
        // Bind texture coordinates buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.floorVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);

        // Bind the floor texture before drawing
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.floorTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.floorIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    drawWalls() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.wallVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation); 

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.wallTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 1); 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.wallIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
    }

    createFloor() {
        const floorVertices = new Float32Array([
            -10, -2,  10, 0, 1, 0, 0, 0,   // bottom-left, texture (0, 0)
             10, -2,  10, 0, 1, 0, 1, 0,   // bottom-right, texture (1, 0)
             10, -2, -10, 0, 1, 0, 1, 1,   // top-right, texture (1, 1)
            -10, -2, -10, 0, 1, 0, 0, 1    // top-left, texture (0, 1)
        ]);
        const floorIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        return { floorVertices, floorIndices };
    }

    createWalls() {
        const wallHeight = 10;
        const wallVertices = new Float32Array([
            // Front wall (unchanged)
            -10, -2,  10, 0, 0, -1, 0, 0,          // bottom-left, texture (0, 0)
             10, -2,  10, 0, 0, -1, 1, 0,          // bottom-right, texture (1, 0)
             10, wallHeight, 10, 0, 0, -1, 1, 1,   // top-right, texture (1, 1)
            -10, wallHeight, 10, 0, 0, -1, 0, 1,   // top-left, texture (0, 1)
        
            // Right wall (unchanged)
             10, -2,  10, -1, 0, 0, 0, 0,          // bottom-left, texture (0, 0)
             10, -2, -10, -1, 0, 0, 1, 0,          // bottom-right, texture (1, 0)
             10, wallHeight, -10, -1, 0, 0, 1, 1,  // top-right, texture (1, 1)
             10, wallHeight, 10, -1, 0, 0, 0, 1,   // top-left, texture (0, 1)

            // Back wall (right segment)
            -3, -2, -10, 0, 0, 1, 0, 0,         // bottom-left of right segment, texture (0.8, 0)
            10, -2, -10, 0, 0, 1, 1, 0,           // bottom-right, texture (1, 0)
            10, wallHeight, -10, 0, 0, 1, 1, 1,   // top-right, texture (1, 1)
            -3, wallHeight, -10, 0, 0, 1, 0, 1, // top-left of right segment, texture (0.8, 1)
        
            // Left wall (unchanged)
            -10, -2,  10, 1, 0, 0, 0, 0,          // bottom-left, texture (0, 0)
            -10, -2, -10, 1, 0, 0, 1, 0,          // bottom-right, texture (1, 0)
            -10, wallHeight, -10, 1, 0, 0, 1, 1,  // top-right, texture (1, 1)
            -10, wallHeight, 10, 1, 0, 0, 0, 1    // top-left, texture (0, 1)
        ]);
        
        const wallIndices = new Uint16Array([
            // Front wall - left segment
            0, 1, 2, 0, 2, 3,
            // Front wall - right segment
            4, 5, 6, 4, 6, 7,
            // Right wall
            8, 9, 10, 8, 10, 11,
            // Back wall
            12, 13, 14, 12, 14, 15,
            // Left wall
            16, 17, 18, 16, 18, 19
        ]);

        return { wallVertices, wallIndices };
    }

    createFloorBuffers() {
        return {
            floorVertexBuffer: this.floorVertexBuffer,
            floorIndexBuffer: this.floorIndexBuffer,
            wallVertexBuffer: this.wallVertexBuffer,
            wallIndexBuffer: this.wallIndexBuffer
        };
    }
}

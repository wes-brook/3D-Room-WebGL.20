
class Room {
    constructor() {
        // Initialize floor buffers
        const { floorVertices, floorIndices } = this.createFloor();
        this.floorVertexBuffer = initVertexBuffer(floorVertices);
        this.floorIndexBuffer = initIndexBuffer(floorIndices);

        // Initialize wall buffers
        const { wallVertices, wallIndices } = this.createWalls();
        this.wallVertexBuffer = initVertexBuffer(wallVertices);
        this.wallIndexBuffer = initIndexBuffer(wallIndices);
        this.createFloorBuffers();
    }

    drawFloor() {
        gl.bindBuffer(gl.ARRAY_BUFFER, room.floorVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, room.floorIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    drawWalls() {
        gl.bindBuffer(gl.ARRAY_BUFFER, room.wallVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, room.wallIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
    }

    createFloor() {
        const floorVertices = new Float32Array([
            -25, -2,  25, 0, 1, 0, // bottom-left
             50, -2,  25, 0, 1, 0, // bottom-right
             50, -2, -25, 0, 1, 0, // top-right
            -25, -2, -25, 0, 1, 0  // top-left
        ]);
        const floorIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        return { floorVertices, floorIndices };
    }

    createWalls() {
        const wallHeight = 10;
        const wallVertices = new Float32Array([
            // Front wall
            -25, -2,  25, 0, 0, -1, // bottom-left
             50, -2,  25, 0, 0, -1, // bottom-right
             50, wallHeight, 25, 0, 0, -1, // top-right
            -25, wallHeight, 25, 0, 0, -1, // top-left

            // Right wall
             50, -2,  25, -1, 0, 0, // bottom-left
             50, -2, -25, -1, 0, 0, // bottom-right
             50, wallHeight, -25, -1, 0, 0, // top-right
             50, wallHeight, 25, -1, 0, 0, // top-left

            // Back wall
            -25, -2, -25, 0, 0, 1, // bottom-left
             50, -2, -25, 0, 0, 1, // bottom-right
             50, wallHeight, -25, 0, 0, 1, // top-right
            -25, wallHeight, -25, 0, 0, 1, // top-left

            // Left wall
            -25, -2,  25, 1, 0, 0, // bottom-left
            -25, -2, -25, 1, 0, 0, // bottom-right
            -25, wallHeight, -25, 1, 0, 0, // top-right
            -25, wallHeight, 25, 1, 0, 0  // top-left
        ]);

        const wallIndices = new Uint16Array([
            // Front wall
            0, 1, 2, 0, 2, 3,
            // Right wall
            4, 5, 6, 4, 6, 7,
            // Back wall
            8, 9, 10, 8, 10, 11,
            // Left wall
            12, 13, 14, 12, 14, 15
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

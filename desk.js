// desk.js
class Desk {
    constructor() {
        // Initialize desk buffers
        const { deskVertices, deskIndices } = this.createDesk();
        this.deskVertexBuffer = initVertexBuffer(deskVertices);
        this.deskIndexBuffer = initIndexBuffer(deskIndices);
        // Load desk texture
        this.deskTexture = loadTexture('desk');

        this.createDeskBuffers();
    }

    drawDesk(modelViewMatrix) {
        const translationMatrix =  mat4.clone(modelViewMatrix);
        mat4.translate(translationMatrix, translationMatrix, [3.5, -2, -7.5]);

        // Bind texture coordinates buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.deskVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);

        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);

        // Bind the desk texture before drawing
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.deskTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0); // Set texture unit 0

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.deskIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);
    }

    createDesk() {
        const deskHeight = 5;
        const deskDepth = 5;
        const deskWidth = 13;
        const legHeight = 6;
        const legWidth = 0.3;
    
        const deskVertices = new Float32Array([
            // Main surface (top)
            -deskWidth / 2, deskHeight, deskDepth / 2, 0, 1, 0, 0, 0,    // top-left
             deskWidth / 2, deskHeight, deskDepth / 2, 0, 1, 0, 1, 0,    // top-right
             deskWidth / 2, deskHeight, -deskDepth / 2, 0, 1, 0, 1, 1,   // bottom-right
            -deskWidth / 2, deskHeight, -deskDepth / 2, 0, 1, 0, 0, 1,   // bottom-left
    
            // Bottom surface
            -deskWidth / 2, deskHeight - 0.1, deskDepth / 2, 0, -1, 0, 0, 0,    // bottom top-left
             deskWidth / 2, deskHeight - 0.1, deskDepth / 2, 0, -1, 0, 1, 0,    // bottom top-right
             deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, 0, -1, 0, 1, 1,   // bottom bottom-right
            -deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, 0, -1, 0, 0, 1,   // bottom bottom-left
    
            // Left side
            -deskWidth / 2, deskHeight, deskDepth / 2, -1, 0, 0, 0, 0,   // top-left
            -deskWidth / 2, deskHeight, -deskDepth / 2, -1, 0, 0, 1, 0,  // bottom-right
            -deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, -1, 0, 0, 1, 1,   // bottom-right
            -deskWidth / 2, deskHeight - 0.1, deskDepth / 2, -1, 0, 0, 0, 1,    // bottom-left
    
            // Right side
             deskWidth / 2, deskHeight, deskDepth / 2, 1, 0, 0, 0, 0,    // top-left
             deskWidth / 2, deskHeight, -deskDepth / 2, 1, 0, 0, 1, 0,   // bottom-right
             deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, 1, 0, 0, 1, 1,    // bottom-right
             deskWidth / 2, deskHeight - 0.1, deskDepth / 2, 1, 0, 0, 0, 1,     // bottom-left
    
            // Front side
            -deskWidth / 2, deskHeight, -deskDepth / 2, 0, 0, -1, 0, 0,   // top-left
             deskWidth / 2, deskHeight, -deskDepth / 2, 0, 0, -1, 1, 0,   // top-right
             deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, 0, 0, -1, 1, 1,  // bottom-right
            -deskWidth / 2, deskHeight - 0.1, -deskDepth / 2, 0, 0, -1, 0, 1,   // bottom-left
    
            // Back side
            -deskWidth / 2, deskHeight, deskDepth / 2, 0, 0, 1, 0, 0,   // top-left
             deskWidth / 2, deskHeight, deskDepth / 2, 0, 0, 1, 1, 0,   // top-right
             deskWidth / 2, deskHeight - 0.1, deskDepth / 2, 0, 0, 1, 1, 1,  // bottom-right
            -deskWidth / 2, deskHeight - 0.1, deskDepth / 2, 0, 0, 1, 0, 1,   // bottom-left
    
            // Leg 3 (back left)
            -deskWidth / 2 + legWidth / 2, deskHeight - 0.1, -deskDepth / 2 + legWidth / 2, 0, -1, 0, 0, 0,  // top-left
            -deskWidth / 2 + legWidth / 2, 0, -deskDepth / 2 + legWidth / 2, 0, -1, 0, 0, 1,   // bottom-left
            -deskWidth / 2 + legWidth / 2, 0, -deskDepth / 2 + legWidth / 2 + legWidth, 0, -1, 0, 1, 1,  // bottom-right
            -deskWidth / 2 + legWidth / 2, deskHeight - 0.1, -deskDepth / 2 + legWidth / 2 + legWidth, 0, -1, 0, 1, 0,  // top-right
    
            // Leg 4 (back right)
             deskWidth / 2 - legWidth / 2, deskHeight - 0.1, -deskDepth / 2 + legWidth / 2, 0, -1, 0, 0, 0,  // top-left
             deskWidth / 2 - legWidth / 2, 0, -deskDepth / 2 + legWidth / 2, 0, -1, 0, 0, 1,   // bottom-left
             deskWidth / 2 - legWidth / 2, 0, -deskDepth / 2 + legWidth / 2 + legWidth, 0, -1, 0, 1, 1,  // bottom-right
             deskWidth / 2 - legWidth / 2, deskHeight - 0.1, -deskDepth / 2 + legWidth / 2 + legWidth, 0, -1, 0, 1, 0   // top-right
        ]);
    
        const deskIndices = new Uint16Array([
            // Top surface
            0, 1, 2, 0, 2, 3,
    
            // Bottom surface
            4, 5, 6, 4, 6, 7,
    
            // Left side
            8, 9, 10, 8, 10, 11,
    
            // Right side
            12, 13, 14, 12, 14, 15,
    
            // Front side
            16, 17, 18, 16, 18, 19,
    
            // Back side
            20, 21, 22, 20, 22, 23,
    
            // Leg 1
            24, 25, 26, 24, 26, 27,
    
            // Leg 2
            28, 29, 30, 28, 30, 31,
    
            // Leg 3
            32, 33, 34, 32, 34, 35,
    
            // Leg 4
            36, 37, 38, 36, 38, 39
        ]);
    
        return { deskVertices, deskIndices };
    }
    
    
    

    createDeskBuffers() {
        return {
            deskVertexBuffer: this.deskVertexBuffer,
            deskIndexBuffer: this.deskIndexBuffer
        };
    }
}

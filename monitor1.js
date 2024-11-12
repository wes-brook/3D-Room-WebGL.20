// monitor1.js
class Monitor1 {
    constructor() {
        // Initialize monitor buffers
        const { monitorVertices, monitorIndices } = this.createMonitor();
        this.monitorVertexBuffer = initVertexBuffer(monitorVertices);
        this.monitorIndexBuffer = initIndexBuffer(monitorIndices);
        // Load monitor texture (if applicable)
        this.monitorTexture = loadTexture('monitor');  // Replace 'monitor' with the actual texture name

        this.createMonitorBuffers();
    }

    drawMonitor(modelViewMatrix) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.translate(translationMatrix, translationMatrix, [3.5, -1.5, -7]); // Position the monitor on top of the desk

        // Bind vertex buffers for position, normal, and texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.monitorVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);

        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);

        // Bind the monitor texture before drawing
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.monitorTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0); // Set texture unit 0

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.monitorIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);  // Draw the monitor
    }

    createMonitor() {
        const monitorWidth = 8;
        const monitorHeight = 5;
        const monitorDepth = 0.3;
    
        const monitorVertices = new Float32Array([
            // Front surface (screen)
            -monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 0, 0,    // top-left
             monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 1, 0,    // top-right
             monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 1, 1,   // bottom-right
            -monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 0, 1,   // bottom-left
    
            // Back surface (stand side)
            -monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, 0, 0, -1, 0, 0,    // top-left
             monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, 0, 0, -1, 1, 0,    // top-right
             monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, 0, 0, -1, 1, 1,   // bottom-right
            -monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, 0, 0, -1, 0, 1,   // bottom-left
    
            // Left side
            -monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, -1, 0, 0, 0, 0,   // top-left
            -monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, -1, 0, 0, 1, 0,  // top-right
            -monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, -1, 0, 0, 1, 1,   // bottom-right
            -monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, -1, 0, 0, 0, 1,    // bottom-left
    
            // Right side
             monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 1, 0, 0, 0, 0,    // top-left
             monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, 1, 0, 0, 1, 0,   // top-right
             monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, 1, 0, 0, 1, 1,    // bottom-right
             monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 1, 0, 0, 0, 1,     // bottom-left
    
            // Top side
            -monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, 0, 1, 0, 0, 0,   // top-left
             monitorWidth / 2, monitorHeight / 2, -monitorDepth / 2, 0, 1, 0, 1, 0,   // top-right
             monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 1, 0, 1, 1,  // bottom-right
            -monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 1, 0, 0, 1,   // bottom-left
    
            // Bottom side
            -monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, 0, -1, 0, 0, 0,   // top-left
             monitorWidth / 2, -monitorHeight / 2, -monitorDepth / 2, 0, -1, 0, 1, 0,   // top-right
             monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, -1, 0, 1, 1,  // bottom-right
            -monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, -1, 0, 0, 1    // bottom-left
        ]);
    
        const monitorIndices = new Uint16Array([
            // Front surface
            0, 1, 2, 0, 2, 3,
    
            // Back surface
            4, 5, 6, 4, 6, 7,
    
            // Left side
            8, 9, 10, 8, 10, 11,
    
            // Right side
            12, 13, 14, 12, 14, 15,
    
            // Top side
            16, 17, 18, 16, 18, 19,
    
            // Bottom side
            20, 21, 22, 20, 22, 23
        ]);
    
        return { monitorVertices, monitorIndices };
    }

    createMonitorBuffers() {
        return {
            monitorVertexBuffer: this.monitorVertexBuffer,
            monitorIndexBuffer: this.monitorIndexBuffer
        };
    }
}

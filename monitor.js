class Monitor {
    constructor() {
        // Initialize monitor buffers
        const { monitorVertices, monitorIndices } = this.createMonitor();
        this.monitorVertexBuffer = initVertexBuffer(monitorVertices);
        this.monitorIndexBuffer = initIndexBuffer(monitorIndices);
        
        // Load monitor textures (one for the outer monitor and one for the screen)
        this.monitorTexture = loadTexture('monitor'); // Main texture for the monitor frame
        this.screenTexture = loadTexture('screen'); // Texture for the monitor screen

        this.createMonitorBuffers();
    }

    drawMonitor(modelViewMatrix, translation, rotation) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.rotateY(translationMatrix, translationMatrix, rotation);
        mat4.translate(translationMatrix, translationMatrix, translation); // Position the monitor on top of the desk

        // Bind vertex buffers for position, normal, and texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.monitorVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);

        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);

        // Bind the monitor frame texture before drawing the outer frame
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.monitorTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0); // Set texture unit 0

        // Draw the outer monitor frame
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.monitorIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);  // Draw the monitor frame

        // Now bind the screen texture for the front face of the monitor
        this.drawScreen(translationMatrix);
    }

    drawScreen(modelViewMatrix) {
        // Apply translation and rotation for the screen
        gl.bindBuffer(gl.ARRAY_BUFFER, this.monitorVertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);

        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);

        // Bind the screen texture for the front surface
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0); // Set texture unit 0

        // Draw the front (screen) surface of the monitor
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.monitorIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); // Only the front face
    }

    createMonitor() {
        const monitorWidth = 5;
        const monitorHeight = 3;
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
            // Front surface (screen)
            0, 1, 2, 0, 2, 3,  // These 6 indices represent the front screen

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

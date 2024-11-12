class Monitor {
    constructor() {
        // Initialize monitor buffers
        const { monitorVertices, monitorIndices, screenVertices, screenIndices, standVertices, standIndices, baseVertices, baseIndices } = this.createMonitor();
        this.monitorVertexBuffer = initVertexBuffer(monitorVertices);
        this.monitorIndexBuffer = initIndexBuffer(monitorIndices);
        this.screenVertexBuffer = initVertexBuffer(screenVertices);
        this.screenIndexBuffer = initIndexBuffer(screenIndices);
        this.standVertexBuffer = initVertexBuffer(standVertices);
        this.standIndexBuffer = initIndexBuffer(standIndices);
        this.baseVertexBuffer = initVertexBuffer(baseVertices);
        this.baseIndexBuffer = initIndexBuffer(baseIndices);

        // Load textures (monitor frame, screen, stand, and base)
        this.monitorTexture = loadTexture('monitor'); // Main texture for the monitor frame
        this.screenTexture = loadTexture('screen'); // Texture for the monitor screen
        this.screenTexture2 = loadTexture('screen2'); // Texture for the monitor screen
        this.screenTexture3 = loadTexture('screen3'); // Texture for the monitor screen
        this.standTexture = loadTexture('monitor'); // Texture for the stand
        this.baseTexture = loadTexture('monitor'); // Texture for the base

        this.createMonitorBuffers();
    }

    drawMonitor(modelViewMatrix, translation, rotation, screenType) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.rotateY(translationMatrix, translationMatrix, rotation);
        mat4.translate(translationMatrix, translationMatrix, translation); // Position the monitor on top of the desk

        // Draw the outer monitor frame
        this.bindBufferAndAttributes(this.monitorVertexBuffer);
        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);
        this.bindTextureAndDraw(this.monitorTexture, this.monitorIndexBuffer, 30);

        // Draw the screen
        this.drawScreen(modelViewMatrix, translation, rotation, screenType);

        // Draw the stand
        this.drawStand(modelViewMatrix, translation, rotation);

        // Draw the base
        this.drawBase(modelViewMatrix, translation, rotation);
    }

    drawScreen(modelViewMatrix, translation, rotation, screenType) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.rotateY(translationMatrix, translationMatrix, rotation);
        // Adjust the translation to push the base back by 0.5 units in the Z direction
        let adjustedTranslation = vec3.clone(translation);
        adjustedTranslation[2] -= 0.075; // Push back by 0.5 units
        mat4.translate(translationMatrix, translationMatrix, adjustedTranslation);

        const screenScaleFactor = 0.925; // Adjust to control the screen's size
        mat4.scale(translationMatrix, translationMatrix, [screenScaleFactor, screenScaleFactor, screenScaleFactor]);

        // Draw the front (screen) surface of the monitor
        this.bindBufferAndAttributes(this.screenVertexBuffer);
        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);
        let tex;
        if (screenType === "screen1") {
            tex = this.screenTexture;
        }
        if (screenType === "screen2") {
            tex = this.screenTexture2;
        }
        if (screenType === "screen3") {
            tex = this.screenTexture3;
        }
        this.bindTextureAndDraw(tex, this.screenIndexBuffer, 6); // Only the front face
    }

    drawStand(modelViewMatrix, translation, rotation) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.rotateY(translationMatrix, translationMatrix, rotation);
        // Adjust the translation to push the base back by 0.5 units in the Z direction
        let adjustedTranslation = vec3.clone(translation);
        adjustedTranslation[2] -= 0.15; // Push back by 0.5 units
        mat4.translate(translationMatrix, translationMatrix, adjustedTranslation);

        // Draw the stand
        this.bindBufferAndAttributes(this.standVertexBuffer);
        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);
        this.bindTextureAndDraw(this.standTexture, this.standIndexBuffer, 6); // Draw the stand
    }

    drawBase(modelViewMatrix, translation, rotation) {
        let translationMatrix = mat4.clone(modelViewMatrix);
        mat4.rotateY(translationMatrix, translationMatrix, rotation);
        
        // Adjust the translation to push the base back by 0.5 units in the Z direction
        let adjustedTranslation = vec3.clone(translation);
        adjustedTranslation[2] -= 1.60; // Push back by 0.5 units
        mat4.translate(translationMatrix, translationMatrix, adjustedTranslation);
    
        // Draw the base
        this.bindBufferAndAttributes(this.baseVertexBuffer);
        gl.uniformMatrix4fv(uModelViewMatrixLocation, false, translationMatrix);
        this.bindTextureAndDraw(this.baseTexture, this.baseIndexBuffer, 6); // Draw the base
    }
    

    bindBufferAndAttributes(buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(texCoordLocation);
    }

    bindTextureAndDraw(texture, indexBuffer, count) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTexture'), 0); // Set texture unit 0

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }

    createMonitor() {
        const monitorWidth = 5;
        const monitorHeight = 3;
        const monitorDepth = 0.3;
        const standWidth = 0.75;
        const standHeight = 1;
        const standDepth = 0.1;
        const baseWidth = 3;
        const baseHeight = -0.1;
        const baseDepth = 3;

        // Monitor frame vertices
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

        // Screen vertices
        const screenVertices = new Float32Array([
            // Front surface (screen)
            -monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 0, 0,    // top-left
            monitorWidth / 2, monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 1, 0,    // top-right
            monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 1, 1,   // bottom-right
            -monitorWidth / 2, -monitorHeight / 2, monitorDepth / 2, 0, 0, 1, 0, 1,   // bottom-left
        ]);

        // Stand vertices
        const standVertices = new Float32Array([
            // Stand base
            -standWidth / 2, -monitorHeight / 2 - standHeight, standDepth / 2, 0, 0, 1, 0, 0,    // bottom-left
            standWidth / 2, -monitorHeight / 2 - standHeight, standDepth / 2, 0, 0, 1, 1, 0,    // bottom-right
            standWidth / 2, -monitorHeight / 2, standDepth / 2, 0, 0, 1, 1, 1,   // top-right
            -standWidth / 2, -monitorHeight / 2, standDepth / 2, 0, 0, 1, 0, 1,   // top-left
        ]);

        // Base vertices
        const baseVertices = new Float32Array([
            // Base
            -baseWidth / 2, -monitorHeight / 2 - standHeight - baseHeight, baseDepth / 2, 0, 0, 1, 0, 0,   // bottom-left
            baseWidth / 2, -monitorHeight / 2 - standHeight - baseHeight, baseDepth / 2, 0, 0, 1, 1, 0,   // bottom-right
            baseWidth / 2, -monitorHeight / 2 - standHeight, baseDepth / 2, 0, 0, 1, 1, 1,   // top-right
            -baseWidth / 2, -monitorHeight / 2 - standHeight, baseDepth / 2, 0, 0, 1, 0, 1,  // top-left
        ]);

        // Monitor indices
        const monitorIndices = new Uint16Array([
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

        // Screen indices
        const screenIndices = new Uint16Array([
            // Front surface (screen)
            0, 1, 2, 0, 2, 3  // These 6 indices represent the front screen
        ]);

        // Stand indices
        const standIndices = new Uint16Array([
            0, 1, 2, 0, 2, 3 // These 6 indices represent the stand
        ]);

        // Base indices
        const baseIndices = new Uint16Array([
            0, 1, 2, 0, 2, 3 // These 6 indices represent the base
        ]);

        return { monitorVertices, monitorIndices, screenVertices, screenIndices, standVertices, standIndices, baseVertices, baseIndices };
    }

    createMonitorBuffers() {
        return {
            monitorVertexBuffer: this.monitorVertexBuffer,
            monitorIndexBuffer: this.monitorIndexBuffer,
            screenVertexBuffer: this.screenVertexBuffer,
            screenIndexBuffer: this.screenIndexBuffer,
            standVertexBuffer: this.standVertexBuffer,
            standIndexBuffer: this.standIndexBuffer,
            baseVertexBuffer: this.baseVertexBuffer,
            baseIndexBuffer: this.baseIndexBuffer
        };
    }
}

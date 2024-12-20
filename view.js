/* ===========================================================================================================================
 * File: view.js
 * Author: Wesly Barayuga
 * Date: 11/8/2024
 * Purpose: Initialize WebGL context and set up the canvas for rendering
 * =========================================================================================================================== */

let canvas;
let gl;

function initView() {
    try {
        canvas = document.getElementById("glCanvas");
        gl = canvas.getContext("webgl2");
        if (!gl) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>initView(): Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
}

initView();
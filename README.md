# WebGL 3D Scene Viewer - Micron Technology Cubicle Recreation

## Overview

This project showcases a 3D scene rendered using WebGL 2.0, where a 3D recreation of my cubicle during my time working at **Micron Technology** is displayed. The scene includes elements such as a desk, monitors, lighting effects, camera controls, and textures, giving you an interactive view of my workspace. Users can explore the environment using keyboard and mouse input.

## Live Demo

View the live demo of the project by visiting the following link:  
[**Live Demo**]([https://wes-brook.github.io/3D-Room-WebGL.20/])

## Animated Preview

Here’s a preview of the 3D scene in action:

![Cubicle Demo](other/demo.gif)

## Features

- **3D Cubicle Model**: A detailed 3D recreation of my cubicle at Micron Technology, including the desk, walls, floor, and monitors.
- **Camera Controls**: Uses mouse and keyboard input to move around the scene and adjust the camera view to explore the cubicle.
- **Lighting**: Supports both directional and positional lighting for enhanced realism.
- **Textures**: Textures are applied to various objects in the scene to create a more realistic environment.
- **Interactive Elements**: Rotate and move the camera and toggle light sources.

## Getting Started

### Prerequisites

- A modern web browser that supports WebGL 2.0 (e.g., Chrome, Firefox, Edge).
- A basic understanding of WebGL, JavaScript, and 3D graphics programming.

### Installation

1. Clone or download the repository to your local machine.
2. Open `index.html` in your web browser to load and run the project.

### File Structure

- **index.html**: Main HTML file to display the WebGL canvas.
- **main.js**: Handles scene rendering and the main WebGL setup.
- **controller.js**: Manages input controls for camera and light toggling.
- **view.js**: Initializes the WebGL context and sets up the canvas for rendering.
- **auxiliary.js**: Contains utility functions for buffer management and texture loading.
- **cube.js, desk2.js, monitor.js, room.js**: Files that define the geometry and objects used in the scene (desk, monitors, room, etc.).

### Key Controls

- **WASD**: Move the camera forward, backward, and sideways.
- **Mouse**: Click and drag to look around the scene (pointer lock enabled).
- **1 / 2**: Toggle positional light on/off.
- **3 / 4**: Toggle directional light on/off.

### How It Works

- **Camera Movement**: Camera position and orientation are controlled by mouse and keyboard inputs.
- **Lighting**: The scene supports both positional and directional light sources, with the ability to toggle between them using keyboard shortcuts.
- **WebGL Buffers**: Vertex and index buffers are used to efficiently render objects in the 3D scene, reducing CPU usage during rendering.

## Troubleshooting

- **WebGL not supported**: If WebGL is not supported by your browser, update to a newer version of your browser or use a WebGL-supported browser.
- **Canvas not rendering**: Ensure your graphics drivers are up-to-date and that you are using a compatible graphics card.

## Acknowledgments

- This project uses WebGL 2.0 for rendering 3D graphics in the browser.
- Inspired by my time working at **Micron Technology**, where I recreated my cubicle in 3D.
- Inspired by various WebGL tutorials and documentation.

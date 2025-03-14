<!--HEADER-->
<h1 align="center">Pong Game
  <!--<img alt="Complete" src="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/dark-theme/complete.svg">-->
</h1>
<!--FINISH HEADER-->

<!--MINI DESCRIPTION-->
> A **web game** inspired by the Atari Pong, but with a 3D twist – Built with **Three.js** for Two Players on One Keyboard!

<div align="center">
  <img align="center"  width="800" src="https://github.com/josephcheel/Pong-Game/blob/main/readme/pong_game.gif">
  
</div>
<div align="center">
  <img align="center" width="800" 
       src="https://github.com/josephcheel/Pong-Game/blob/main/readme/loading.png" 
       onload="this.src='https://imgs.search.brave.com/IfsEz9cmU1TdfG5835zHiPf_8i9VaqJl4PnP5um6uBk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTIuZ2lwaHkuY29t/L21lZGlhL2VteVNn/V28waUJLV3FuaTF3/Ui9naXBoeS5naWY_/Y2lkPTc5MGI3NjEx/cXhwZ2E5cHdlOG1y/a2J3MXY3eWVuZGVv/aWF0ZjlkNWEzbGFy/MWo0byZlcD12MV9n/aWZzX3NlYXJjaCZy/aWQ9Z2lwaHkuZ2lm/JmN0PWc.gif';">
</div>

<br>
<br>

### What is the project about

> [!NOTE]
> This repository is part of bigger project **ft_transcendence** from **42 school**. Check it out [here]( https://github.com/josephcheel/42-ft_transcendence.git)


This project is focused on developing a **3D web-based version of the classic Atari Pong game**, built using **Three.js** for rendering and interactivity. The game features enhanced modern graphics, immersive sound effects, and support for two players who can compete against each other using a single keyboard for controls. 

### **Features**:  
  * **Modernized graphics** with enhanced 3D visuals.  
  * **Immersive sound effects** for a better gameplay experience.  
  * **Two-player support** with a single keyboard for controls.  

### Technologies Used**:  
  * **Three.js** for 3D rendering.  
  * JavaScript for game logic and interactivity.  
  * HTML/CSS for UI elements (if applicable).  


## Required Software  

To compile and run the project, ensure you have the following installed:  

* **Make** – To manage the compilation process using the Makefile.  
* **Node.js & npm** – Required for package management and running a local development server.  
* **Three.js** – The core library for 3D rendering (installed via npm or CDN).  
* **A modern web browser** – Such as Chrome or Firefox, with WebGL support

Use make help to chekc the commands availeable, there are two the Development section and the Dockerized section

- This means you can run `make` followed by one of the listed commands to perform specific actions related to your project.  

## Build Instructions
> Compilation is managed through the Makefile rules.

### **DOCKERIZED DEPLOY**  
These commands are for managing the application using Docker:  

- **`make up`** – Starts the application using Docker (this is the default command if no other option is specified).  
- **`make down`** – Stops the application running in Docker.  
- **`make re`** – Restarts the application in Docker (useful if you need to restart without rebuilding the image).  
- **`make re-img`** – Restarts the application in Docker, but also rebuilds the Docker image, ensuring that any changes are applied.  
- **`make clean-cache`** – Cleans the Docker cache, useful for freeing up space or clearing outdated images.  

### **DEVELOPMENT DEPLOY**  
These commands are for running the application in a local development environment:  

- **`make app-dev`** – Starts the application in development mode, typically with features like hot reloading or debug logging enabled.  
- **`make clean-app-dev`** – Cleans the application's dependencies, likely removing node_modules or similar build artifacts to ensure a fresh start for development.  



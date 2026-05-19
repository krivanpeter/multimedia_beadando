# Sci-Fi Web Strategy Game

A 2D browser-based strategy game built with HTML5 Canvas. Developed as a university project for a Multimedia course.

## 🌟 Overview

Players compete in a turn-based/active-time hybrid system where managing resources and positioning is key. The game revolves around an Action Point (AP) system and round timers. You must mine resources (Rock, Iron, Uranium) to deploy units, build your army, and ultimately defeat your opponent or reach the resource goal.

## 🎮 Features

* **Turn-Based Mechanics:** Each player has a limited number of Action Points (AP) per turn, controlled by a round timer.
* **Resource Management:**
  * Collect **Rock**, **Iron**, and **Uranium**.
  * Reaching the required Uranium threshold serves as a win condition.
* **Unit Types:**
  * **Worker:** Basic, cost-effective resource gatherer.
  * **Truck:** Advanced mining unit with higher resource yields.
  * **Tank:** Combat unit capable of firing rockets to destroy enemy units (attacking consumes AP).
* **Game Engine & Systems:**
  * Custom game loop (`requestAnimationFrame`) with delta-time updates.
  * Save & Load functionality using `localStorage`.
  * Fully functioning pause and settings menus.
  * Event-driven architecture (`EventEmitter`) for loose coupling.
* **Audio & Visuals:** Sprite-based rendering with HTML Canvas and localized sound effects for unit movements and actions.

## 🛠️ Tech Stack

* **Frontend:** HTML5 (Canvas API), CSS3
* **Logic:** Vanilla JavaScript (ES6 Modules, Classes)
* **DOM Manipulation:** jQuery

## 🚀 Installation & Running

Due to the usage of ES6 Modules (`import`/`export`), the game must be run through a local web server to prevent browser CORS restrictions.

1. Clone or extract the project folder.
2. Open the directory in your preferred code editor (e.g., VS Code).
3. Start a local server:
   * **VS Code:** Use the *Live Server* extension.
   * **Terminal:** Run `python -m http.server 8000` or `npx serve`.
4. Open your browser and navigate to `http://localhost:8000`.

## ⌨️ Controls

* **Left Click:** Select units, assign move paths, gather resources, or attack.
* **`P` Key:** Open the Pause Menu.
* **UI Buttons:** End turn, build units, adjust game speed, and toggle settings.

## 📂 Architecture Highlights

* `GameScene.js`: Manages the main map, rendering cycles, and input handling.
* `main.js`: Controls the global game loop, UI interactions, and state persistence.
* `Entity.js` & `Unit.js`: Base classes handling grid math, rotation, and movement.
* `initSettings.js`: Contains central configuration (costs, hitpoints, speeds).

## 🎨 Assets & Credits

* **Graphics & Spritesheet:** [Kenney - Sci-Fi RTS Asset Pack](https://kenney.nl/assets/sci-fi-rts)
* **Sound Effects:** Generated using [Bfxr](https://www.bfxr.net/)
* **Readme.MD:** Generated using [Gemini](https://gemini.google.com/app)

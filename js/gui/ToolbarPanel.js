class ToolbarPanel {
  constructor(engine, gui) {
    this.engine = engine;
    this.gui = gui;
    // Add reference to the AnimationAPI
    this.animation = new AnimationAPI(engine);
    // GUI folders
    this.toolsFolder = null;
    this.projectFolder = null;
    this.templatesFolder = null;
    // GUI controllers
    this.toolControllers = {};
    // Panel visibility state
    this.visible = true;
  }

  initialize() {
    // Create folders
    this.toolsFolder = this.gui.addFolder("Tools");
    this.projectFolder = this.gui.addFolder("Project");
    // Open folders by default
    this.toolsFolder.open();
    this.projectFolder.open();
    // Add tools
    this.addShapeTools();
    this.addCanvasSettings();
    this.addProjectSettings();
    this.addAnimationTemplates();
  }

  addShapeTools() {
    const shapeTools = {
      createCircle: () => {
        this.createShape("circle");
      },
      createRectangle: () => {
        this.createShape("rectangle");
      },
      createPath: () => {
        this.createShape("path");
      },
      createText: () => {
        this.createShape("text");
      },
    };

    // Add shape creation tools to a subfolder for better organization
    const shapesFolder = this.toolsFolder.addFolder("Add Shapes");
    this.toolControllers.createCircle = shapesFolder
      .add(shapeTools, "createCircle")
      .name("Circle");
    this.toolControllers.createRectangle = shapesFolder
      .add(shapeTools, "createRectangle")
      .name("Rectangle");
    this.toolControllers.createPath = shapesFolder
      .add(shapeTools, "createPath")
      .name("Path");
    this.toolControllers.createText = shapesFolder
      .add(shapeTools, "createText")
      .name("Text");
    shapesFolder.open();

    // Add common adjustments
    const adjustmentsFolder = this.toolsFolder.addFolder("Adjustments");

    const arrangements = {
      alignCenter: () => {
        if (this.engine.selectedObject) {
          this.engine.selectedObject.x = this.engine.canvasWidth / 2;
        }
      },
      alignMiddle: () => {
        if (this.engine.selectedObject) {
          this.engine.selectedObject.y = this.engine.canvasHeight / 2;
        }
      },
      bringToFront: () => {
        if (this.engine.selectedObject) {
          this.engine.bringToFront(this.engine.selectedObject);
        }
      },
      sendToBack: () => {
        if (this.engine.selectedObject) {
          this.engine.sendToBack(this.engine.selectedObject);
        }
      },
    };

    adjustmentsFolder
      .add(arrangements, "alignCenter")
      .name("Center Horizontally");
    adjustmentsFolder
      .add(arrangements, "alignMiddle")
      .name("Center Vertically");
    adjustmentsFolder.add(arrangements, "bringToFront").name("Bring to Front");
    adjustmentsFolder.add(arrangements, "sendToBack").name("Send to Back");
    adjustmentsFolder.open();
  }

  addCanvasSettings() {
    // Create a separate canvas settings folder
    const canvasFolder = this.toolsFolder.addFolder("Canvas Settings");

    // Background color
    const bgColorObj = {
      backgroundColor: [
        red(this.engine.backgroundColor),
        green(this.engine.backgroundColor),
        blue(this.engine.backgroundColor),
      ],
    };

    this.toolControllers.backgroundColor = canvasFolder
      .addColor(bgColorObj, "backgroundColor")
      .name("Canvas Color")
      .onChange((value) => {
        this.animation.setBackgroundColor(value);
      });

    // Canvas size
    const canvasSettings = {
      width: this.engine.canvasWidth,
      height: this.engine.canvasHeight,
      updateSize: () => {
        this.engine.setCanvasSize(canvasSettings.width, canvasSettings.height);
      },
    };

    this.toolControllers.canvasWidth = canvasFolder
      .add(canvasSettings, "width", 100, 2000)
      .step(10)
      .name("Width");
    this.toolControllers.canvasHeight = canvasFolder
      .add(canvasSettings, "height", 100, 1200)
      .step(10)
      .name("Height");
    this.toolControllers.updateSize = canvasFolder
      .add(canvasSettings, "updateSize")
      .name("Apply Size");

    // Grid settings
    this.toolControllers.showGrid = canvasFolder
      .add(this.engine, "gridVisible")
      .name("Show Grid");
    this.toolControllers.gridSize = canvasFolder
      .add(this.engine, "gridSize", 5, 50)
      .step(5)
      .name("Grid Size");

    // Add preset sizes
    const presetSizes = {
      "720p": () => this.setCanvasSize(1280, 720),
      "1080p": () => this.setCanvasSize(1920, 1080),
      Square: () => this.setCanvasSize(800, 800),
      Instagram: () => this.setCanvasSize(1080, 1080),
      Twitter: () => this.setCanvasSize(1200, 675),
    };

    const presetsFolder = canvasFolder.addFolder("Preset Sizes");
    for (const [name, action] of Object.entries(presetSizes)) {
      presetsFolder.add({ [name]: action }, name);
    }

    canvasFolder.open();
  }

  setCanvasSize(width, height) {
    // Update the controllers first
    this.toolControllers.canvasWidth.setValue(width);
    this.toolControllers.canvasHeight.setValue(height);

    // Then update the engine
    this.engine.setCanvasSize(width, height);
  }

  addProjectSettings() {
    // FPS and duration settings
    const timelineSettings = {
      fps: this.engine.timeline.fps,
      duration: this.engine.timeline.totalFrames / this.engine.timeline.fps,
      updateTimeline: () => {
        this.animation.setFPS(timelineSettings.fps);
        this.animation.setDuration(timelineSettings.duration);
      },
    };

    this.toolControllers.fps = this.projectFolder
      .add(timelineSettings, "fps", 1, 60)
      .step(1)
      .name("FPS");
    this.toolControllers.duration = this.projectFolder
      .add(timelineSettings, "duration", 1, 60)
      .step(1)
      .name("Duration (sec)");
    this.toolControllers.updateTimeline = this.projectFolder
      .add(timelineSettings, "updateTimeline")
      .name("Apply Timeline");

    // Project save/load
    const projectActions = {
      saveProject: () => {
        this.saveProject();
      },
      loadProject: () => {
        this.loadProject();
      },
      exportAnimation: () => {
        this.showExportOptions();
      },
      newProject: () => {
        if (
          confirm("Create new project? Current work will be lost if not saved.")
        ) {
          this.animation.clearAll();
        }
      },
    };
    const actionsFolder = this.projectFolder.addFolder("Project Actions");
    actionsFolder.add(projectActions, "newProject").name("New Project");
    actionsFolder.add(projectActions, "saveProject").name("Save Project");
    actionsFolder.add(projectActions, "loadProject").name("Load Project");
    actionsFolder
      .add(projectActions, "exportAnimation")
      .name("Export Animation");
    actionsFolder.open();
  }

  saveProject() {
    this.animation.saveProject();
    alert("Project saved successfully!");
  }

  loadProject() {
    // Create an invisible file input element to handle file selection
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.className = "hidden";
    document.body.appendChild(fileInput);

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target.result);
            this.animation.loadProject(projectData);
            alert("Project loaded successfully!");
          } catch (error) {
            alert("Error loading project: " + error.message);
          }
        };
        reader.readAsText(file);
      }
      document.body.removeChild(fileInput);
    };

    fileInput.click();
  }

  showExportOptions() {
    // Create export dialog
    const exportDialog = document.createElement("div");
    exportDialog.className =
      "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl w-80 p-5 z-50";

    exportDialog.innerHTML = `
                <h3 class="text-lg font-bold mb-4">Export Animation</h3>
                <div class="mb-4">
                    <label class="block mb-1">Format:</label>
                    <select id="export-format" class="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded">
                        <option value="gif">GIF</option>
                        <option value="mp4">MP4 Video</option>
                        <option value="webm" selected>WebM Video</option>
                        <option value="png">PNG Sequence</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block mb-1">Quality:</label>
                    <select id="export-quality" class="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded">
                        <option value="0.5">Low</option>
                        <option value="0.8" selected>Medium</option>
                        <option value="1.0">High</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block mb-1">Range:</label>
                    <div class="flex gap-2 mt-1">
                        <input type="number" id="export-start-frame" placeholder="Start" value="0" class="flex-1 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded">
                        <input type="number" id="export-end-frame" placeholder="End" value="${
                          this.engine.timeline.totalFrames - 1
                        }" class="flex-1 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded">
                    </div>
                </div>
                <div class="flex justify-between mt-5">
                    <button id="export-cancel" class="bg-gray-600 text-gray-100 border-none rounded px-4 py-2 cursor-pointer hover:bg-gray-500">Cancel</button>
                    <button id="export-confirm" class="bg-blue-600 text-gray-100 border-none rounded px-4 py-2 cursor-pointer hover:bg-blue-500">Export</button>
                </div>
            `;

    document.body.appendChild(exportDialog);

    // Add event listeners
    document.getElementById("export-cancel").addEventListener("click", () => {
      document.body.removeChild(exportDialog);
    });

    document.getElementById("export-confirm").addEventListener("click", () => {
      const format = document.getElementById("export-format").value;
      const quality = parseFloat(
        document.getElementById("export-quality").value
      );
      const startFrame = parseInt(
        document.getElementById("export-start-frame").value
      );
      const endFrame = parseInt(
        document.getElementById("export-end-frame").value
      );

      // Use AnimationAPI's export function
      this.animation.export({
        format: format,
        quality: quality,
        fps: this.engine.timeline.fps,
        filename: `animation_${Date.now()}`,
      });

      // Set the desired frame range
      this.engine.timeline.setFrame(startFrame);

      alert(
        `Exporting animation as ${format} from frame ${startFrame} to ${endFrame} at ${quality} quality.`
      );

      document.body.removeChild(exportDialog);
    });
  }

  addAnimationTemplates() {
    this.templatesFolder = this.gui.addFolder("Animation Templates");

    const templates = {
      oneToAllBroadCast: () => this.createOneToAllBroadcast(),
      typingAnimation: () => this.createTypingAnimation(),
      fadeInOut: () => this.createFadeInOutAnimation(),
      particleExplosion: () => this.createParticleAnimation(),
      waveAnimation: () => this.createWaveAnimation(),
      logoReveal: () => this.createLogoRevealAnimation(),
      recursive: () => this.createRecursiveDoublingAnimation(),
    };

    this.templatesFolder
      .add(templates, "oneToAllBroadCast")
      .name("One To All Broadcast");
    this.templatesFolder.add(templates, "typingAnimation").name("Typing Text");
    this.templatesFolder.add(templates, "fadeInOut").name("Fade In/Out");
    this.templatesFolder
      .add(templates, "particleExplosion")
      .name("Particle Effect");
    this.templatesFolder.add(templates, "waveAnimation").name("Wave Animation");
    this.templatesFolder.add(templates, "logoReveal").name("Logo Reveal");
    this.templatesFolder.add(templates, "recursive").name("Recursive Reveal");

    this.templatesFolder.open();
  }

  createShape(type) {
    const centerX = this.engine.canvasWidth / 2;
    const centerY = this.engine.canvasHeight / 2;

    // Find an empty spot near the center
    let x = centerX + Math.random() * 100 - 50;
    let y = centerY + Math.random() * 100 - 50;

    // Create the shape using the AnimationAPI
    const newShape = this.animation.createShape(type, {
      x: x,
      y: y,
    });

    // Select the new shape
    this.engine.selectObject(newShape);

    return newShape;
  }

  update() {
    // Nothing to update regularly in toolbar
  }

  toggleVisibility(visible) {
    this.visible = visible;

    if (this.toolsFolder) {
      this.toolsFolder.domElement.parentElement.style.display = visible
        ? "block"
        : "none";
    }

    if (this.projectFolder) {
      this.projectFolder.domElement.parentElement.style.display = visible
        ? "block"
        : "none";
    }

    if (this.templatesFolder) {
      this.templatesFolder.domElement.parentElement.style.display = visible
        ? "block"
        : "none";
    }
  }

  // // Animation template methods using the AnimationAPI
  // createBounceAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Create a bouncing ball
  //     const ball = this.animation.createShape("circle", {
  //       x: this.engine.canvasWidth / 2,
  //       y: 100,
  //       size: 80,
  //       fill: [255, 100, 100],
  //       name: "Bouncing Ball",
  //     });

  //     // Create keyframes for bouncing
  //     this.animation.animate(ball, "y", [
  //       { frame: 0, value: 100, easing: "easeInQuad" },
  //       {
  //         frame: 20,
  //         value: this.engine.canvasHeight - 40,
  //         easing: "easeOutBounce",
  //       },
  //       {
  //         frame: 45,
  //         value: this.engine.canvasHeight - 40,
  //         easing: "easeInQuad",
  //       },
  //       { frame: 60, value: 200, easing: "easeOutQuad" },
  //       {
  //         frame: 75,
  //         value: this.engine.canvasHeight - 40,
  //         easing: "easeOutBounce",
  //       },
  //       {
  //         frame: 90,
  //         value: this.engine.canvasHeight - 40,
  //         easing: "easeInQuad",
  //       },
  //       { frame: 105, value: 300, easing: "easeOutQuad" },
  //       {
  //         frame: 120,
  //         value: this.engine.canvasHeight - 40,
  //         easing: "easeOutBounce",
  //       },
  //     ]);

  //     // Squash and stretch
  //     this.animation.animate(ball, "width", [
  //       { frame: 0, value: 80, easing: "linear" },
  //       { frame: 19, value: 90, easing: "easeInCubic" },
  //       { frame: 20, value: 100, easing: "linear" },
  //       { frame: 22, value: 60, easing: "easeOutCubic" },
  //       { frame: 30, value: 80, easing: "easeInOutCubic" },
  //       { frame: 59, value: 80, easing: "linear" },
  //       { frame: 60, value: 90, easing: "easeInCubic" },
  //       { frame: 74, value: 90, easing: "easeInCubic" },
  //       { frame: 75, value: 100, easing: "linear" },
  //       { frame: 77, value: 60, easing: "easeOutCubic" },
  //       { frame: 85, value: 80, easing: "easeInOutCubic" },
  //       { frame: 104, value: 80, easing: "linear" },
  //       { frame: 105, value: 90, easing: "easeInCubic" },
  //       { frame: 119, value: 90, easing: "easeInCubic" },
  //       { frame: 120, value: 100, easing: "linear" },
  //       { frame: 122, value: 60, easing: "easeOutCubic" },
  //       { frame: 130, value: 80, easing: "easeInOutCubic" },
  //     ]);

  //     // Create a shadow with the AnimationAPI
  //     const shadow = this.animation.createShape("circle", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight - 10,
  //       width: 100,
  //       height: 20,
  //       fill: [0, 0, 0, 100],
  //       name: "Ball Shadow",
  //     });

  //     // Shadow animation
  //     this.animation.animate(shadow, "width", [
  //       { frame: 0, value: 60, easing: "linear" },
  //       { frame: 20, value: 100, easing: "easeOutQuad" },
  //       { frame: 45, value: 100, easing: "linear" },
  //       { frame: 60, value: 70, easing: "easeInOutQuad" },
  //       { frame: 75, value: 90, easing: "easeOutQuad" },
  //       { frame: 90, value: 90, easing: "linear" },
  //       { frame: 105, value: 80, easing: "easeInOutQuad" },
  //       { frame: 120, value: 85, easing: "easeOutQuad" },
  //     ]);

  //     this.animation.animate(shadow, "opacity", [
  //       { frame: 0, value: 150, easing: "linear" },
  //       { frame: 20, value: 100, easing: "easeOutQuad" },
  //       { frame: 60, value: 180, easing: "easeInQuad" },
  //       { frame: 75, value: 120, easing: "easeOutQuad" },
  //       { frame: 105, value: 150, easing: "easeInQuad" },
  //       { frame: 120, value: 130, easing: "easeOutQuad" },
  //     ]);

  //     // Set object order
  //     this.engine.sendToBack(shadow);
  //     this.engine.bringToFront(ball);

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  // createTypingAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Create text object using the AnimationAPI
  //     const text = this.animation.createShape("text", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2,
  //       text: "",
  //       fontSize: 36,
  //       fill: [255, 255, 255],
  //       name: "Typing Text",
  //     });

  //     // Use the AnimationAPI's typeText method
  //     this.animation.typeText(
  //       text,
  //       0,
  //       "Creating programmatic animations is fun!",
  //       80,
  //       "linear",
  //       {
  //         cursor: true,
  //         cursorChar: "|",
  //         cursorBlinkRate: 15,
  //       }
  //     );

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  // createFadeInOutAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Create a background with the AnimationAPI
  //     const bg = this.animation.createShape("rectangle", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2,
  //       width: this.engine.canvasWidth,
  //       height: this.engine.canvasHeight,
  //       fill: [30, 30, 30],
  //       name: "Background",
  //     });

  //     // Create a centered text with the AnimationAPI
  //     const text = this.animation.createShape("text", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2,
  //       text: "FADE IN & OUT",
  //       fontSize: 48,
  //       fontFamily: "Arial",
  //       textStyle: "bold",
  //       fill: [255, 255, 255],
  //       name: "Fading Text",
  //     });

  //     // Use the AnimationAPI's crossFade method
  //     this.animation.fadeIn(text, 0, 30, "easeOutCubic");
  //     this.animation.animate(text, "fontSize", [
  //       { frame: 0, value: 36, easing: "easeOutQuad" },
  //       { frame: 30, value: 48, easing: "easeOutQuad" },
  //       { frame: 60, value: 48, easing: "linear" },
  //       { frame: 90, value: 54, easing: "easeInQuad" },
  //     ]);
  //     this.animation.fadeOut(text, 60, 30, "easeInCubic");

  //     // Set object order
  //     this.engine.sendToBack(bg);
  //     this.engine.bringToFront(text);

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  // createParticleAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Create a text that will explode into particles
  //     const text = this.animation.createShape("text", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2,
  //       text: "BOOM!",
  //       fontSize: 72,
  //       fontFamily: "Impact",
  //       fill: [255, 100, 50],
  //       name: "Exploding Text",
  //     });

  //     // Animate the text growing and then disappearing
  //     this.animation.animate(text, "fontSize", [
  //       { frame: 0, value: 10, easing: "easeOutElastic" },
  //       { frame: 20, value: 72, easing: "easeOutElastic" },
  //       { frame: 45, value: 90, easing: "easeInBack" },
  //       { frame: 50, value: 0, easing: "linear" },
  //     ]);

  //     // Add a frame action to create particles after text explodes
  //     this.animation.addFrameAction(50, () => {
  //       // Create particle explosion using the AnimationAPI's particle system
  //       this.animation.createParticleSystem(
  //         this.engine.canvasWidth / 2,
  //         this.engine.canvasHeight / 2,
  //         30,
  //         {
  //           type: "circle",
  //           size: 20,
  //           sizeVariation: 10,
  //           colorStart: [255, 100, 50],
  //           colorEnd: [255, 255, 0],
  //           duration: 70,
  //           spread: 200,
  //           gravity: 0.5,
  //           startFrame: 50,
  //           scaleDown: true,
  //         }
  //       );
  //     });

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  // createWaveAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Create a group of circles in a circular arrangement using the AnimationAPI
  //     const circleGroup = this.animation.createGroup(
  //       12,
  //       "circle",
  //       {
  //         centerX: this.engine.canvasWidth / 2,
  //         centerY: this.engine.canvasHeight / 2,
  //         radius: 150,
  //         size: 30,
  //         fill: [100, 200, 255],
  //       },
  //       "circle"
  //     );

  //     // Use the AnimationAPI's waveEffect to create a wave animation
  //     this.animation.waveEffect(
  //       circleGroup,
  //       "width",
  //       0,
  //       120,
  //       30,
  //       60,
  //       "easeInOutSine",
  //       true
  //     );

  //     // Create a center circle
  //     const centerCircle = this.animation.createShape("circle", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2,
  //       size: 60,
  //       fill: [50, 100, 255],
  //       name: "Center Circle",
  //     });

  //     // Use the AnimationAPI to spin the center circle
  //     this.animation.spin(centerCircle, 0, 120, 1, true, "linear");

  //     // Pulse the center circle
  //     this.animation.pulse(centerCircle, 0, 2, 120, 0.8, 1.2);

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  // createLogoRevealAnimation() {
  //   // Clear existing objects if user confirms
  //   if (confirm("This will create a new animation. Continue?")) {
  //     this.animation.clearAll();

  //     // Define logo parts colors
  //     const colors = [
  //       [50, 100, 200],
  //       [60, 160, 220],
  //       [70, 180, 240],
  //       [80, 200, 255],
  //     ];

  //     // Create a group of rectangles for the logo
  //     const parts = [];
  //     for (let i = 0; i < 4; i++) {
  //       const rect = this.animation.createShape("rectangle", {
  //         x: this.engine.canvasWidth / 2 - 120 + i * 80,
  //         y: this.engine.canvasHeight / 2 - 100, // Start above final position
  //         width: 80,
  //         height: 80,
  //         cornerRadius: 10,
  //         fill: colors[i],
  //         opacity: 0,
  //         rotation: 45,
  //         name: `Logo Part ${i + 1}`,
  //       });

  //       parts.push(rect);
  //     }

  //     // Create staggered animation for logo parts
  //     for (let i = 0; i < parts.length; i++) {
  //       const part = parts[i];
  //       const delay = i * 5;

  //       // Fade in, rotate and move down
  //       this.animation.fadeIn(part, delay, 15, "easeOutQuad");

  //       this.animation.animate(part, "rotation", [
  //         { frame: delay, value: 45, easing: "easeOutBack" },
  //         { frame: 20 + delay, value: 0, easing: "easeOutBack" },
  //       ]);

  //       this.animation.animate(part, "y", [
  //         {
  //           frame: delay,
  //           value: this.engine.canvasHeight / 2 - 100,
  //           easing: "easeOutBack",
  //         },
  //         {
  //           frame: 20 + delay,
  //           value: this.engine.canvasHeight / 2,
  //           easing: "easeOutBack",
  //         },
  //       ]);

  //       // Add bounce effect at the end
  //       this.animation.pulse(part, 60 + delay, 1, 20, 0.8, 1.2, "easeOutBack");
  //     }

  //     // Add text using the AnimationAPI
  //     const text = this.animation.createShape("text", {
  //       x: this.engine.canvasWidth / 2,
  //       y: this.engine.canvasHeight / 2 + 150, // Start below final position
  //       text: "ANIMATOR",
  //       fontSize: 48,
  //       fontFamily: "Arial",
  //       textStyle: "bold",
  //       fill: [255, 255, 255],
  //       opacity: 0,
  //       name: "Logo Text",
  //     });

  //     // Animate the text
  //     this.animation.fadeIn(text, 25, 15, "easeOutQuad");

  //     this.animation.animate(text, "y", [
  //       {
  //         frame: 25,
  //         value: this.engine.canvasHeight / 2 + 150,
  //         easing: "easeOutQuad",
  //       },
  //       {
  //         frame: 50,
  //         value: this.engine.canvasHeight / 2 + 100,
  //         easing: "easeOutQuad",
  //       },
  //     ]);

  //     // Add text pulse
  //     this.animation.pulse(text, 60, 1, 20, 0.95, 1.08, "easeInOutQuad");

  //     // Start the animation
  //     this.animation.reset();
  //     this.animation.play();
  //   }
  // }

  createRecursiveDoublingAnimation() {
    this.animation.clearAll();
    this.animation.setDuration(20);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    const n1 = this.animation.createShape("circle", {
      x: 200,
      y: 200,
      width: 120,
      height: 120,
      fill: [0, 0, 250],
      name: "node 1",
    });

    const n2 = this.animation.createShape("circle", {
      x: 600,
      y: 200,
      width: 120,
      height: 120,
      fill: [0, 0, 250],
      name: "node 2",
    });

    const n3 = this.animation.createShape("circle", {
      x: 600,
      y: 600,
      width: 120,
      height: 120,
      fill: [0, 0, 250],
      name: "node 3",
    });

    const n4 = this.animation.createShape("circle", {
      x: 200,
      y: 600,
      width: 120,
      height: 120,
      fill: [0, 0, 250],
      name: "node 4",
    });

    const n5 = this.animation.createShape("circle", {
      x: 400,
      y: 500,
      width: 120,
      height: 120,
      fill: [0, 0, 200],
      name: "node 5",
    });

    const n6 = this.animation.createShape("circle", {
      x: 800,
      y: 500,
      width: 120,
      height: 120,
      fill: [0, 0, 200],
      name: "node 6",
    });

    const n7 = this.animation.createShape("circle", {
      x: 800,
      y: 100,
      width: 120,
      height: 120,
      fill: [0, 0, 200],
      name: "node 7",
    });

    const n8 = this.animation.createShape("circle", {
      x: 400,
      y: 100,
      width: 120,
      height: 120,
      fill: [0, 0, 200],
      name: "node 8",
    });

    const fp1 = this.animation.createShape("flowpath", {
      startShape: n1,
      endShape: n2,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp2 = this.animation.createShape("flowpath", {
      startShape: n2,
      endShape: n3,
      startConnection: "bottom",
      endConnection: "top",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp3 = this.animation.createShape("flowpath", {
      startShape: n3,
      endShape: n4,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp4 = this.animation.createShape("flowpath", {
      startShape: n4,
      endShape: n1,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp5 = this.animation.createShape("flowpath", {
      startShape: n5,
      endShape: n6,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp6 = this.animation.createShape("flowpath", {
      startShape: n6,
      endShape: n7,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp7 = this.animation.createShape("flowpath", {
      startShape: n7,
      endShape: n8,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp8 = this.animation.createShape("flowpath", {
      startShape: n8,
      endShape: n5,
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp9 = this.animation.createShape("flowpath", {
      startShape: n1,
      endShape: n8,
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp10 = this.animation.createShape("flowpath", {
      startShape: n2,
      endShape: n7,
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp11 = this.animation.createShape("flowpath", {
      startShape: n3,
      endShape: n6,
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp12 = this.animation.createShape("flowpath", {
      startShape: n4,
      endShape: n5,
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: [100, 200, 250],
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: [150, 220, 255], // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const data = this.animation.createShape("rectangle", {
      x: n1.x + 50,
      y: n1.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: true,
    });

    const data2 = this.animation.createShape("rectangle", {
      x: n2.x + 50,
      y: n2.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data3 = this.animation.createShape("rectangle", {
      x: n3.x + 50,
      y: n3.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data4 = this.animation.createShape("rectangle", {
      x: n4.x + 50,
      y: n4.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data5 = this.animation.createShape("rectangle", {
      x: n5.x + 50,
      y: n5.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data6 = this.animation.createShape("rectangle", {
      x: n6.x + 50,
      y: n6.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data7 = this.animation.createShape("rectangle", {
      x: n7.x + 50,
      y: n7.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    const data8 = this.animation.createShape("rectangle", {
      x: n8.x + 50,
      y: n8.y + 50,
      height: 50,
      width: 100,
      cornerRadius: 10,
      fill: [255, 255, 255],
      name: "",
      visible: false,
    });

    this.animation.animateMultiple(data, {
      text: [
        {
          frame: 0,
          value: "1,2,3,4,5,6,7,8",
        },
        {
          frame: 300,
          value: "1,2,3,4",
        },
        {
          frame: 600,
          value: "1,4",
        },
        {
          frame: 1200,
          value: "1",
        },
      ],
    });

    this.animation.animateMultiple(data8, {
      text: [
        {
          frame: 300,
          value: "5,6,7,8",
        },
        {
          frame: 600,
          value: "5,8",
        },
        {
          frame: 1200,
          value: "8",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 300,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data2, {
      text: [
        {
          frame: 600,
          value: "2,3",
        },
        {
          frame: 1200,
          value: "2",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 600,
          value: true,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data7, {
      text: [
        {
          frame: 600,
          value: "6,7",
        },
        {
          frame: 1200,
          value: "7",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 600,
          value: true,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data5, {
      text: [
        {
          frame: 1200,
          value: "5",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data4, {
      text: [
        {
          frame: 1200,
          value: "4",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data3, {
      text: [
        {
          frame: 1200,
          value: "3",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.animateMultiple(data6, {
      text: [
        {
          frame: 1200,
          value: "6",
        },
      ],
      visible: [
        {
          frame: 0,
          value: false,
        },
        {
          frame: 1200,
          value: true,
        },
      ],
    });

    this.animation.reset();
    this.animation.play(true);
  }

  createOneToAllBroadcast() {
    
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    // Node coordinates and names
    const nodeGrid = [
      // [x, y, name, highlightColor?]
      [100, 700, "node 0", colors.goldenRod], // Highlighted node
      [100, 500, "node 1"],
      [100, 300, "node 2"],
      [100, 100, "node 3"],
      [300, 700, "node 4"],
      [300, 500, "node 5"],
      [300, 300, "node 6"],
      [300, 100, "node 7"],
      [500, 700, "node 8"],
      [500, 500, "node 9"],
      [500, 300, "node 10"],
      [500, 100, "node 11"],
      [700, 700, "node 12"],
      [700, 500, "node 13"],
      [700, 300, "node 14"],
      [700, 100, "node 15"],
    ];

    // Create all nodes and keep reference by name
    const nodes = {};
    nodeGrid.forEach(([x, y, name, customFill]) => {
      nodes[name] = this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8,
      particleSize: 6,
      fill: colors.steelBlue,
      animationSpeed: 2,
    };

    const flowPaths = [
      // [startNode, endNode, startConnection, endConnection]
      ["node 0", "node 4", "right", "left"],
      ["node 4", "node 8", "right", "left"],
      ["node 8", "node 12", "right", "left"],

      ["node 1", "node 5", "right", "left"],
      ["node 5", "node 9", "right", "left"],
      ["node 9", "node 13", "right", "left"],

      ["node 2", "node 6", "right", "left"],
      ["node 6", "node 10", "right", "left"],
      ["node 10", "node 14", "right", "left"],

      ["node 3", "node 7", "right", "left"],
      ["node 7", "node 11", "right", "left"],
      ["node 11", "node 15", "right", "left"],

      ["node 0", "node 1", "top", "bottom"],
      ["node 1", "node 2", "top", "bottom"],
      ["node 2", "node 3", "top", "bottom"],
      ["node 4", "node 5", "top", "bottom"],
      ["node 5", "node 6", "top", "bottom"],
      ["node 6", "node 7", "top", "bottom"],
      ["node 8", "node 9", "top", "bottom"],
      ["node 9", "node 10", "top", "bottom"],
      ["node 10", "node 11", "top", "bottom"],
      ["node 12", "node 13", "top", "bottom"],
      ["node 13", "node 14", "top", "bottom"],
      ["node 14", "node 15", "top", "bottom"],
    ];

    flowPaths.forEach(([start, end, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[start],
        endShape: nodes[end],
        startConnection: startConn,
        endConnection: endConn,
      });
    });
    
  }
}

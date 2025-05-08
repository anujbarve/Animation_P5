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
    this.addAnimationTemplates();
    // Create folders
    this.toolsFolder = this.gui.addFolder("Tools");
    this.projectFolder = this.gui.addFolder("Project");
    // Open folders by default
    // Add tools
    this.addShapeTools();
    this.addCanvasSettings();
    this.addProjectSettings();
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
      oneToAllRecursiveDoubling: () => this.oneToAllRecursiveDoubling(),
      allToOneRecursiveDoubling: () => this.allToOneRecursiveDoubling(),
      matrixMultiplication: () => this.matrixMultiplication(),
      meshBroadCastOneToAll: () => this.meshBroadCastOneToAll(),
      hyperCubeBroadcastOneToAll: () => this.hyperCubeBroadcastOneToAll(),
      binaryTreeBroadcast: () => this.binaryTreeBroadcast(),
      allToAllBroadcastRing: () => this.allToAllBroadcastRing(),
      allToAllBroadcastMesh: () => this.allToAllBroadcastMesh(),
    };

    this.templatesFolder
      .add(templates, "oneToAllBroadCast")
      .name("One To All Broadcast");
    this.templatesFolder
      .add(templates, "oneToAllRecursiveDoubling")
      .name("One to All Broadcast Ring");
    this.templatesFolder
      .add(templates, "allToOneRecursiveDoubling")
      .name("All to One Reduction Ring");
    this.templatesFolder
      .add(templates, "matrixMultiplication")
      .name("Matrix Vector Multiplication");
    this.templatesFolder
      .add(templates, "meshBroadCastOneToAll")
      .name("Mesh Broadcast One to All");
    this.templatesFolder
      .add(templates, "hyperCubeBroadcastOneToAll")
      .name("HyperCube Broadcast One to All");
    this.templatesFolder
      .add(templates, "binaryTreeBroadcast")
      .name("Binary Tree One to All");
    this.templatesFolder
      .add(templates, "allToAllBroadcastRing")
      .name("All to All Broadcast Ring");
    this.templatesFolder
      .add(templates, "allToAllBroadcastMesh")
      .name("All to All Broadcast Mesh");

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
      [500, 700, "node 1"],
      [500, 300, "node 2"],
      [100, 300, "node 3"],
      [300, 500, "node 4"],
      [700, 500, "node 5"],
      [700, 100, "node 6"],
      [300, 100, "node 7"],
    ];

    // Create all nodes and keep reference by name

    const nodes = nodeGrid.map(([x, y, name, customFill]) => {
      return this.animation.createShape("circle", {
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
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    const flowPaths = [
      // [startNode, endNode, startConnection, endConnection]

      [0, 4, "center", "center"],
      [2, 6, "center", "center"],
      [1, 5, "center", "center"],
      [3, 7, "center", "center"],

      [0, 1, "center", "center"],
      [1, 2, "center", "center"],
      [2, 3, "center", "center"],
      [3, 0, "center", "center"],

      [4, 5, "center", "center"],
      [5, 6, "center", "center"],
      [6, 7, "center", "center"],
      [7, 4, "center", "center"],
    ];

    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    this.animation.reset();
    this.animation.play(true);
  }

  oneToAllRecursiveDoubling() {
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
    };

    const duration = 20;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const totalFrames = duration * fps; // Get total frames = duration × fps
    const pulseInterval = fps / 1.5; // 60 frames for one pulse cycle (steelBlue → goldenRod → steelBlue)
    const interval = 240;

    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and optional custom colors
    const nodeGrid = [
      [200, 400, colors.goldenRod], // node 0 (highlighted)
      [400, 400], // node 1
      [600, 400], // node 2
      [800, 400], // node 3
      [800, 200], // node 4
      [600, 200], // node 5
      [400, 200], // node 6
      [200, 200], // node 7
    ];

    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    // Define flows [startIndex, endIndex, startConnection, endConnection]
    const flowPaths = [
      [0, 1, "right", "left"],
      [1, 2, "right", "left"],
      [2, 3, "right", "left"],
      [3, 4, "top", "bottom"],
      [4, 5, "left", "right"],
      [5, 6, "left", "right"],
      [6, 7, "left", "right"],
      [7, 0, "bottom", "top"],
    ];

    // Create flows using direct index reference
    flowPaths.forEach(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    for (
      let startFrame = 0;
      startFrame < totalFrames;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[0], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval;
      startFrame < totalFrames;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[4], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval * 2;
      startFrame < totalFrames;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[6], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);

      this.animation.animate(nodes[2], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval * 3;
      startFrame < totalFrames;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[1], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);

      this.animation.animate(nodes[3], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);

      this.animation.animate(nodes[5], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);

      this.animation.animate(nodes[7], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    this.animation.reset();
    this.animation.play(true);
  }

  allToOneRecursiveDoubling() {
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
    };

    const duration = 20;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const totalFrames = duration * fps; // Get total frames = duration × fps
    const pulseInterval = fps / 1.5; // 60 frames for one pulse cycle (steelBlue → goldenRod → steelBlue)
    const interval = 240;

    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and optional custom colors
    const nodeGrid = [
      [200, 400, colors.goldenRod], // node 0 (highlighted)
      [400, 400], // node 1
      [600, 400], // node 2
      [800, 400], // node 3
      [800, 200], // node 4
      [600, 200], // node 5
      [400, 200], // node 6
      [200, 200], // node 7
    ];

    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    // Define flows [startIndex, endIndex, startConnection, endConnection]
    const flowPaths = [
      [0, 1, "right", "left"],
      [1, 2, "right", "left"],
      [2, 3, "right", "left"],
      [3, 4, "top", "bottom"],
      [4, 5, "left", "right"],
      [5, 6, "left", "right"],
      [6, 7, "left", "right"],
      [7, 0, "bottom", "top"],
    ];

    // Create flows using direct index reference
    flowPaths.forEach(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    for (
      let startFrame = 0;
      startFrame < interval;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [
          nodes[0],
          nodes[1],
          nodes[2],
          nodes[3],
          nodes[4],
          nodes[5],
          nodes[6],
          nodes[7],
        ],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval;
      startFrame < interval * 2;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[0], nodes[2], nodes[4], nodes[6]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 2;
      startFrame < interval * 3;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[0], nodes[4]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 3;
      startFrame < interval * 4;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[0]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    this.animation.reset();
    this.animation.play(true);
  }

  matrixMultiplication() {
    const duration = 10;
    const fps = 60;
    const totalFPS = duration * fps;
    const height = 1000;
    const width = 1900;
    const interval = 2 * fps;

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
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and names
    const nodeGrid = [
      // [x, y, name, highlightColor?]
      [400, 300, "P1"], // Highlighted node
      [400, 400, "P2"],
      [400, 500, "P3"],
      [400, 600, "P4"],
      [500, 300, "P5"],
      [500, 400, "P6"],
      [500, 500, "P7"],
      [500, 600, "P8"],
      [600, 300, "P9"],
      [600, 400, "P10"],
      [600, 500, "P11"],
      [600, 600, "P12"],
      [700, 300, "P13"],
      [700, 400, "P14"],
      [700, 500, "P15"],
      [700, 600, "P16"],

      [200, 300, "OV1"],
      [200, 400, "OV2"],
      [200, 500, "OV3"],
      [200, 600, "OV4"],

      [400, 100, "IV1"],
      [500, 100, "IV2"],
      [600, 100, "IV3"],
      [700, 100, "IV4"],

      [400, 100, "1", colors.goldenRod],
      [500, 100, "2", colors.goldenRod],
      [600, 100, "3", colors.goldenRod],
      [700, 100, "4", colors.goldenRod],

      [400, 100, "1", colors.goldenRod],
      [500, 100, "2", colors.goldenRod],
      [600, 100, "3", colors.goldenRod],
      [700, 100, "4", colors.goldenRod],

      [400, 100, "1", colors.goldenRod],
      [500, 100, "2", colors.goldenRod],
      [600, 100, "3", colors.goldenRod],
      [700, 100, "4", colors.goldenRod],

      [400, 100, "1", colors.goldenRod],
      [500, 100, "2", colors.goldenRod],
      [600, 100, "3", colors.goldenRod],
      [700, 100, "4", colors.goldenRod],
    ];

    // Create all nodes and keep reference by name
    const nodes = nodeGrid.map(([x, y, name, customFill]) =>
      this.animation.createShape("rectangle", {
        x,
        y,
        height: 100,
        width: 100,
        fill: customFill || colors.steelBlue,
        name,
      })
    );

    this.animation.animateGroupMultiple(
      [nodes[24], nodes[25], nodes[26], nodes[27]],
      {
        y: [
          {
            frame: 0,
            value: nodes[20].y,
          },
          {
            frame: interval,
            value: nodes[15].y,
          },
        ],
      },
      10
    );

    this.animation.animateGroupMultiple(
      [nodes[28], nodes[29], nodes[30], nodes[31]],
      {
        y: [
          {
            frame: 0,
            value: nodes[20].y,
          },
          {
            frame: interval,
            value: nodes[14].y,
          },
        ],
      },
      10
    );

    this.animation.animateGroupMultiple(
      [nodes[32], nodes[33], nodes[34], nodes[35]],
      {
        y: [
          {
            frame: 0,
            value: nodes[20].y,
          },
          {
            frame: interval,
            value: nodes[13].y,
          },
        ],
      },
      10
    );

    this.animation.animateGroupMultiple(
      [nodes[36], nodes[37], nodes[38], nodes[39]],
      {
        y: [
          {
            frame: 0,
            value: nodes[20].y,
          },
          {
            frame: interval,
            value: nodes[12].y,
          },
        ],
      },
      10
    );

    const data = nodes.slice(24, 40);

    this.animation.animateGroup(
      data,
      "fill",
      [
        {
          frame: interval,
          value: data[0].fill,
        },
        {
          frame: interval * 2,
          value: colors.limeGreen,
        },
      ],
      0
    );

    for (let i = 24; i < 28; i++) {
      this.animation.animate(nodes[i], "x", [
        {
          frame: interval * 3,
          value: nodes[i].x,
        },
        {
          frame: interval * 4,
          value: nodes[16].x,
        },
      ]);
    }

    for (let i = 28; i < 32; i++) {
      this.animation.animate(nodes[i], "x", [
        {
          frame: interval * 3,
          value: nodes[i].x,
        },
        {
          frame: interval * 4,
          value: nodes[17].x,
        },
      ]);
    }

    for (let i = 32; i < 36; i++) {
      this.animation.animate(nodes[i], "x", [
        {
          frame: interval * 3,
          value: nodes[i].x,
        },
        {
          frame: interval * 4,
          value: nodes[18].x,
        },
      ]);
    }

    for (let i = 36; i < 40; i++) {
      this.animation.animate(nodes[i], "x", [
        {
          frame: interval * 3,
          value: nodes[i].x,
        },
        {
          frame: interval * 4,
          value: nodes[19].x,
        },
      ]);
    }

    this.animation.reset();
    this.animation.play(true);
  }

  meshBroadCastOneToAll() {
    const duration = 10;
    const fps = 60;
    const totalFPS = duration * fps;
    const height = 1000;
    const width = 1900;
    const interval = 2 * fps;
    const pulseInterval = 60;

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
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and optional custom colors
    const nodeGrid = [
      [100, 700], // 0
      [100, 500], // 1
      [100, 300], // 2
      [100, 100], // 3
      [300, 700], // 4
      [300, 500], // 5
      [300, 300], // 6
      [300, 100], // 7
      [500, 700], // 8
      [500, 500], // 9
      [500, 300], // 10
      [500, 100], // 11
      [700, 700], // 12
      [700, 500], // 13
      [700, 300], // 14
      [700, 100], // 15
    ];

    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 100,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    // Define flows **by index**, not name
    const flowPaths = [
      // [startIndex, endIndex, startConnection, endConnection]
      [0, 4, "right", "left"],
      [4, 8, "right", "left"],
      [8, 12, "right", "left"],

      [1, 5, "right", "left"],
      [5, 9, "right", "left"],
      [9, 13, "right", "left"],

      [2, 6, "right", "left"],
      [6, 10, "right", "left"],
      [10, 14, "right", "left"],

      [3, 7, "right", "left"],
      [7, 11, "right", "left"],
      [11, 15, "right", "left"],

      [0, 1, "top", "bottom"],
      [1, 2, "top", "bottom"],
      [2, 3, "top", "bottom"],
      [4, 5, "top", "bottom"],
      [5, 6, "top", "bottom"],
      [6, 7, "top", "bottom"],
      [8, 9, "top", "bottom"],
      [9, 10, "top", "bottom"],
      [10, 11, "top", "bottom"],
      [12, 13, "top", "bottom"],
      [13, 14, "top", "bottom"],
      [14, 15, "top", "bottom"],
    ];

    // Create flows using direct index reference
    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    for (
      let startFrame = 0;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[0], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[8], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval * 2;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[4], nodes[12]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 3;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[2], nodes[6], nodes[10], nodes[14]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 4;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [
          nodes[1],
          nodes[5],
          nodes[9],
          nodes[13],
          nodes[3],
          nodes[7],
          nodes[11],
          nodes[15],
        ],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    this.animation.reset();
    this.animation.play(true);
  }

  hyperCubeBroadcastOneToAll() {
    const duration = 10;
    const fps = 60;
    const totalFPS = duration * fps;
    const height = 1000;
    const width = 1900;
    const interval = 2 * fps;
    const pulseInterval = 60;

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
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and names
    const nodeGrid = [
      // [x, y, name, highlightColor?]
      [100, 700, "node 0"], // Highlighted node
      [500, 700, "node 1"],
      [100, 300, "node 2"],
      [500, 300, "node 3"],
      [300, 500, "node 4"],
      [700, 500, "node 5"],
      [300, 100, "node 6"],
      [700, 100, "node 7"],
    ];

    // Create all nodes and keep reference by name

    const nodes = nodeGrid.map(([x, y, name, customFill]) => {
      return this.animation.createShape("circle", {
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
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    const flowPaths = [
      // [startNode, endNode, startConnection, endConnection]

      [0, 2, "center", "center"],
      [0, 4, "center", "center"],
      [0, 1, "center", "center"],

      [1, 3, "center", "center"],
      [1, 5, "center", "center"],

      [2, 6, "center", "center"],
      [2, 3, "center", "center"],
      [2, 3, "center", "center"],
      [3, 7, "center", "center"],

      [5, 7, "center", "center"],
      [5, 4, "center", "center"],

      [6, 4, "center", "center"],
      [6, 7, "center", "center"],
    ];

    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    for (
      let startFrame = 0;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[0], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[4], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval * 2;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[4], nodes[12]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 3;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[2], nodes[6]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 4;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[1], nodes[3], nodes[5], nodes[7]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }
  }

  binaryTreeBroadcast() {
    const duration = 10;
    const fps = 60;
    const totalFPS = duration * fps;
    const height = 1000;
    const width = 1400;
    const interval = 2 * fps;
    const pulseInterval = 60;

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
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(1900, height);

    // Node coordinates and names
    const nodeGrid = [
      [width / 2, 80, "node 0"], // Root

      [width / 4, 200, "node 1"], // Level 1 - Left
      [(3 * width) / 4, 200, "node 2"], // Level 1 - Right

      [width / 8, 350, "node 3"], // Level 2 - Left-Left
      [width / 4 + width / 8, 350, "node 4"], // Level 2 - Left-Right
      [(3 * width) / 4 - width / 8, 350, "node 5"], // Level 2 - Right-Left
      [(7 * width) / 8, 350, "node 6"], // Level 2 - Right-Right

      [width / 16, 500, "node 7"], // Level 3 (optional deeper level)
      [width / 8 + width / 16, 500, "node 8"],
      [width / 4 + width / 16, 500, "node 9"],
      [width / 2 - width / 16, 500, "node 10"],
      [width / 2 + width / 16, 500, "node 11"],
      [(3 * width) / 4 - width / 16, 500, "node 12"],
      [(7 * width) / 8 - width / 16, 500, "node 13"],
      [(15 * width) / 16, 500, "node 14"],
    ];

    // Create all nodes and keep reference by name

    const nodes = nodeGrid.map(([x, y, name, customFill]) => {
      return this.animation.createShape("circle", {
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
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    const flowPaths = [
      [0, 1, "left", "top"],
      [0, 2, "right", "top"],

      [1, 3, "left", "top"],
      [1, 4, "right", "top"],

      [2, 5, "left", "top"],
      [2, 6, "right", "top"],

      [3, 7, "left", "top"],
      [3, 8, "right", "top"],

      [4, 9, "left", "top"],
      [4, 10, "right", "top"],

      [5, 11, "left", "top"],
      [5, 12, "right", "top"],

      [6, 13, "left", "top"],
      [6, 14, "right", "top"],
    ];

    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    for (
      let startFrame = 0;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animate(nodes[0], "fill", [
        { frame: startFrame, value: colors.steelBlue },
        { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
        { frame: startFrame + pulseInterval, value: colors.steelBlue },
      ]);
    }

    for (
      let startFrame = interval * 2;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[1], nodes[2]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 3;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [nodes[3], nodes[4], nodes[5], nodes[6]],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }

    for (
      let startFrame = interval * 4;
      startFrame < totalFPS;
      startFrame += pulseInterval
    ) {
      this.animation.animateGroup(
        [
          nodes[7],
          nodes[8],
          nodes[9],
          nodes[10],
          nodes[11],
          nodes[12],
          nodes[13],
          nodes[14],
        ],
        "fill",
        [
          { frame: startFrame, value: colors.steelBlue },
          { frame: startFrame + pulseInterval / 2, value: colors.limeGreen },
          { frame: startFrame + pulseInterval, value: colors.steelBlue },
        ],
        0
      );
    }
  }

  allToAllBroadcastRing() {
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
    };

    const duration = 20;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const totalFrames = duration * fps; // Get total frames = duration × fps
    const pulseInterval = fps / 1.5; // 60 frames for one pulse cycle (steelBlue → goldenRod → steelBlue)
    const interval = 120;

    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Node coordinates and optional custom colors
    const nodeGrid = [
      [100, 600], // node 0 (highlighted)
      [500, 600], // node 1
      [900, 600], // node 2
      [1300, 600], // node 3
      [1300, 200], // node 4
      [900, 200], // node 5
      [500, 200], // node 6
      [100, 200], // node 7
    ];

    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });

    const data = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: customFill || colors.goldenRod,
        name: `data ${index}`,
        cornerRadius: 10,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 3,
      flowParticles: 8,
      particleSize: 3,
      fill: colors.steelBlue,
      animationSpeed: 1,
      lineStyle: "dashed",
    };

    // Define flows [startIndex, endIndex, startConnection, endConnection]
    const flowPaths = [
      [0, 1, "right", "left"],
      [1, 2, "right", "left"],
      [2, 3, "right", "left"],
      [3, 4, "top", "bottom"],
      [4, 5, "left", "right"],
      [5, 6, "left", "right"],
      [6, 7, "left", "right"],
      [7, 0, "bottom", "top"],
    ];

    // Create flows using direct index reference
    flowPaths.forEach(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    // this.animation.animateMultiple(data[0],{
    //   x : [
    //     {
    //       frame : 0,
    //       value : nodes[0].x + 50
    //     },
    //     {
    //       frame : interval,
    //       value : nodes[1].x + 50
    //     },
    //     {
    //       frame : interval * 2,
    //       value : nodes[2].x + 50
    //     },
    //     {
    //       frame : interval * 3,
    //       value : nodes[3].x + 50
    //     },
    //     {
    //       frame : interval * 4,
    //       value : nodes[4].x + 50
    //     },
    //     {
    //       frame : interval * 5,
    //       value : nodes[5].x + 50
    //     },
    //     {
    //       frame : interval * 6,
    //       value : nodes[6].x + 50
    //     },
    //     {
    //       frame : interval * 7,
    //       value : nodes[7].x + 50
    //     },
    //     {
    //       frame : interval * 8,
    //       value : nodes[0].x + 50
    //     }
    //   ],
    //   y : [
    //     {
    //       frame : 0,
    //       value : nodes[0].y + 50
    //     },
    //     {
    //       frame : interval,
    //       value : nodes[1].y + 50
    //     },
    //     {
    //       frame : interval * 2,
    //       value : nodes[2].y + 50
    //     },
    //     {
    //       frame : interval * 3,
    //       value : nodes[3].y + 50
    //     },
    //     {
    //       frame : interval * 4,
    //       value : nodes[4].y + 50
    //     },
    //     {
    //       frame : interval * 5,
    //       value : nodes[5].y + 50
    //     },
    //     {
    //       frame : interval * 6,
    //       value : nodes[6].y + 50
    //     },
    //     {
    //       frame : interval * 7,
    //       value : nodes[7].y + 50
    //     },
    //     {
    //       frame : interval * 8,
    //       value : nodes[0].y + 50
    //     }
    //   ]
    // });

    // Animation logic with accumulating journey text
    const numNodes = nodes.length;

    data.forEach((dataItem, i) => {
      const xKeyframes = [];
      const yKeyframes = [];
      const textKeyframes = [];

      // Initial position and text (starting at its own node)
      xKeyframes.push({ frame: 0, value: nodes[i].x + 50 });
      yKeyframes.push({ frame: 0, value: nodes[i].y + 50 });
      textKeyframes.push({ frame: 0, value: `${i}` }); // Start with just the data number

      // Keep track of the journey text as it accumulates
      let journeyText = `${i}`;

      // Generate keyframes for data[i] to traverse the entire ring
      for (let step = 0; step < numNodes; step++) {
        // The target node for this step
        const targetNodeIndex = (i + step + 1) % numNodes;

        xKeyframes.push({
          frame: (step + 1) * interval,
          value: nodes[targetNodeIndex].x + 50,
        });

        yKeyframes.push({
          frame: (step + 1) * interval,
          value: nodes[targetNodeIndex].y + 50,
        });

        // Append the next node to the journey text
        journeyText += `,${targetNodeIndex}`;

        textKeyframes.push({
          frame: (step + 1) * interval,
          value: journeyText,
        });
      }

      this.animation.animateMultiple(dataItem, {
        x: xKeyframes,
        y: yKeyframes,
        text: textKeyframes,
      });
    });
  }

  allToAllBroadcastMesh() {
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
  
    const duration = 20;
    const fps = 60;
    const interval = 60; // Frames between movement steps
    
    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(1900, 1000);
  
    // Node coordinates arranged in the requested grid:
    // 6 7 8
    // 3 4 5
    // 0 1 2
    const nodeGrid = [
      [300, 700], // 0
      [600, 700], // 1
      [900, 700], // 2
      [300, 400], // 3
      [600, 400], // 4
      [900, 400], // 5
      [300, 100], // 6
      [600, 100], // 7
      [900, 100], // 8
    ];
  
    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 100,
        fill: colors.steelBlue,
        name: `node ${index}`,
        text: `${index}`,
        fontSize: 24,
        textColor: [255, 255, 255]
      });
    });
    
    // Create data packets, one associated with each node initially
    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x,
        y: y + 20, // Position slightly below center of node
        height: 40,
        width: 100,
        fill: colors.coral,
        name: `data ${index}`,
        cornerRadius: 10,
        text: `${index}`,
        fontSize: 18,
        textColor: [0, 0, 0]
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
  
    // Define flows by index - connections between adjacent nodes
    const flowPaths = [
      // Horizontal connections
      [0, 1, "right", "left"],
      [1, 2, "right", "left"],
      [3, 4, "right", "left"],
      [4, 5, "right", "left"],
      [6, 7, "right", "left"],
      [7, 8, "right", "left"],
      
      // Vertical connections
      [0, 3, "top", "bottom"],
      [3, 6, "top", "bottom"],
      [1, 4, "top", "bottom"],
      [4, 7, "top", "bottom"],
      [2, 5, "top", "bottom"],
      [5, 8, "top", "bottom"],
    ];
  
    // Create flows using direct index reference
    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      return this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });
  
    // For each data packet, create animation to visit all other nodes
    data.forEach((dataItem, sourceIndex) => {
      const xKeyframes = [];
      const yKeyframes = [];
      const textKeyframes = [];
      
      // Start at the original position
      xKeyframes.push({ frame: 0, value: nodes[sourceIndex].x });
      yKeyframes.push({ frame: 0, value: nodes[sourceIndex].y + 20 });
      textKeyframes.push({ frame: 0, value: `${sourceIndex}` });
      
      let journeyText = `${sourceIndex}`;
      let frameOffset = 0;
      
      // Create a visit sequence to all other nodes
      const visitsInOrder = [];
      
      // Add all node indices except the source
      for (let i = 0; i < nodes.length; i++) {
        if (i !== sourceIndex) {
          visitsInOrder.push(i);
        }
      }
      
      // Visit each node in the grid
      for (let i = 0; i < visitsInOrder.length; i++) {
        const targetNodeIndex = visitsInOrder[i];
        frameOffset += interval;
        
        // Add animation keyframes
        xKeyframes.push({ 
          frame: frameOffset, 
          value: nodes[targetNodeIndex].x 
        });
        
        yKeyframes.push({ 
          frame: frameOffset, 
          value: nodes[targetNodeIndex].y + 20 
        });
        
        // Update journey text
        journeyText += `,${targetNodeIndex}`;
        textKeyframes.push({ 
          frame: frameOffset, 
          value: journeyText 
        });
      }
      
      // Return to the original node
      frameOffset += interval;
      xKeyframes.push({ 
        frame: frameOffset, 
        value: nodes[sourceIndex].x + 50
      });
      
      yKeyframes.push({ 
        frame: frameOffset, 
        value: nodes[sourceIndex].y + 50 
      });
      
      journeyText += `,${sourceIndex}`;
      textKeyframes.push({ 
        frame: frameOffset, 
        value: journeyText 
      });
      
      // Apply animation
      this.animation.animateMultiple(dataItem, {
        x: xKeyframes,
        y: yKeyframes,
        text: textKeyframes
      });
    });
  
    this.animation.reset();
    this.animation.play(true);
  }
}

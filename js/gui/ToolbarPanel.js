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
      hyperCubeBroadcastAllToAll: () => this.hyperCubeBroadcastAllToAll(),
      hypercubePrefixSum: () => this.hypercubePrefixSum(),
      hyperCubeScatter: () => this.hyperCubeScatter(),
      matrixTransposePersonalized: () => this.matrixTransposePersonalized(),
      personalizedAllToAllCommunicationRing: () =>
        this.personalizedAllToAllCommunicationRing(),
      personalizedAllToAllHyperCube: () => this.personalizedAllToAllHyperCube(),
      personalizedAllToAllMesh: () => this.personalizedAllToAllMesh(0),
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
    this.templatesFolder
      .add(templates, "hyperCubeBroadcastAllToAll")
      .name("HyperCube All to All Broadcast");
    this.templatesFolder
      .add(templates, "hypercubePrefixSum")
      .name("HyperCube Prefix Sum");
    this.templatesFolder
      .add(templates, "hyperCubeScatter")
      .name("HyperCube Scatter Operation");
    this.templatesFolder
      .add(templates, "matrixTransposePersonalized")
      .name("Matrix Transpose Personalized");
    this.templatesFolder
      .add(templates, "personalizedAllToAllCommunicationRing")
      .name("Ring All to All Personalized");

    this.templatesFolder
      .add(templates, "personalizedAllToAllHyperCube")
      .name("HyperCube All to All Personalized");

    this.templatesFolder
      .add(templates, "personalizedAllToAllMesh")
      .name("Mesh All to All Personalized");

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

  // allToAllBroadcastMesh() {
  //   const colors = {
  //     skyBlue: [135, 206, 235],
  //     coral: [255, 127, 80],
  //     limeGreen: [50, 205, 50],
  //     goldenRod: [218, 165, 32],
  //     orchid: [218, 112, 214],
  //     slateGray: [112, 128, 144],
  //     tomato: [255, 99, 71],
  //     steelBlue: [70, 130, 180],
  //     mediumPurple: [147, 112, 219],
  //     seaGreen: [46, 139, 87],
  //     deepPink: [255, 20, 147],
  //     turquoise: [64, 224, 208],
  //     fireBrick: [178, 34, 34],
  //     darkOrange: [255, 140, 0],
  //     lightSlateGray: [119, 136, 153],
  //   };

  //   const duration = 20;
  //   const fps = 60;
  //   const interval = 60; // Frames between movement steps

  //   this.animation.clearAll();
  //   this.animation.setDuration(duration);
  //   this.animation.setFPS(fps);
  //   this.engine.setCanvasSize(1900, 1000);

  //   // Node coordinates arranged in the requested grid:
  //   // 6 7 8
  //   // 3 4 5
  //   // 0 1 2
  //   const nodeGrid = [
  //     [300, 700], // 0
  //     [600, 700], // 1
  //     [900, 700], // 2
  //     [300, 400], // 3
  //     [600, 400], // 4
  //     [900, 400], // 5
  //     [300, 100], // 6
  //     [600, 100], // 7
  //     [900, 100], // 8
  //   ];

  //   // Create all nodes and store them as an array of shapes
  //   const nodes = nodeGrid.map(([x, y], index) => {
  //     return this.animation.createShape("circle", {
  //       x,
  //       y,
  //       size: 100,
  //       fill: colors.steelBlue,
  //       name: `node ${index}`,
  //       text: `${index}`,
  //       fontSize: 24,
  //       textColor: [255, 255, 255]
  //     });
  //   });

  //   // Create data packets, one associated with each node initially
  //   const data = nodeGrid.map(([x, y], index) => {
  //     return this.animation.createShape("rectangle", {
  //       x: x,
  //       y: y + 20, // Position slightly below center of node
  //       height: 40,
  //       width: 100,
  //       fill: colors.coral,
  //       name: `data ${index}`,
  //       cornerRadius: 10,
  //       text: `${index}`,
  //       fontSize: 18,
  //       textColor: [0, 0, 0]
  //     });
  //   });

  //   const flowDefaults = {
  //     pathStyle: "bezier",
  //     curveIntensity: 0,
  //     arrowEnd: false,
  //     arrowSize: 8,
  //     stroke: colors.steelBlue,
  //     strokeWeight: 2,
  //     flowParticles: 8,
  //     particleSize: 6,
  //     fill: colors.steelBlue,
  //     animationSpeed: 2,
  //   };

  //   // Define flows by index - connections between adjacent nodes
  //   const flowPaths = [
  //     // Horizontal connections
  //     [0, 1, "right", "left"],
  //     [1, 2, "right", "left"],
  //     [3, 4, "right", "left"],
  //     [4, 5, "right", "left"],
  //     [6, 7, "right", "left"],
  //     [7, 8, "right", "left"],

  //     // Vertical connections
  //     [0, 3, "top", "bottom"],
  //     [3, 6, "top", "bottom"],
  //     [1, 4, "top", "bottom"],
  //     [4, 7, "top", "bottom"],
  //     [2, 5, "top", "bottom"],
  //     [5, 8, "top", "bottom"],
  //   ];

  //   // Create flows using direct index reference
  //   const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
  //     return this.animation.createShape("flowpath", {
  //       ...flowDefaults,
  //       startShape: nodes[startIdx],
  //       endShape: nodes[endIdx],
  //       startConnection: startConn,
  //       endConnection: endConn,
  //     });
  //   });

  //   // For each data packet, create animation to visit all other nodes
  //   data.forEach((dataItem, sourceIndex) => {
  //     const xKeyframes = [];
  //     const yKeyframes = [];
  //     const textKeyframes = [];

  //     // Start at the original position
  //     xKeyframes.push({ frame: 0, value: nodes[sourceIndex].x });
  //     yKeyframes.push({ frame: 0, value: nodes[sourceIndex].y + 20 });
  //     textKeyframes.push({ frame: 0, value: `${sourceIndex}` });

  //     let journeyText = `${sourceIndex}`;
  //     let frameOffset = 0;

  //     // Create a visit sequence to all other nodes
  //     const visitsInOrder = [];

  //     // Add all node indices except the source
  //     for (let i = 0; i < nodes.length; i++) {
  //       if (i !== sourceIndex) {
  //         visitsInOrder.push(i);
  //       }
  //     }

  //     // Visit each node in the grid
  //     for (let i = 0; i < visitsInOrder.length; i++) {
  //       const targetNodeIndex = visitsInOrder[i];
  //       frameOffset += interval;

  //       // Add animation keyframes
  //       xKeyframes.push({
  //         frame: frameOffset,
  //         value: nodes[targetNodeIndex].x
  //       });

  //       yKeyframes.push({
  //         frame: frameOffset,
  //         value: nodes[targetNodeIndex].y + 20
  //       });

  //       // Update journey text
  //       journeyText += `,${targetNodeIndex}`;
  //       textKeyframes.push({
  //         frame: frameOffset,
  //         value: journeyText
  //       });
  //     }

  //     // Return to the original node
  //     frameOffset += interval;
  //     xKeyframes.push({
  //       frame: frameOffset,
  //       value: nodes[sourceIndex].x + 50
  //     });

  //     yKeyframes.push({
  //       frame: frameOffset,
  //       value: nodes[sourceIndex].y + 50
  //     });

  //     journeyText += `,${sourceIndex}`;
  //     textKeyframes.push({
  //       frame: frameOffset,
  //       value: journeyText
  //     });

  //     // Apply animation
  //     this.animation.animateMultiple(dataItem, {
  //       x: xKeyframes,
  //       y: yKeyframes,
  //       text: textKeyframes
  //     });
  //   });

  //   this.animation.reset();
  //   this.animation.play(true);
  // }

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
        textColor: [255, 255, 255],
      });
    });

    // Create data packets, one associated with each node initially
    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x,
        y: y + 20, // Position slightly below center of node
        height: 40,
        width: 100,
        fill: colors.goldenRod,
        name: `data ${index}`,
        cornerRadius: 10,
        text: `${index}`,
        fontSize: 18,
        textColor: [0, 0, 0],
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

    // Define rows and columns
    const rows = [
      [0, 1, 2], // Bottom row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Top row
    ];

    const columns = [
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
    ];

    // For each data packet, create animation for the two-phase broadcast
    data.forEach((dataItem, sourceIndex) => {
      const xKeyframes = [];
      const yKeyframes = [];
      const textKeyframes = [];

      // Start at the original position
      xKeyframes.push({ frame: 0, value: nodes[sourceIndex].x });
      yKeyframes.push({ frame: 0, value: nodes[sourceIndex].y + 20 });
      textKeyframes.push({ frame: 0, value: `${sourceIndex}` });

      let frameOffset = 0;

      // Find which row and column this node belongs to
      const sourceRow = Math.floor(sourceIndex / 3);
      const sourceCol = sourceIndex % 3;

      // Phase 1: Row-wise broadcast
      // Determine data that will be collected in this row
      const rowData = new Set(rows[sourceRow]);
      const rowDataText = Array.from(rowData)
        .sort((a, b) => a - b)
        .join(",");

      // Visit each node in the same row (except self)
      for (const targetIndex of rows[sourceRow]) {
        if (targetIndex !== sourceIndex) {
          frameOffset += interval;

          // Add animation keyframes
          xKeyframes.push({
            frame: frameOffset,
            value: nodes[targetIndex].x,
          });

          yKeyframes.push({
            frame: frameOffset,
            value: nodes[targetIndex].y + 20,
          });

          // All nodes in this row now have the same data
          textKeyframes.push({
            frame: frameOffset,
            value: rowDataText,
          });
        }
      }

      // Return to source node position after row broadcast
      frameOffset += interval;
      xKeyframes.push({
        frame: frameOffset,
        value: nodes[sourceIndex].x,
      });

      yKeyframes.push({
        frame: frameOffset,
        value: nodes[sourceIndex].y + 20,
      });

      textKeyframes.push({
        frame: frameOffset,
        value: rowDataText,
      });

      // Phase 2: Column-wise broadcast
      // Collect all data from all rows in this column
      const colData = new Set();
      for (const rowIdx of [0, 1, 2]) {
        for (const nodeIdx of rows[rowIdx]) {
          colData.add(nodeIdx);
        }
      }
      const allDataText = Array.from(colData)
        .sort((a, b) => a - b)
        .join(",");

      // Visit each node in the same column (except self)
      for (const targetIndex of columns[sourceCol]) {
        if (targetIndex !== sourceIndex) {
          frameOffset += interval;

          // Add animation keyframes
          xKeyframes.push({
            frame: frameOffset,
            value: nodes[targetIndex].x,
          });

          yKeyframes.push({
            frame: frameOffset,
            value: nodes[targetIndex].y + 20,
          });

          // All nodes now have all data
          textKeyframes.push({
            frame: frameOffset,
            value: allDataText,
          });
        }
      }

      // Final position slightly offset from the source node
      frameOffset += interval;
      xKeyframes.push({
        frame: frameOffset,
        value: nodes[sourceIndex].x + 50,
      });

      yKeyframes.push({
        frame: frameOffset,
        value: nodes[sourceIndex].y + 50,
      });

      textKeyframes.push({
        frame: frameOffset,
        value: allDataText,
      });

      // Apply animation
      this.animation.animateMultiple(dataItem, {
        x: xKeyframes,
        y: yKeyframes,
        text: textKeyframes,
      });
    });

    this.animation.reset();
    this.animation.play(true);
  }

  hyperCubeBroadcastAllToAll() {
    const duration = 20;
    const fps = 60;
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

    const nodeGrid = [
      [100, 700, "node 0"],
      [500, 700, "node 1"],
      [100, 300, "node 2"],
      [500, 300, "node 3"],
      [300, 500, "node 4"],
      [700, 500, "node 5"],
      [300, 100, "node 6"],
      [700, 100, "node 7"],
    ];

    const nodes = nodeGrid.map(([x, y, name]) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: colors.steelBlue,
        name,
      });
    });

    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
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

    const flowPaths = [
      [0, 2],
      [0, 4],
      [0, 1],
      [1, 3],
      [1, 5],
      [2, 6],
      [2, 3],
      [3, 7],
      [5, 7],
      [5, 4],
      [6, 4],
      [6, 7],
    ];

    flowPaths.forEach(([startIdx, endIdx]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: "center",
        endConnection: "center",
      });
    });

    const numNodes = nodes.length;
    const dimensions = 3; // 3D hypercube

    // Initialize: result[i] = {i}
    const results = Array.from({ length: numNodes }, (_, i) => new Set([i]));

    const broadcastSteps = []; // Store [sender, receiver, newDataSet] for each communication

    // For i = 0 to d-1 (dimension loop)
    for (let dim = 0; dim < dimensions; dim++) {
      const exchanges = [];

      // Each node computes partner = id XOR 2^dim
      for (let nodeId = 0; nodeId < numNodes; nodeId++) {
        const partnerId = nodeId ^ (1 << dim);

        // Ensure only one pair (avoid double-counting reverse pairs)
        if (nodeId < partnerId) {
          exchanges.push([nodeId, partnerId]);
        }
      }

      exchanges.forEach(([a, b]) => {
        // Each sends their current result to the other
        const union = new Set([...results[a], ...results[b]]);
        results[a] = new Set(union);
        results[b] = new Set(union);

        broadcastSteps.push({
          step: dim,
          sender: a,
          receiver: b,
          newSet: new Set(union),
        });
      });
    }

    // Now animate each data block accordingly
    data.forEach((dataItem, i) => {
      const xKeyframes = [];
      const yKeyframes = [];
      const textKeyframes = [];

      xKeyframes.push({ frame: 0, value: nodes[i].x + 50 });
      yKeyframes.push({ frame: 0, value: nodes[i].y + 50 });
      textKeyframes.push({ frame: 0, value: `${i}` });

      let currentNode = i;
      let currentSet = new Set([i]);

      broadcastSteps.forEach(({ step, sender, receiver, newSet }) => {
        const frameTime = (step + 1) * interval;

        // If currentNode is involved in this step
        if (currentNode === sender || currentNode === receiver) {
          const partner = currentNode === sender ? receiver : sender;

          // Move towards partner visually (optional, cycle visually)
          xKeyframes.push({
            frame: frameTime,
            value: nodes[partner].x + 50,
          });
          yKeyframes.push({
            frame: frameTime,
            value: nodes[partner].y + 50,
          });

          // Update data content
          const sortedSet = Array.from(newSet).sort((a, b) => a - b);
          textKeyframes.push({
            frame: frameTime,
            value: sortedSet.join(","),
          });

          currentSet = newSet;
          currentNode = partner;
        }
      });

      this.animation.animateMultiple(dataItem, {
        x: xKeyframes,
        y: yKeyframes,
        text: textKeyframes,
      });
    });
  }

  hypercubePrefixSum() {
    const duration = 20;
    const fps = 60;
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

    const nodeGrid = [
      [100, 700, "node 0"],
      [500, 700, "node 1"],
      [100, 300, "node 2"],
      [500, 300, "node 3"],
      [300, 500, "node 4"],
      [700, 500, "node 5"],
      [300, 100, "node 6"],
      [700, 100, "node 7"],
    ];

    const nodes = nodeGrid.map(([x, y, name], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: colors.steelBlue,
        name,
        text: `${index}`,
        fontSize: 24,
        textColor: [255, 255, 255],
      });
    });

    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
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

    const flowPaths = [
      [0, 2],
      [0, 4],
      [0, 1],
      [1, 3],
      [1, 5],
      [2, 6],
      [2, 3],
      [3, 7],
      [5, 7],
      [5, 4],
      [6, 4],
      [6, 7],
    ];

    flowPaths.forEach(([startIdx, endIdx]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: "center",
        endConnection: "center",
      });
    });

    const numNodes = nodes.length;
    const dimensions = 3; // 3D hypercube

    // Initialize according to the PREFIX SUMS HCUBE algorithm
    const nodeValues = Array.from({ length: numNodes }, (_, i) => i); // Each node's initial value is its ID
    const results = [...nodeValues]; // Step 3: result := my_number
    const messages = [...nodeValues]; // Step 4: msg := result

    // Record the communication steps
    const communicationSteps = [];

    // Step 5: for i := 0 to d-1 do
    for (let dim = 0; dim < dimensions; dim++) {
      const stepExchanges = [];

      // For each node in this dimension
      for (let nodeId = 0; nodeId < numNodes; nodeId++) {
        // Step 6: partner := my_id XOR 2^i
        const partnerId = nodeId ^ (1 << dim);

        // Ensure we record each exchange only once
        if (nodeId < partnerId) {
          stepExchanges.push([nodeId, partnerId]);
        }
      }

      // Process all exchanges in this dimension
      stepExchanges.forEach(([a, b]) => {
        // Step 7-8: Send msg to partner and receive from partner
        const msgA = messages[a];
        const msgB = messages[b];

        // Step 9: msg := msg + number
        messages[a] += msgB;
        messages[b] += msgA;

        // Step 10: if (partner < my_id) then result := result + number
        if (b < a) results[a] += msgB;
        if (a < b) results[b] += msgA;

        // Record both directions of communication for animation
        communicationSteps.push({
          step: dim,
          sender: a,
          receiver: b,
          msgSent: msgA,
          resultA: results[a],
          msgA: messages[a],
        });

        communicationSteps.push({
          step: dim,
          sender: b,
          receiver: a,
          msgSent: msgB,
          resultB: results[b],
          msgB: messages[b],
        });
      });
    }

    // Now animate each data block according to the algorithm
    data.forEach((dataItem, nodeId) => {
      const xKeyframes = [];
      const yKeyframes = [];
      const textKeyframes = [];

      // Initial position and value - show [result](msg)
      xKeyframes.push({ frame: 0, value: nodes[nodeId].x + 50 });
      yKeyframes.push({ frame: 0, value: nodes[nodeId].y + 50 });
      textKeyframes.push({ frame: 0, value: `[${nodeId}](${nodeId})` });

      let currentResult = nodeId;
      let currentMsg = nodeId;

      // Filter steps relevant to this node
      const relevantSteps = communicationSteps.filter(
        (step) => step.sender === nodeId || step.receiver === nodeId
      );

      // Process each step
      relevantSteps.forEach((step) => {
        const frameTime = (step.step + 1) * interval;
        const partner = step.sender === nodeId ? step.receiver : step.sender;

        // Move towards partner visually
        xKeyframes.push({
          frame: frameTime,
          value: nodes[partner].x + 50,
        });

        yKeyframes.push({
          frame: frameTime,
          value: nodes[partner].y + 50,
        });

        // Update the node's data display
        if (step.sender === nodeId) {
          // This node is sending
          if (step.hasOwnProperty("resultA")) {
            currentResult = step.resultA;
            currentMsg = step.msgA;
          }
        } else {
          // This node is receiving
          if (step.hasOwnProperty("resultB")) {
            currentResult = step.resultB;
            currentMsg = step.msgB;
          }
        }

        // Update text to show [result](msg)
        textKeyframes.push({
          frame: frameTime,
          value: `[${currentResult}](${currentMsg})`,
        });
      });

      // Return to original position
      const lastFrame = dimensions * interval + interval;
      xKeyframes.push({
        frame: lastFrame,
        value: nodes[nodeId].x + 50,
      });

      yKeyframes.push({
        frame: lastFrame,
        value: nodes[nodeId].y + 50,
      });

      textKeyframes.push({
        frame: lastFrame,
        value: `[${currentResult}](${currentMsg})`,
      });

      // Apply animation
      this.animation.animateMultiple(dataItem, {
        x: xKeyframes,
        y: yKeyframes,
        text: textKeyframes,
      });
    });

    this.animation.reset();
    this.animation.play(true);
  }

  hyperCubeScatter() {
    const duration = 20;
    const fps = 60;
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

    const nodeGrid = [
      [100, 700, "node 0"],
      [500, 700, "node 1"],
      [100, 300, "node 2"],
      [500, 300, "node 3"],
      [300, 500, "node 4"],
      [700, 500, "node 5"],
      [300, 100, "node 6"],
      [700, 100, "node 7"],
    ];

    const nodes = nodeGrid.map(([x, y, name]) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: colors.steelBlue,
        name,
      });
    });

    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
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

    const flowPaths = [
      [0, 2],
      [0, 4],
      [0, 1],
      [1, 3],
      [1, 5],
      [2, 6],
      [2, 3],
      [3, 7],
      [5, 7],
      [5, 4],
      [6, 4],
      [6, 7],
    ];

    flowPaths.forEach(([startIdx, endIdx]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: "center",
        endConnection: "center",
      });
    });

    this.animation.animateGroup(
      [data[0]],
      "text",
      [
        {
          frame: 0,
          value: "0,1,2,3,4,5,6,7",
        },
        {
          frame: interval,
          value: "0,1,2,3",
        },
        {
          frame: interval * 2,
          value: "0,1",
        },
        {
          frame: interval * 3,
          value: "1",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[4]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "4,5,6,7",
        },
        {
          frame: interval * 2,
          value: "4,5",
        },
        {
          frame: interval * 3,
          value: "4",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[2]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "2,3",
        },
        {
          frame: interval * 3,
          value: "2",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[6]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "6,7",
        },
        {
          frame: interval * 3,
          value: "6",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[3]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "",
        },
        {
          frame: interval * 3,
          value: "3",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[5]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "",
        },
        {
          frame: interval * 3,
          value: "5",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[1]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "",
        },
        {
          frame: interval * 3,
          value: "1",
        },
      ],
      0
    );

    this.animation.animateGroup(
      [data[7]],
      "text",
      [
        {
          frame: 0,
          value: "",
        },
        {
          frame: interval,
          value: "",
        },
        {
          frame: interval * 2,
          value: "",
        },
        {
          frame: interval * 3,
          value: "7",
        },
      ],
      0
    );
  }

  matrixTransposePersonalized() {
    const duration = 15;
    const fps = 60;
    const totalFPS = duration * fps;
    const height = 1000;
    const width = 1900;
    const interval = 2 * fps; // duration of each swap (in frames)
    const swapDelay = interval; // delay between swaps

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

    const nodeGrid = [
      [400, 300, "P00"],
      [400, 400, "P10"],
      [400, 500, "P20"],
      [400, 600, "P30"],
      [500, 300, "P01"],
      [500, 400, "P11"],
      [500, 500, "P21"],
      [500, 600, "P31"],
      [600, 300, "P02"],
      [600, 400, "P12"],
      [600, 500, "P22"],
      [600, 600, "P32"],
      [700, 300, "P03"],
      [700, 400, "P13"],
      [700, 500, "P23"],
      [700, 600, "P33"],
    ];

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

    // Swap pairs [indexA, indexB] for matrix transpose (upper triangle only)
    const swapPairs = [
      [1, 4], // P10 <-> P01
      [2, 8], // P20 <-> P02
      [6, 9], // P21 <-> P12
      [3, 12], // P30 <-> P03
      [7, 13], // P31 <-> P13
      [11, 14], // P32 <-> P23
    ];

    // Helper to animate one swap
    const swapNodes = (nodeA, nodeB, startFrame) => {
      const endFrame = startFrame + interval;
      this.animation.animateMultiple(nodeA, {
        x: [
          { frame: startFrame, value: nodeA.x },
          { frame: endFrame, value: nodeB.x },
        ],
        y: [
          { frame: startFrame, value: nodeA.y },
          { frame: endFrame, value: nodeB.y },
        ],
      });

      this.animation.animateMultiple(nodeB, {
        x: [
          { frame: startFrame, value: nodeB.x },
          { frame: endFrame, value: nodeA.x },
        ],
        y: [
          { frame: startFrame, value: nodeB.y },
          { frame: endFrame, value: nodeA.y },
        ],
      });
    };

    // Sequential swaps with incremental delays
    swapPairs.forEach(([indexA, indexB], i) => {
      const startFrame = i * swapDelay;
      swapNodes(nodes[indexA], nodes[indexB], startFrame);
    });

    // const animateSwap = (nodeA, nodeB) => {
    //   this.animation.animateMultiple(nodeA, {
    //     x: [
    //       { frame: 0, value: nodeA.x },
    //       { frame: interval, value: nodeB.x },
    //     ],
    //     y: [
    //       { frame: 0, value: nodeA.y },
    //       { frame: interval, value: nodeB.y },
    //     ],
    //   });

    //   this.animation.animateMultiple(nodeB, {
    //     x: [
    //       { frame: 0, value: nodeB.x },
    //       { frame: interval, value: nodeA.x },
    //     ],
    //     y: [
    //       { frame: 0, value: nodeB.y },
    //       { frame: interval, value: nodeA.y },
    //     ],
    //   });
    // };

    // swapPairs.forEach(([indexA, indexB]) => {
    //   animateSwap(nodes[indexA], nodes[indexB]);
    // });

    this.animation.reset();
    this.animation.play(true);
  }

  personalizedAllToAllCommunicationRing(sourceNodeOption = -1) {
    // Common constants and settings
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
      // Add colors for each node to differentiate them
      nodeColors: [
        [255, 99, 71], // Tomato (Node 0)
        [255, 165, 0], // Orange (Node 1)
        [154, 205, 50], // YellowGreen (Node 2)
        [0, 191, 255], // DeepSkyBlue (Node 3)
        [138, 43, 226], // BlueViolet (Node 4)
        [255, 20, 147], // DeepPink (Node 5)
      ],
    };

    const duration = 15;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const interval = 120;
    const nodeCount = 6;

    // Determine mode: all-to-all or one-to-all
    const isOneToAll = sourceNodeOption >= 0 && sourceNodeOption < nodeCount;

    // Set title based on mode
    const title = isOneToAll
      ? `Node ${sourceNodeOption} to All Communication`
      : "Simultaneous All-to-All Communication";

    // Initialize animation
    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Track frame-to-remove mapping for all nodes
    const removalFrames = {};

    // Helper function to schedule a node for removal at a specific frame
    const scheduleRemoval = (node, frame) => {
      if (!removalFrames[frame]) {
        removalFrames[frame] = [];
      }
      removalFrames[frame].push(node);
    };

    // Override the frame render method to check for node removal
    const originalRenderFrame = this.animation.engine.renderFrame;
    this.animation.engine.renderFrame = (frameNumber) => {
      // Call the original render method first
      originalRenderFrame.call(this.animation.engine, frameNumber);

      // Check if any nodes need to be removed at this frame
      if (removalFrames[frameNumber]) {
        removalFrames[frameNumber].forEach((node) => {
          this.engine.removeObject(node);
        });
        // Clear the list after processing
        delete removalFrames[frameNumber];
      }
    };

    // Node positions
    const nodeGrid = [
      [100, 600], // node 0
      [700, 600], // node 1
      [1300, 600], // node 2
      [1300, 200], // node 3
      [700, 200], // node 4
      [100, 200], // node 5
    ];

    // Flow connections between consecutive nodes
    const flowConnections = [
      ["right", "left"], // 0 -> 1
      ["right", "left"], // 1 -> 2
      ["top", "bottom"], // 2 -> 3
      ["left", "right"], // 3 -> 4
      ["left", "right"], // 4 -> 5
      ["bottom", "top"], // 5 -> 0
    ];

    // Create all nodes
    const nodes = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill:
          isOneToAll && index === sourceNodeOption
            ? colors.nodeColors[sourceNodeOption] // Highlight source node
            : colors.steelBlue,
        name: `node ${index}`,
      });
    });

    // Track collected messages for each node
    const collectedMessages = Array(nodeCount)
      .fill()
      .map(() => ({}));

    // Create data rectangles
    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
        name: ``,
        cornerRadius: 10,
      });
    });

    // Display mode as text
    const modeText = this.animation.createShape("text", {
      x: width / 2,
      y: 50,
      fill: colors.steelBlue,
      text: title,
      fontSize: 24,
    });

    // Create flow paths
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

    // Create flows between consecutive nodes
    for (let i = 0; i < nodeCount; i++) {
      const nextNode = (i + 1) % nodeCount;
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[i],
        endShape: nodes[nextNode],
        startConnection: flowConnections[i][0],
        endConnection: flowConnections[i][1],
      });
    }

    // Helper function to create data transfer packets for a source node with custom color
    const createDataTransfers = (sourceNodeIdx) => {
      return nodeGrid.map(([x, y], targetIdx) => {
        if (sourceNodeIdx === targetIdx) return null; // Skip self

        return this.animation.createShape("rectangle", {
          x: nodes[sourceNodeIdx].x + 50,
          y: nodes[sourceNodeIdx].y + 50,
          height: 50,
          width: 100,
          fill: colors.nodeColors[sourceNodeIdx],
          name: `{${sourceNodeIdx},${targetIdx}}`,
          cornerRadius: 10,
        });
      });
    };

    // Determine which source nodes to include
    const sourceNodeIndices = isOneToAll
      ? [sourceNodeOption]
      : Array.from({ length: nodeCount }, (_, i) => i);

    // Create all data transfers for the selected source nodes
    const allDataTransfers = [];
    sourceNodeIndices.forEach((i) => {
      allDataTransfers[i] = createDataTransfers(i);
    });

    // Track completion frames for each target
    const completionFrames = {};

    // Determine direction for each source-target pair to avoid congestion
    const getDirection = (source, target) => {
      // Calculate clockwise and counter-clockwise distances
      const clockwiseDist = (target - source + nodeCount) % nodeCount;
      const counterClockwiseDist = (source - target + nodeCount) % nodeCount;

      // Choose the shorter path
      return clockwiseDist <= counterClockwiseDist
        ? "clockwise"
        : "counterclockwise";
    };

    // Helper function to get next node in the ring
    const getNextNode = (currentNode, direction) => {
      if (direction === "clockwise") {
        return (currentNode + 1) % nodeCount;
      } else {
        return (currentNode - 1 + nodeCount) % nodeCount;
      }
    };

    // Calculate packet travel distance for each source-target pair
    const getDistance = (source, target) => {
      const clockwiseDist = (target - source + nodeCount) % nodeCount;
      const counterClockwiseDist = (source - target + nodeCount) % nodeCount;
      return Math.min(clockwiseDist, counterClockwiseDist);
    };

    // Calculate all paths simultaneously
    sourceNodeIndices.forEach((sourceIdx) => {
      for (let targetIdx = 0; targetIdx < nodeCount; targetIdx++) {
        if (sourceIdx === targetIdx) continue; // Skip self

        const dataNode = allDataTransfers[sourceIdx][targetIdx];
        const direction = getDirection(sourceIdx, targetIdx);
        const distance = getDistance(sourceIdx, targetIdx);

        // Stagger the start times slightly to reduce visual congestion
        // (only matters in all-to-all mode)
        const startOffset = isOneToAll ? 0 : sourceIdx * 5;
        let currentFrame = startOffset;
        let currentNodeIdx = sourceIdx;

        // Animate the path hop by hop
        for (let step = 0; step < distance; step++) {
          const nextNodeIdx = getNextNode(currentNodeIdx, direction);

          this.animation.animate(dataNode, "x", [
            { frame: currentFrame, value: data[currentNodeIdx].x },
            { frame: currentFrame + interval, value: data[nextNodeIdx].x },
          ]);

          this.animation.animate(dataNode, "y", [
            { frame: currentFrame, value: data[currentNodeIdx].y + 50 },
            { frame: currentFrame + interval, value: data[nextNodeIdx].y + 50 },
          ]);

          currentFrame += interval;
          currentNodeIdx = nextNodeIdx;
        }

        // Record when this packet reaches its destination
        const finalFrame = currentFrame;

        // Track the completion for updating target node's data
        if (!completionFrames[targetIdx]) {
          completionFrames[targetIdx] = {};
        }
        completionFrames[targetIdx][sourceIdx] = finalFrame;

        // Schedule removal of this data node
        scheduleRemoval(dataNode, finalFrame + 5);
      }
    });

    const datas = [];

    // Update data displays when all messages for a node arrive
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      // Skip if this node is not a target of any transfers
      if (!completionFrames[nodeIdx]) continue;

      // Find the latest arrival frame for this node
      let lastArrivalFrame = 0;
      for (const sourceIdx in completionFrames[nodeIdx]) {
        lastArrivalFrame = Math.max(
          lastArrivalFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }

      // Build the complete message string
      let fullMessage = "";

      for (const sourceIdx in completionFrames[nodeIdx]) {
        const msgPrefix = fullMessage ? ", " : "";
        fullMessage += `${msgPrefix}{${sourceIdx},${nodeIdx}}`;
        datas.push(fullMessage);
      }

      // Update the data display
      this.animation.animate(data[nodeIdx], "text", [
        { frame: lastArrivalFrame + 10, value: fullMessage },
      ]);

      // Visual feedback for message arrival completion
      this.animation.animate(data[nodeIdx], "fill", [
        { frame: lastArrivalFrame + 5, value: colors.goldenRod },
        { frame: lastArrivalFrame + 15, value: colors.limeGreen },
        { frame: lastArrivalFrame + 30, value: colors.goldenRod },
      ]);

      // Resize the data rectangle to fit the text
      this.animation.animate(data[nodeIdx], "width", [
        { frame: lastArrivalFrame + 5, value: 100 },
        {
          frame: lastArrivalFrame + 15,
          value: Math.min(300, 100 + fullMessage.length * 3),
        },
      ]);

      // Highlight the node itself (if not the source in one-to-all mode)
      if (!(isOneToAll && nodeIdx === sourceNodeOption)) {
        this.animation.animate(nodes[nodeIdx], "fill", [
          { frame: lastArrivalFrame + 5, value: colors.steelBlue },
          { frame: lastArrivalFrame + 15, value: colors.nodeColors[nodeIdx] },
          { frame: lastArrivalFrame + 30, value: colors.steelBlue },
        ]);
      }
    }

    // Find the global completion frame (when all transfers are done)
    let completionFrame = 0;
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      if (!completionFrames[nodeIdx]) continue;

      for (const sourceIdx in completionFrames[nodeIdx]) {
        completionFrame = Math.max(
          completionFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }
    }

    // Final animation to show completion
    completionFrame += 60; // Add margin
    nodes.forEach((node, idx) => {
      // Skip the source node in one-to-all mode as it's already highlighted
      if (isOneToAll && idx === sourceNodeOption) return;

      this.animation.animate(node, "fill", [
        { frame: completionFrame, value: colors.steelBlue },
        { frame: completionFrame + interval / 2, value: colors.limeGreen },
        { frame: completionFrame + interval, value: colors.steelBlue },
      ]);
    });

    // Add a summary text at the end showing completion
    const summaryText = this.animation.createShape("text", {
      x: width / 2,
      y: height - 100,
      fill: colors.steelBlue,
      text: `${title} Complete`,
      fontSize: 24,
      opacity: 0,
    });

    this.animation.animate(summaryText, "opacity", [
      { frame: completionFrame, value: 0 },
      { frame: completionFrame + 30, value: 1 },
    ]);

    this.animation.reset();
    this.animation.play(true);
  }

  personalizedAllToAllHyperCube(sourceNodeOption = -1) {
    // Common constants and settings
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
      // Add colors for each node to differentiate them
      nodeColors: [
        [255, 99, 71], // Tomato (Node 0)
        [255, 165, 0], // Orange (Node 1)
        [154, 205, 50], // YellowGreen (Node 2)
        [0, 191, 255], // DeepSkyBlue (Node 3)
        [138, 43, 226], // BlueViolet (Node 4)
        [255, 20, 147], // DeepPink (Node 5)
        [0, 128, 128], // Teal (Node 6)
        [128, 0, 128], // Purple (Node 7)
      ],
    };

    const duration = 15;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const interval = 120;
    const nodeCount = 8; // Hypercube has 8 nodes

    // Determine mode: all-to-all or one-to-all
    const isOneToAll = sourceNodeOption >= 0 && sourceNodeOption < nodeCount;

    // Set title based on mode
    const title = isOneToAll
      ? `Node ${sourceNodeOption} to All Communication (Hypercube)`
      : "Simultaneous All-to-All Communication (Hypercube)";

    // Initialize animation
    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Track frame-to-remove mapping for all nodes
    const removalFrames = {};

    // Helper function to schedule a node for removal at a specific frame
    const scheduleRemoval = (node, frame) => {
      if (!removalFrames[frame]) {
        removalFrames[frame] = [];
      }
      removalFrames[frame].push(node);
    };

    // Override the frame render method to check for node removal
    const originalRenderFrame = this.animation.engine.renderFrame;
    this.animation.engine.renderFrame = (frameNumber) => {
      // Call the original render method first
      originalRenderFrame.call(this.animation.engine, frameNumber);

      // Check if any nodes need to be removed at this frame
      if (removalFrames[frameNumber]) {
        removalFrames[frameNumber].forEach((node) => {
          this.engine.removeObject(node);
        });
        // Clear the list after processing
        delete removalFrames[frameNumber];
      }
    };

    // Node positions for hypercube
    const nodeGrid = [
      [100, 700], // node 0
      [500, 700], // node 1
      [500, 300], // node 2
      [100, 300], // node 3
      [300, 500], // node 4
      [700, 500], // node 5
      [700, 100], // node 6
      [300, 100], // node 7
    ];

    // Create all nodes
    const nodes = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill:
          isOneToAll && index === sourceNodeOption
            ? colors.nodeColors[sourceNodeOption] // Highlight source node
            : colors.steelBlue,
        name: `node ${index}`,
      });
    });

    // Define hypercube connections for routing
    const hypercubeConnections = [
      [1, 3, 4], // neighbors of node 0
      [0, 2, 5], // neighbors of node 1
      [1, 3, 6], // neighbors of node 2
      [0, 2, 7], // neighbors of node 3
      [0, 5, 7], // neighbors of node 4
      [1, 4, 6], // neighbors of node 5
      [2, 5, 7], // neighbors of node 6
      [3, 4, 6], // neighbors of node 7
    ];

    // Create data rectangles
    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 100,
        y: y,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
        name: ``,
        cornerRadius: 10,
      });
    });

    // Display mode as text
    const modeText = this.animation.createShape("text", {
      x: width / 2,
      y: 50,
      fill: colors.steelBlue,
      text: title,
      fontSize: 24,
    });

    // Create flow paths for hypercube
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

    // Create flows between connected nodes in the hypercube
    const flows = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j of hypercubeConnections[i]) {
        if (i < j) {
          // Avoid duplicate connections
          flows.push(
            this.animation.createShape("flowpath", {
              ...flowDefaults,
              startShape: nodes[i],
              endShape: nodes[j],
              startConnection: "center",
              endConnection: "center",
            })
          );
        }
      }
    }

    // Helper function to create data transfer packets for a source node with custom color
    const createDataTransfers = (sourceNodeIdx) => {
      return nodeGrid.map(([x, y], targetIdx) => {
        if (sourceNodeIdx === targetIdx) return null; // Skip self

        return this.animation.createShape("rectangle", {
          x: nodes[sourceNodeIdx].x + 50,
          y: nodes[sourceNodeIdx].y + 50,
          height: 50,
          width: 100,
          fill: colors.nodeColors[sourceNodeIdx],
          name: `{${sourceNodeIdx},${targetIdx}}`,
          cornerRadius: 10,
        });
      });
    };

    // Determine which source nodes to include
    const sourceNodeIndices = isOneToAll
      ? [sourceNodeOption]
      : Array.from({ length: nodeCount }, (_, i) => i);

    // Create all data transfers for the selected source nodes
    const allDataTransfers = [];
    sourceNodeIndices.forEach((i) => {
      allDataTransfers[i] = createDataTransfers(i);
    });

    // Track completion frames for each target
    const completionFrames = {};

    // Find shortest path in hypercube using breadth-first search
    const findShortestPath = (start, end) => {
      if (start === end) return [start];

      const visited = new Set([start]);
      const queue = [[start]];

      while (queue.length > 0) {
        const path = queue.shift();
        const currentNode = path[path.length - 1];

        for (const neighbor of hypercubeConnections[currentNode]) {
          if (neighbor === end) {
            return [...path, end];
          }

          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([...path, neighbor]);
          }
        }
      }

      return null; // No path found (shouldn't happen in a connected hypercube)
    };

    // Calculate all paths and animate data transfers
    sourceNodeIndices.forEach((sourceIdx) => {
      for (let targetIdx = 0; targetIdx < nodeCount; targetIdx++) {
        if (sourceIdx === targetIdx) continue; // Skip self

        const dataNode = allDataTransfers[sourceIdx][targetIdx];
        const path = findShortestPath(sourceIdx, targetIdx);

        // Calculate initial delay based on source node (for all-to-all mode)
        const startOffset = isOneToAll ? 0 : sourceIdx * 5;
        let currentFrame = startOffset;

        // Animate the packet along the path
        for (let i = 0; i < path.length - 1; i++) {
          const currentNodeIdx = path[i];
          const nextNodeIdx = path[i + 1];

          this.animation.animate(dataNode, "x", [
            { frame: currentFrame, value: data[currentNodeIdx].x },
            { frame: currentFrame + interval, value: data[nextNodeIdx].x },
          ]);

          this.animation.animate(dataNode, "y", [
            { frame: currentFrame, value: data[currentNodeIdx].y + 50 },
            { frame: currentFrame + interval, value: data[nextNodeIdx].y + 50 },
          ]);

          currentFrame += interval;
        }

        // Record when this packet reaches its destination
        const finalFrame = currentFrame;

        // Track the completion for updating target node's data
        if (!completionFrames[targetIdx]) {
          completionFrames[targetIdx] = {};
        }
        completionFrames[targetIdx][sourceIdx] = finalFrame;

        // Schedule removal of this data node
        scheduleRemoval(dataNode, finalFrame + 5);
      }
    });

    const datas = [];

    // Update data displays when all messages for a node arrive
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      // Skip if this node is not a target of any transfers
      if (!completionFrames[nodeIdx]) continue;

      // Find the latest arrival frame for this node
      let lastArrivalFrame = 0;
      for (const sourceIdx in completionFrames[nodeIdx]) {
        lastArrivalFrame = Math.max(
          lastArrivalFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }

      // Build the complete message string
      let fullMessage = "";

      for (const sourceIdx in completionFrames[nodeIdx]) {
        const msgPrefix = fullMessage ? ", " : "";
        fullMessage += `${msgPrefix}{${sourceIdx},${nodeIdx}}`;
        datas.push(fullMessage);
      }

      // Update the data display
      this.animation.animate(data[nodeIdx], "text", [
        { frame: lastArrivalFrame + 10, value: fullMessage },
      ]);

      // Visual feedback for message arrival completion
      this.animation.animate(data[nodeIdx], "fill", [
        { frame: lastArrivalFrame + 5, value: colors.goldenRod },
        { frame: lastArrivalFrame + 15, value: colors.limeGreen },
        { frame: lastArrivalFrame + 30, value: colors.goldenRod },
      ]);

      // Resize the data rectangle to fit the text
      this.animation.animate(data[nodeIdx], "width", [
        { frame: lastArrivalFrame + 5, value: 100 },
        {
          frame: lastArrivalFrame + 15,
          value: Math.min(300, 100 + fullMessage.length * 3),
        },
      ]);

      // Highlight the node itself (if not the source in one-to-all mode)
      if (!(isOneToAll && nodeIdx === sourceNodeOption)) {
        this.animation.animate(nodes[nodeIdx], "fill", [
          { frame: lastArrivalFrame + 5, value: colors.steelBlue },
          { frame: lastArrivalFrame + 15, value: colors.nodeColors[nodeIdx] },
          { frame: lastArrivalFrame + 30, value: colors.steelBlue },
        ]);
      }
    }

    // Find the global completion frame (when all transfers are done)
    let completionFrame = 0;
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      if (!completionFrames[nodeIdx]) continue;

      for (const sourceIdx in completionFrames[nodeIdx]) {
        completionFrame = Math.max(
          completionFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }
    }

    // Final animation to show completion
    completionFrame += 60; // Add margin
    nodes.forEach((node, idx) => {
      // Skip the source node in one-to-all mode as it's already highlighted
      if (isOneToAll && idx === sourceNodeOption) return;

      this.animation.animate(node, "fill", [
        { frame: completionFrame, value: colors.steelBlue },
        { frame: completionFrame + interval / 2, value: colors.limeGreen },
        { frame: completionFrame + interval, value: colors.steelBlue },
      ]);
    });

    // Add a summary text at the end showing completion
    const summaryText = this.animation.createShape("text", {
      x: width / 2,
      y: height - 100,
      fill: colors.steelBlue,
      text: `${title} Complete`,
      fontSize: 24,
      opacity: 0,
    });

    this.animation.animate(summaryText, "opacity", [
      { frame: completionFrame, value: 0 },
      { frame: completionFrame + 30, value: 1 },
    ]);

    this.animation.reset();
    this.animation.play(true);
  }

  personalizedAllToAllMesh(sourceNodeOption = -1) {
    // Common constants and settings
    const colors = {
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      steelBlue: [70, 130, 180],
      // Add colors for each node to differentiate them
      nodeColors: [
        [135, 206, 235],
        [255, 127, 80],
        [50, 205, 50],
        [218, 165, 32],
        [218, 112, 214],
        [112, 128, 144],
        [255, 99, 71],
        [70, 130, 180],
        [147, 112, 219],
        [46, 139, 87],
        [255, 20, 147],
        [64, 224, 208],
        [178, 34, 34],
        [255, 140, 0],
        [119, 136, 153],
        [75, 0, 130], // Indigo (Node 15)
      ],
    };

    const duration = 15;
    const fps = 60;
    const height = 1000;
    const width = 1900;
    const interval = 120;
    const nodeCount = 9; // 3x3 mesh has 9 nodes



    // Determine mode: all-to-all or one-to-all
    const isOneToAll = sourceNodeOption >= 0 && sourceNodeOption < nodeCount;

    // Set title based on mode
    const title = isOneToAll
      ? `Node ${sourceNodeOption} to All Communication (Mesh)`
      : "Simultaneous All-to-All Communication (Mesh)";

    // Initialize animation
    this.animation.clearAll();
    this.animation.setDuration(duration);
    this.animation.setFPS(fps);
    this.engine.setCanvasSize(width, height);

    // Track frame-to-remove mapping for all nodes
    const removalFrames = {};

    // Helper function to schedule a node for removal at a specific frame
    const scheduleRemoval = (node, frame) => {
      if (!removalFrames[frame]) {
        removalFrames[frame] = [];
      }
      removalFrames[frame].push(node);
    };

    // Override the frame render method to check for node removal
    const originalRenderFrame = this.animation.engine.renderFrame;
    this.animation.engine.renderFrame = (frameNumber) => {
      // Call the original render method first
      originalRenderFrame.call(this.animation.engine, frameNumber);

      // Check if any nodes need to be removed at this frame
      if (removalFrames[frameNumber]) {
        removalFrames[frameNumber].forEach((node) => {
          this.engine.removeObject(node);
        });
        // Clear the list after processing
        delete removalFrames[frameNumber];
      }
    };

    // Node positions for 4x4 mesh
    // Node positions for 3x3 mesh
const nodeGrid = [
  [100, 500], // 0
  [100, 300], // 1
  [100, 100], // 2
  [300, 500], // 3
  [300, 300], // 4
  [300, 100], // 5
  [500, 500], // 6
  [500, 300], // 7
  [500, 100], // 8
];


    // Create all nodes
    const nodes = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        height: 100,
        width: 100,
        fill:
          isOneToAll && index === sourceNodeOption
            ? colors.nodeColors[sourceNodeOption] // Highlight source node
            : colors.steelBlue,
        name: `node ${index}`,
      });
    });

    // Define mesh connections for routing
    const meshConnections = [];
const rows = 3;
const cols = 3;
for (let i = 0; i < nodeCount; i++) {
  meshConnections[i] = [];
}

// Add horizontal and vertical connections in the mesh
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const nodeIdx = r * cols + c;

    // Connect to right neighbor if not on rightmost edge
    if (c < cols - 1) {
      meshConnections[nodeIdx].push(nodeIdx + 1);
      meshConnections[nodeIdx + 1].push(nodeIdx);
    }

    // Connect to bottom neighbor if not on bottom edge
    if (r < rows - 1) {
      meshConnections[nodeIdx].push(nodeIdx + cols);
      meshConnections[nodeIdx + cols].push(nodeIdx);
    }
  }
}

    // Create data rectangles
    const data = nodeGrid.map(([x, y], index) => {
      return this.animation.createShape("rectangle", {
        x: x + 50,
        y: y + 50,
        height: 50,
        width: 100,
        fill: colors.goldenRod,
        name: ``,
        cornerRadius: 10,
      });
    });

    // Display mode as text
    const modeText = this.animation.createShape("text", {
      x: width / 2,
      y: 50,
      fill: colors.steelBlue,
      text: title,
      fontSize: 24,
    });

    // Create flow paths for mesh
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

    // Define flow connections between mesh nodes
   // Define flow connections between mesh nodes
const flowPaths = [
  // Horizontal connections (left to right)
  [0, 3, "right", "left"],
  [3, 6, "right", "left"],
  [1, 4, "right", "left"],
  [4, 7, "right", "left"],
  [2, 5, "right", "left"],
  [5, 8, "right", "left"],

  // Vertical connections (top to bottom)
  [0, 1, "top", "bottom"],
  [1, 2, "top", "bottom"],
  [3, 4, "top", "bottom"],
  [4, 5, "top", "bottom"],
  [6, 7, "top", "bottom"],
  [7, 8, "top", "bottom"],
];


    // Create all the flow paths
    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      return this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });

    // Helper function to create data transfer packets for a source node with custom color
    const createDataTransfers = (sourceNodeIdx) => {
      return nodeGrid.map(([x, y], targetIdx) => {
        if (sourceNodeIdx === targetIdx) return null; // Skip self

        return this.animation.createShape("rectangle", {
          x: nodes[sourceNodeIdx].x + 50,
          y: nodes[sourceNodeIdx].y + 50,
          height: 50,
          width: 100,
          fill: colors.nodeColors[sourceNodeIdx],
          name: `{${sourceNodeIdx},${targetIdx}}`,
          cornerRadius: 10,
        });
      });
    };

    // Determine which source nodes to include
    const sourceNodeIndices = isOneToAll
      ? [sourceNodeOption]
      : Array.from({ length: nodeCount }, (_, i) => i);

    // Create all data transfers for the selected source nodes
    const allDataTransfers = [];
    sourceNodeIndices.forEach((i) => {
      allDataTransfers[i] = createDataTransfers(i);
    });

    // Track completion frames for each target
    const completionFrames = {};

    // Find shortest path in mesh using breadth-first search
    const findShortestPath = (start, end) => {
      if (start === end) return [start];

      const visited = new Set([start]);
      const queue = [[start]];

      while (queue.length > 0) {
        const path = queue.shift();
        const currentNode = path[path.length - 1];

        for (const neighbor of meshConnections[currentNode]) {
          if (neighbor === end) {
            return [...path, end];
          }

          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([...path, neighbor]);
          }
        }
      }

      return null; // No path found (shouldn't happen in a connected mesh)
    };

    // Calculate all paths and animate data transfers
    sourceNodeIndices.forEach((sourceIdx) => {
      for (let targetIdx = 0; targetIdx < nodeCount; targetIdx++) {
        if (sourceIdx === targetIdx) continue; // Skip self

        const dataNode = allDataTransfers[sourceIdx][targetIdx];
        const path = findShortestPath(sourceIdx, targetIdx);

        // Calculate initial delay based on source node (for all-to-all mode)
        const startOffset = isOneToAll ? 0 : sourceIdx * 5;
        let currentFrame = startOffset;

        // Animate the packet along the path
        for (let i = 0; i < path.length - 1; i++) {
          const currentNodeIdx = path[i];
          const nextNodeIdx = path[i + 1];

          this.animation.animate(dataNode, "x", [
            { frame: currentFrame, value: data[currentNodeIdx].x },
            { frame: currentFrame + interval, value: data[nextNodeIdx].x },
          ]);

          this.animation.animate(dataNode, "y", [
            { frame: currentFrame, value: data[currentNodeIdx].y + 50 },
            { frame: currentFrame + interval, value: data[nextNodeIdx].y + 50 },
          ]);

          currentFrame += interval;
        }

        // Record when this packet reaches its destination
        const finalFrame = currentFrame;

        // Track the completion for updating target node's data
        if (!completionFrames[targetIdx]) {
          completionFrames[targetIdx] = {};
        }
        completionFrames[targetIdx][sourceIdx] = finalFrame;

        // Schedule removal of this data node
        scheduleRemoval(dataNode, finalFrame + 5);
      }
    });

    const datas = [];

    // Update data displays when all messages for a node arrive
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      // Skip if this node is not a target of any transfers
      if (!completionFrames[nodeIdx]) continue;

      // Find the latest arrival frame for this node
      let lastArrivalFrame = 0;
      for (const sourceIdx in completionFrames[nodeIdx]) {
        lastArrivalFrame = Math.max(
          lastArrivalFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }

      // Build the complete message string
      let fullMessage = "";

      for (const sourceIdx in completionFrames[nodeIdx]) {
        const msgPrefix = fullMessage ? ", " : "";
        fullMessage += `${msgPrefix}{${sourceIdx},${nodeIdx}}`;
        datas.push(fullMessage);
      }

      // Update the data display
      this.animation.animate(data[nodeIdx], "text", [
        { frame: lastArrivalFrame + 10, value: fullMessage },
      ]);

      // Visual feedback for message arrival completion
      this.animation.animate(data[nodeIdx], "fill", [
        { frame: lastArrivalFrame + 5, value: colors.goldenRod },
        { frame: lastArrivalFrame + 15, value: colors.limeGreen },
        { frame: lastArrivalFrame + 30, value: colors.goldenRod },
      ]);

      // Resize the data rectangle to fit the text
      this.animation.animate(data[nodeIdx], "width", [
        { frame: lastArrivalFrame + 5, value: 100 },
        {
          frame: lastArrivalFrame + 15,
          value: Math.min(300, 100 + fullMessage.length * 3),
        },
      ]);

      // Highlight the node itself (if not the source in one-to-all mode)
      if (!(isOneToAll && nodeIdx === sourceNodeOption)) {
        this.animation.animate(nodes[nodeIdx], "fill", [
          { frame: lastArrivalFrame + 5, value: colors.steelBlue },
          { frame: lastArrivalFrame + 15, value: colors.nodeColors[nodeIdx] },
          { frame: lastArrivalFrame + 30, value: colors.steelBlue },
        ]);
      }
    }

    // Find the global completion frame (when all transfers are done)
    let completionFrame = 0;
    for (let nodeIdx = 0; nodeIdx < nodeCount; nodeIdx++) {
      if (!completionFrames[nodeIdx]) continue;

      for (const sourceIdx in completionFrames[nodeIdx]) {
        completionFrame = Math.max(
          completionFrame,
          completionFrames[nodeIdx][sourceIdx]
        );
      }
    }

    // Final animation to show completion
    completionFrame += 60; // Add margin
    nodes.forEach((node, idx) => {
      // Skip the source node in one-to-all mode as it's already highlighted
      if (isOneToAll && idx === sourceNodeOption) return;

      this.animation.animate(node, "fill", [
        { frame: completionFrame, value: colors.steelBlue },
        { frame: completionFrame + interval / 2, value: colors.limeGreen },
        { frame: completionFrame + interval, value: colors.steelBlue },
      ]);
    });

    // Add a summary text at the end showing completion
    const summaryText = this.animation.createShape("text", {
      x: width / 2,
      y: height - 100,
      fill: colors.steelBlue,
      text: `${title} Complete`,
      fontSize: 24,
      opacity: 0,
    });

    console.info(datas.length);

    this.animation.animate(summaryText, "opacity", [
      { frame: completionFrame, value: 0 },
      { frame: completionFrame + 30, value: 1 },
    ]);

    this.animation.reset();
    this.animation.play(true);
  }
}

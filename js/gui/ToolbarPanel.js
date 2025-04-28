class ToolbarPanel {
  constructor(engine, gui) {
    this.engine = engine;
    this.gui = gui;

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
        this.engine.backgroundColor = color(value[0], value[1], value[2]);
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
        this.engine.timeline.setFPS(timelineSettings.fps);
        this.engine.timeline.setDuration(timelineSettings.duration);
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
          this.engine.clearAll();
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
    // In a full implementation, this would serialize the project state
    alert("In a full implementation, this would save the project.");
  }

  loadProject() {
    // In a full implementation, this would load a saved project
    alert("In a full implementation, this would load a project.");
  }

  showExportOptions() {
    // Create export dialog
    const exportDialog = document.createElement("div");
    exportDialog.className = "export-dialog";
    exportDialog.style.position = "fixed";
    exportDialog.style.left = "50%";
    exportDialog.style.top = "50%";
    exportDialog.style.transform = "translate(-50%, -50%)";
    exportDialog.style.backgroundColor = "var(--panel-bg)";
    exportDialog.style.border = "1px solid var(--border-color)";
    exportDialog.style.borderRadius = "4px";
    exportDialog.style.padding = "20px";
    exportDialog.style.width = "350px";
    exportDialog.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    exportDialog.style.zIndex = "1000";

    exportDialog.innerHTML = `
            <h3 style="margin-top:0;">Export Animation</h3>
            <div style="margin-bottom:15px;">
                <label>Format:</label>
                <select id="export-format" style="width:100%;padding:5px;margin-top:5px;background:#222;color:#fff;border:1px solid #444;">
                    <option value="gif">GIF</option>
                    <option value="video">MP4 Video</option>
                    <option value="sequence">PNG Sequence</option>
                </select>
            </div>
            <div style="margin-bottom:15px;">
                <label>Quality:</label>
                <select id="export-quality" style="width:100%;padding:5px;margin-top:5px;background:#222;color:#fff;border:1px solid #444;">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div style="margin-bottom:15px;">
                <label>Range:</label>
                <div style="display:flex;gap:10px;margin-top:5px;">
                    <input type="number" id="export-start-frame" placeholder="Start" value="0" style="flex:1;padding:5px;background:#222;color:#fff;border:1px solid #444;">
                    <input type="number" id="export-end-frame" placeholder="End" value="${
                      this.engine.timeline.totalFrames - 1
                    }" style="flex:1;padding:5px;background:#222;color:#fff;border:1px solid #444;">
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:20px;">
                <button id="export-cancel" class="button">Cancel</button>
                <button id="export-confirm" class="button primary">Export</button>
            </div>
        `;

    document.body.appendChild(exportDialog);

    // Add event listeners
    document.getElementById("export-cancel").addEventListener("click", () => {
      document.body.removeChild(exportDialog);
    });

    document.getElementById("export-confirm").addEventListener("click", () => {
      const format = document.getElementById("export-format").value;
      const quality = document.getElementById("export-quality").value;
      const startFrame = parseInt(
        document.getElementById("export-start-frame").value
      );
      const endFrame = parseInt(
        document.getElementById("export-end-frame").value
      );

      // In a full implementation, this would trigger the export process
      alert(
        `In a full implementation, this would export a ${format} animation from frame ${startFrame} to ${endFrame} at ${quality} quality.`
      );

      document.body.removeChild(exportDialog);
    });
  }

  addAnimationTemplates() {
    this.templatesFolder = this.gui.addFolder("Animation Templates");

    const templates = {
      bounceAnimation: () => this.createBounceAnimation(),
      typingAnimation: () => this.createTypingAnimation(),
      fadeInOut: () => this.createFadeInOutAnimation(),
      particleExplosion: () => this.createParticleAnimation(),
      waveAnimation: () => this.createWaveAnimation(),
      logoReveal: () => this.createLogoRevealAnimation(),
    };

    this.templatesFolder
      .add(templates, "bounceAnimation")
      .name("Bounce Effect");
    this.templatesFolder.add(templates, "typingAnimation").name("Typing Text");
    this.templatesFolder.add(templates, "fadeInOut").name("Fade In/Out");
    this.templatesFolder
      .add(templates, "particleExplosion")
      .name("Particle Effect");
    this.templatesFolder.add(templates, "waveAnimation").name("Wave Animation");
    this.templatesFolder.add(templates, "logoReveal").name("Logo Reveal");

    // Add information about templates
    const info = { message: "Click a template to create a pre-made animation" };
    const infoController = this.templatesFolder
      .add(info, "message")
      .name("Info");
    // Check if disable method exists before calling it
    if (infoController.disable) {
      infoController.disable();
    } else {
      // Alternative approach if disable() doesn't exist
      infoController.__li.style.pointerEvents = "none";
      infoController.__li.style.opacity = "0.6";
    }

    this.templatesFolder.open();
  }

  createShape(type) {
    const centerX = this.engine.canvasWidth / 2;
    const centerY = this.engine.canvasHeight / 2;

    // Find an empty spot near the center
    let x = centerX + Math.random() * 100 - 50;
    let y = centerY + Math.random() * 100 - 50;

    // Create the shape using UIManager's helper
    const uiManager = this.engine.uiManager;
    const newShape = uiManager.createShape(type, x, y);

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

  // Animation template methods
  createBounceAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create a bouncing ball
      const ball = this.createShape("circle");
      ball.name = "Bouncing Ball";
      ball.width = 80;
      ball.fill = color(255, 100, 100);
      ball.x = this.engine.canvasWidth / 2;
      ball.y = 100;

      // Set up keyframes for bouncing
      if (!ball.keyframes) ball.keyframes = {};

      // Y position keyframes for bouncing
      ball.keyframes.y = [
        { frame: 0, value: 100, easing: "easeInQuad" },
        {
          frame: 20,
          value: this.engine.canvasHeight - 40,
          easing: "easeOutBounce",
        },
        {
          frame: 45,
          value: this.engine.canvasHeight - 40,
          easing: "easeInQuad",
        },
        { frame: 60, value: 200, easing: "easeOutQuad" },
        {
          frame: 75,
          value: this.engine.canvasHeight - 40,
          easing: "easeOutBounce",
        },
        {
          frame: 90,
          value: this.engine.canvasHeight - 40,
          easing: "easeInQuad",
        },
        { frame: 105, value: 300, easing: "easeOutQuad" },
        {
          frame: 120,
          value: this.engine.canvasHeight - 40,
          easing: "easeOutBounce",
        },
      ];

      // Squash and stretch
      ball.keyframes.width = [
        { frame: 0, value: 80, easing: "linear" },
        { frame: 19, value: 90, easing: "easeInCubic" },
        { frame: 20, value: 100, easing: "linear" },
        { frame: 22, value: 60, easing: "easeOutCubic" },
        { frame: 30, value: 80, easing: "easeInOutCubic" },

        { frame: 59, value: 80, easing: "linear" },
        { frame: 60, value: 90, easing: "easeInCubic" },
        { frame: 74, value: 90, easing: "easeInCubic" },
        { frame: 75, value: 100, easing: "linear" },
        { frame: 77, value: 60, easing: "easeOutCubic" },
        { frame: 85, value: 80, easing: "easeInOutCubic" },

        { frame: 104, value: 80, easing: "linear" },
        { frame: 105, value: 90, easing: "easeInCubic" },
        { frame: 119, value: 90, easing: "easeInCubic" },
        { frame: 120, value: 100, easing: "linear" },
        { frame: 122, value: 60, easing: "easeOutCubic" },
        { frame: 130, value: 80, easing: "easeInOutCubic" },
      ];

      // Create a shadow
      const shadow = this.createShape("ellipse");
      shadow.name = "Ball Shadow";
      shadow.width = 100;
      shadow.height = 20;
      shadow.fill = color(0, 0, 0, 100);
      shadow.x = this.engine.canvasWidth / 2;
      shadow.y = this.engine.canvasHeight - 10;

      // Shadow animation
      if (!shadow.keyframes) shadow.keyframes = {};

      shadow.keyframes.width = [
        { frame: 0, value: 60, easing: "linear" },
        { frame: 20, value: 100, easing: "easeOutQuad" },
        { frame: 45, value: 100, easing: "linear" },
        { frame: 60, value: 70, easing: "easeInOutQuad" },
        { frame: 75, value: 90, easing: "easeOutQuad" },
        { frame: 90, value: 90, easing: "linear" },
        { frame: 105, value: 80, easing: "easeInOutQuad" },
        { frame: 120, value: 85, easing: "easeOutQuad" },
      ];

      shadow.keyframes.opacity = [
        { frame: 0, value: 150, easing: "linear" },
        { frame: 20, value: 100, easing: "easeOutQuad" },
        { frame: 60, value: 180, easing: "easeInQuad" },
        { frame: 75, value: 120, easing: "easeOutQuad" },
        { frame: 105, value: 150, easing: "easeInQuad" },
        { frame: 120, value: 130, easing: "easeOutQuad" },
      ];

      // Set object order
      this.engine.sendToBack(shadow);
      this.engine.bringToFront(ball);

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }

  createTypingAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create text object
      const text = this.createShape("text");
      text.name = "Typing Text";
      text.text = "";
      text.fontSize = 36;
      text.fill = color(255, 255, 255);
      text.x = this.engine.canvasWidth / 2;
      text.y = this.engine.canvasHeight / 2;

      // Final text content
      const finalText = "Creating programmatic animations is fun!";

      // Create keyframes for each character
      if (!text.keyframes) text.keyframes = {};
      text.keyframes.text = [];

      for (let i = 0; i <= finalText.length; i++) {
        text.keyframes.text.push({
          frame: i * 3,
          value: finalText.substring(0, i),
          easing: "linear",
        });
      }

      // Add a cursor
      const cursor = this.createShape("rectangle");
      cursor.name = "Cursor";
      cursor.width = 3;
      cursor.height = 36;
      cursor.fill = color(255, 255, 255);
      cursor.x = this.engine.canvasWidth / 2 + 5;
      cursor.y = this.engine.canvasHeight / 2;

      // Make cursor blink and follow text
      if (!cursor.keyframes) cursor.keyframes = {};
      cursor.keyframes.opacity = [];
      cursor.keyframes.x = [];

      // Cursor position follows text
      for (let i = 0; i <= finalText.length; i++) {
        // Calculate cursor X position based on text width
        // For simplicity, we're approximating width based on character count
        const textWidth = i * 20; // Rough approximation
        cursor.keyframes.x.push({
          frame: i * 3,
          value: text.x - textWidth / 2 + textWidth + 5,
          easing: "linear",
        });
      }

      // Cursor blinking
      for (let i = 0; i < 120; i += 10) {
        cursor.keyframes.opacity.push(
          { frame: i, value: 255, easing: "linear" },
          { frame: i + 5, value: 0, easing: "linear" }
        );
      }

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }

  createFadeInOutAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create a centered text with fade in/out animation
      const text = this.createShape("text");
      text.name = "Fading Text";
      text.text = "FADE IN & OUT";
      text.fontSize = 48;
      text.fontFamily = "Arial";
      text.textStyle = "bold";
      text.fill = color(255, 255, 255);
      text.x = this.engine.canvasWidth / 2;
      text.y = this.engine.canvasHeight / 2;

      // Create fade keyframes
      if (!text.keyframes) text.keyframes = {};
      text.keyframes.opacity = [
        { frame: 0, value: 0, easing: "linear" },
        { frame: 30, value: 255, easing: "easeOutCubic" },
        { frame: 60, value: 255, easing: "linear" },
        { frame: 90, value: 0, easing: "easeInCubic" },
      ];

      // Add subtle scaling
      text.keyframes.fontSize = [
        { frame: 0, value: 36, easing: "easeOutQuad" },
        { frame: 30, value: 48, easing: "easeOutQuad" },
        { frame: 60, value: 48, easing: "linear" },
        { frame: 90, value: 54, easing: "easeInQuad" },
      ];

      // Create a background shape
      const bg = this.createShape("rectangle");
      bg.name = "Background";
      bg.width = this.engine.canvasWidth;
      bg.height = this.engine.canvasHeight;
      bg.fill = color(30, 30, 30);
      bg.x = this.engine.canvasWidth / 2;
      bg.y = this.engine.canvasHeight / 2;

      // Set object order
      this.engine.sendToBack(bg);
      this.engine.bringToFront(text);

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }

  createParticleAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create a text that will explode into particles
      const text = this.createShape("text");
      text.name = "Exploding Text";
      text.text = "BOOM!";
      text.fontSize = 72;
      text.fontFamily = "Impact";
      text.fill = color(255, 100, 50);
      text.x = this.engine.canvasWidth / 2;
      text.y = this.engine.canvasHeight / 2;

      // Create keyframes for text
      if (!text.keyframes) text.keyframes = {};
      text.keyframes.fontSize = [
        { frame: 0, value: 10, easing: "easeOutElastic" },
        { frame: 20, value: 72, easing: "easeOutElastic" },
        { frame: 45, value: 90, easing: "easeInBack" },
        { frame: 50, value: 0, easing: "linear" },
      ];

      // Create particle burst
      const particleCount = 30;
      const particles = [];

      // Create particles that will appear after text explodes
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 20 + 5;
        const particle = this.createShape("circle");
        particle.name = `Particle ${i}`;
        particle.width = size;
        particle.fill = color(
          Math.random() * 100 + 155,
          Math.random() * 100,
          Math.random() * 50
        );
        particle.x = text.x;
        particle.y = text.y;
        particle.opacity = 0;

        // Start particles invisible
        if (!particle.keyframes) particle.keyframes = {};

        // Random direction for each particle
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 300 + 100;
        const destX = text.x + Math.cos(angle) * speed;
        const destY = text.y + Math.sin(angle) * speed;

        // Opacity keyframes
        particle.keyframes.opacity = [
          { frame: 0, value: 0, easing: "linear" },
          { frame: 50, value: 0, easing: "linear" },
          { frame: 55, value: 255, easing: "linear" },
          { frame: 85, value: 255, easing: "linear" },
          { frame: 120, value: 0, easing: "easeInQuad" },
        ];

        // Position keyframes
        particle.keyframes.x = [
          { frame: 50, value: text.x, easing: "linear" },
          { frame: 120, value: destX, easing: "easeOutCubic" },
        ];

        particle.keyframes.y = [
          { frame: 50, value: text.y, easing: "linear" },
          { frame: 120, value: destY, easing: "easeOutCubic" },
        ];

        // Size animation
        particle.keyframes.width = [
          { frame: 50, value: size, easing: "linear" },
          { frame: 120, value: size * 0.2, easing: "easeInQuad" },
        ];

        particles.push(particle);
      }

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }

  createWaveAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create a wave of circles
      const circleCount = 12;
      const circles = [];

      // Create circles
      for (let i = 0; i < circleCount; i++) {
        const circle = this.createShape("circle");
        circle.name = `Wave Circle ${i + 1}`;
        circle.width = 30;
        circle.fill = color(100, 200, 255);

        // Position in a circle
        const angle = (i / circleCount) * Math.PI * 2;
        const radius = 150;
        circle.x = this.engine.canvasWidth / 2 + Math.cos(angle) * radius;
        circle.y = this.engine.canvasHeight / 2 + Math.sin(angle) * radius;

        // Create wave effect
        if (!circle.keyframes) circle.keyframes = {};

        // Wave scaling
        circle.keyframes.width = [];

        // Create oscillations
        for (let frame = 0; frame <= 120; frame += 30) {
          const offset = i * 5; // Staggered timing
          circle.keyframes.width.push(
            {
              frame: (frame + offset) % 120,
              value: 30,
              easing: "easeInOutQuad",
            },
            {
              frame: (frame + offset + 15) % 120,
              value: 60,
              easing: "easeInOutQuad",
            }
          );
        }

        // Sort keyframes by frame
        circle.keyframes.width.sort((a, b) => a.frame - b.frame);

        circles.push(circle);
      }

      // Create center object
      const centerCircle = this.createShape("circle");
      centerCircle.name = "Center Circle";
      centerCircle.width = 60;
      centerCircle.fill = color(50, 100, 255);
      centerCircle.x = this.engine.canvasWidth / 2;
      centerCircle.y = this.engine.canvasHeight / 2;

      // Center circle animation
      if (!centerCircle.keyframes) centerCircle.keyframes = {};
      centerCircle.keyframes.width = [
        { frame: 0, value: 60, easing: "easeInOutQuad" },
        { frame: 30, value: 80, easing: "easeInOutQuad" },
        { frame: 60, value: 60, easing: "easeInOutQuad" },
        { frame: 90, value: 80, easing: "easeInOutQuad" },
        { frame: 120, value: 60, easing: "easeInOutQuad" },
      ];

      centerCircle.keyframes.rotation = [
        { frame: 0, value: 0, easing: "linear" },
        { frame: 120, value: 360, easing: "linear" },
      ];

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }

  createLogoRevealAnimation() {
    // Clear existing objects if user confirms
    if (confirm("This will create a new animation. Continue?")) {
      this.engine.clearAll();

      // Create rectangle elements for a logo
      const parts = [];
      const colors = [
        color(50, 100, 200),
        color(60, 160, 220),
        color(70, 180, 240),
        color(80, 200, 255),
      ];

      // Create logo shape with multiple parts
      for (let i = 0; i < 4; i++) {
        const rect = this.createShape("rectangle");
        rect.name = `Logo Part ${i + 1}`;
        rect.width = 80;
        rect.height = 80;
        rect.x = this.engine.canvasWidth / 2 - 120 + i * 80;
        rect.y = this.engine.canvasHeight / 2;
        rect.cornerRadius = 10;
        rect.fill = colors[i];
        rect.opacity = 0;
        rect.rotation = 45;

        // Create animation
        if (!rect.keyframes) rect.keyframes = {};

        const delay = i * 5;
        rect.keyframes.opacity = [
          { frame: 0 + delay, value: 0, easing: "linear" },
          { frame: 15 + delay, value: 255, easing: "easeOutQuad" },
        ];

        rect.keyframes.rotation = [
          { frame: 0 + delay, value: 45, easing: "easeOutBack" },
          { frame: 20 + delay, value: 0, easing: "easeOutBack" },
        ];

        rect.keyframes.y = [
          {
            frame: 0 + delay,
            value: this.engine.canvasHeight / 2 - 100,
            easing: "easeOutBack",
          },
          {
            frame: 20 + delay,
            value: this.engine.canvasHeight / 2,
            easing: "easeOutBack",
          },
        ];

        parts.push(rect);
      }

      // Add text
      const text = this.createShape("text");
      text.name = "Logo Text";
      text.text = "ANIMATOR";
      text.fontSize = 48;
      text.fontFamily = "Arial";
      text.textStyle = "bold";
      text.fill = color(255, 255, 255);
      text.x = this.engine.canvasWidth / 2;
      text.y = this.engine.canvasHeight / 2 + 100;
      text.opacity = 0;

      // Text animation
      if (!text.keyframes) text.keyframes = {};
      text.keyframes.opacity = [
        { frame: 25, value: 0, easing: "linear" },
        { frame: 40, value: 255, easing: "easeOutQuad" },
      ];

      text.keyframes.y = [
        {
          frame: 25,
          value: this.engine.canvasHeight / 2 + 150,
          easing: "easeOutQuad",
        },
        {
          frame: 50,
          value: this.engine.canvasHeight / 2 + 100,
          easing: "easeOutQuad",
        },
      ];

      // Create final combined animation
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Add scale bounce at the end
        part.keyframes.width.push(
          { frame: 60, value: 80, easing: "easeInQuad" },
          { frame: 70, value: 100, easing: "easeOutBack" },
          { frame: 80, value: 80, easing: "easeInOutQuad" }
        );

        part.keyframes.height.push(
          { frame: 60, value: 80, easing: "easeInQuad" },
          { frame: 70, value: 100, easing: "easeOutBack" },
          { frame: 80, value: 80, easing: "easeInOutQuad" }
        );
      }

      // Text final animation
      text.keyframes.fontSize.push(
        { frame: 60, value: 48, easing: "easeInQuad" },
        { frame: 70, value: 52, easing: "easeOutQuad" },
        { frame: 80, value: 48, easing: "easeInOutQuad" }
      );

      // Start the animation
      this.engine.timeline.restart();
      this.engine.play();
    }
  }
}

let engine;
let uiManager;
let animAPI;
let vsCodeUI;

function setup() {
  // Create canvas and add it to container
  const canvasContainer = document.getElementById("canvas-container");

  // Get container dimensions
  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;

  // Create canvas with container dimensions
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent("canvas-container");

  // Update engine canvas dimensions
  engine = new AnimationEngine();
  engine.canvasWidth = containerWidth;
  engine.canvasHeight = containerHeight;
  engine.initialize();

  // Initialize UI manager
  uiManager = new UIManager(engine);
  engine.uiManager = uiManager;
  uiManager.initialize();

  // Initialize Animation API
  animAPI = new AnimationAPI(engine);

  // Initialize VS Code-like UI
  vsCodeUI = new VSCodeUI(engine);
  vsCodeUI.initialize();

  // Initialize Code Editor
  const codeEditor = new CodeEditorPanel(engine);
  codeEditor.initialize();
  vsCodeUI.codeEditorPanel = codeEditor;

  // Set framerate
  frameRate(120);

  // Initial resize to ensure everything fits
  windowResized();

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === canvasContainer) {
        windowResized();
      }
    }
  });

  resizeObserver.observe(canvasContainer);
}

function draw() {
  // Update engine and UI
  engine.update();
  engine.render();
  uiManager.update();
}

function windowResized() {
  // Get the container
  const container = document.getElementById("canvas-container");

  // Calculate available space
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;

  // Resize canvas
  resizeCanvas(availableWidth, availableHeight);

  // Update engine dimensions
  engine.canvasWidth = availableWidth;
  engine.canvasHeight = availableHeight;

  // Center objects if needed (optional)
  centerAnimationObjects();
}

function centerAnimationObjects() {
  // This function centers all objects when the canvas is resized
  // Only run this if you want objects to reposition when window changes

  // Skip if no engine or objects
  if (!engine || !engine.objects.length) return;

  // Calculate center offset
  const centerX = engine.canvasWidth / 2;
  const centerY = engine.canvasHeight / 2;

  // Only center if this is a dramatic change in canvas size
  // to avoid disrupting existing animations
  const sizeDifference =
    Math.abs(800 - engine.canvasWidth) + Math.abs(600 - engine.canvasHeight);
  if (sizeDifference > 400) {
    // Only center if big change
    // Center all objects relative to new canvas center
    for (const obj of engine.objects) {
      // Skip background objects
      if (obj.name === "Background") continue;

      // Adjust positions to maintain relative placement to center
      if (engine.canvasWidth > 800) {
        const offsetX = (obj.x - 400) / 400; // -1 to 1 range
        obj.x = centerX + offsetX * centerX;
      }

      if (engine.canvasHeight > 600) {
        const offsetY = (obj.y - 300) / 300; // -1 to 1 range
        obj.y = centerY + offsetY * centerY;
      }
    }
  }
}

// Optional: Create custom animation templates that can be called from the UI
function createBounceAnimation() {
  if (vsCodeUI) {
    vsCodeUI.createBounceAnimation();
  }
}

function createTypingAnimation() {
  if (vsCodeUI) {
    vsCodeUI.createTypingAnimation();
  }
}

function createWaveAnimation() {
  if (vsCodeUI) {
    vsCodeUI.createWaveAnimation();
  }
}

function createParticleAnimation() {
  if (vsCodeUI) {
    vsCodeUI.createParticleAnimation();
  }
}

class CodeEditorPanel {
  constructor(engine) {
    this.engine = engine;
    this.editorContainer = null;
    this.codeTextarea = null;
    this.isVisible = false;
  }

  initialize() {
    // Create editor container
    this.createEditorDOM();

    // Set up the editor with sample code
    this.setupEditor();
  }

  createEditorDOM() {
    // Create editor container
    this.editorContainer = document.createElement("div");
    this.editorContainer.className = "code-editor-container panel-container";
    this.editorContainer.style.position = "fixed";
    this.editorContainer.style.left = "50%";
    this.editorContainer.style.top = "50%";
    this.editorContainer.style.transform = "translate(-50%, -50%)";
    this.editorContainer.style.width = "700px";
    this.editorContainer.style.height = "500px";
    this.editorContainer.style.zIndex = "1000";
    this.editorContainer.style.display = "none";
    this.editorContainer.style.flexDirection = "column";
    this.editorContainer.style.padding = "0";
    this.editorContainer.style.overflow = "hidden";

    // Editor header
    const header = document.createElement("div");
    header.className = "editor-header";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "10px 15px";
    header.style.borderBottom = "1px solid var(--border-color)";
    header.style.backgroundColor = "#1a1a1a";

    const title = document.createElement("h3");
    title.textContent = "Animation Script Editor";
    title.style.margin = "0";
    title.style.fontSize = "16px";
    title.style.cursor = "move"; // Indicate draggable

    const headerActions = document.createElement("div");
    headerActions.style.display = "flex";
    headerActions.style.gap = "10px";

    const closeBtn = document.createElement("button");
    closeBtn.className = "button";
    closeBtn.innerHTML = "×";
    closeBtn.style.width = "28px";
    closeBtn.style.height = "28px";
    closeBtn.style.padding = "0";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.display = "flex";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.alignItems = "center";
    closeBtn.addEventListener("click", () => {
      this.toggleEditor(false);
    });

    headerActions.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(headerActions);

    // Editor content area
    const contentArea = document.createElement("div");
    contentArea.className = "editor-content";
    contentArea.style.display = "flex";
    contentArea.style.flexDirection = "column";
    contentArea.style.height = "calc(100% - 50px)";
    contentArea.style.padding = "10px";

    // Editor textarea
    this.codeTextarea = document.createElement("textarea");
    this.codeTextarea.className = "code-textarea";
    this.codeTextarea.style.width = "100%";
    this.codeTextarea.style.height = "calc(100% - 50px)";
    this.codeTextarea.style.backgroundColor = "#222";
    this.codeTextarea.style.color = "#eee";
    this.codeTextarea.style.border = "1px solid #333";
    this.codeTextarea.style.padding = "10px";
    this.codeTextarea.style.fontFamily = "monospace";
    this.codeTextarea.style.fontSize = "14px";
    this.codeTextarea.style.resize = "none";
    this.codeTextarea.style.lineHeight = "1.4";
    this.codeTextarea.style.tabSize = "2";

    // Button controls
    const controls = document.createElement("div");
    controls.className = "editor-controls";
    controls.style.display = "flex";
    controls.style.justifyContent = "space-between";
    controls.style.marginTop = "10px";
    controls.style.padding = "10px 0";

    const runButton = document.createElement("button");
    runButton.className = "button primary";
    runButton.textContent = "Run Animation";
    runButton.addEventListener("click", () => {
      this.runCode();
    });

    const samplesWrapper = document.createElement("div");
    samplesWrapper.style.display = "flex";
    samplesWrapper.style.alignItems = "center";
    samplesWrapper.style.gap = "10px";

    const samplesLabel = document.createElement("span");
    samplesLabel.textContent = "Examples:";
    samplesLabel.style.fontSize = "14px";

    const sampleMenu = document.createElement("select");
    sampleMenu.className = "sample-menu";
    sampleMenu.style.backgroundColor = "#333";
    sampleMenu.style.color = "#fff";
    sampleMenu.style.border = "1px solid #555";
    sampleMenu.style.padding = "5px 10px";
    sampleMenu.style.borderRadius = "3px";

    const samples = {
      default: "Basic Animation",
      particles: "Particle System",
      typing: "Text Typing",
      path: "Path Animation",
      wave: "Wave Effect",
    };

    for (const [key, label] of Object.entries(samples)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = label;
      sampleMenu.appendChild(option);
    }

    sampleMenu.addEventListener("change", () => {
      this.loadSample(sampleMenu.value);
    });

    samplesWrapper.appendChild(samplesLabel);
    samplesWrapper.appendChild(sampleMenu);

    controls.appendChild(samplesWrapper);
    controls.appendChild(runButton);

    // Add everything to the container
    contentArea.appendChild(this.codeTextarea);
    contentArea.appendChild(controls);

    this.editorContainer.appendChild(header);
    this.editorContainer.appendChild(contentArea);

    document.body.appendChild(this.editorContainer);

    // Make editor draggable
    this.makeEditorDraggable(header);

    // Improve textarea with line numbers and syntax highlighting if the full implementation
    this.enhanceEditorIfPossible();
  }

  makeEditorDraggable(dragHandle) {
    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;

    dragHandle.addEventListener("mousedown", (e) => {
      // Only handle left mouse button
      if (e.button !== 0) return;

      isDragging = true;
      const rect = this.editorContainer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Prevent text selection during drag
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      this.editorContainer.style.left = `${x}px`;
      this.editorContainer.style.top = `${y}px`;
      this.editorContainer.style.transform = "none";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  enhanceEditorIfPossible() {
    // In a full implementation, this would integrate CodeMirror or Monaco Editor
    // For this demo, we'll just add some basic improvements

    // Add line numbers with a simple approach
    const lineNumbers = document.createElement("div");
    lineNumbers.className = "line-numbers";
    lineNumbers.style.position = "absolute";
    lineNumbers.style.left = "0";
    lineNumbers.style.top = "0";
    lineNumbers.style.width = "30px";
    lineNumbers.style.height = "100%";
    lineNumbers.style.backgroundColor = "#1a1a1a";
    lineNumbers.style.color = "#666";
    lineNumbers.style.fontFamily = "monospace";
    lineNumbers.style.fontSize = "14px";
    lineNumbers.style.textAlign = "right";
    lineNumbers.style.paddingRight = "5px";
    lineNumbers.style.overflowY = "hidden";

    // In full implementation, this would be more sophisticated
    this.codeTextarea.style.paddingLeft = "35px";

    // Handle tab key properly
    this.codeTextarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        // Insert 2 spaces at cursor position
        const start = this.codeTextarea.selectionStart;
        const end = this.codeTextarea.selectionEnd;

        this.codeTextarea.value =
          this.codeTextarea.value.substring(0, start) +
          "  " +
          this.codeTextarea.value.substring(end);

        // Move cursor position
        this.codeTextarea.selectionStart = this.codeTextarea.selectionEnd =
          start + 2;
      }
    });
  }

  setupEditor() {
    // Set default code
    this.loadSample("default");
  }

  toggleEditor(show = null) {
    // If show is null, toggle based on current state
    const newState = show === null ? !this.isVisible : show;
    this.isVisible = newState;

    this.editorContainer.style.display = this.isVisible ? "flex" : "none";

    // Update toggle button state if there is one
    const button = document.querySelector(".code-editor-toggle");
    if (button) {
      button.classList.toggle("active", this.isVisible);
    }
  }

  // In CodeEditorPanel.js
  runCode() {
    try {
      // Get the code
      const code = this.codeTextarea.value;

      // Create a function from the code
      const fn = new Function("engine", "animAPI", code);

      // Create an AnimationAPI instance with the engine
      const animAPI = new AnimationAPI(this.engine);

      // Run the function
      fn(this.engine, animAPI);

      // Show success message
      this.showNotification(
        "Animation script executed successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error running animation code:", error);
      this.showNotification(`Error: ${error.message}`, "error");
    }
  }

  loadSample(sampleName) {
    switch (sampleName) {
      case "default":
        this.codeTextarea.value = this.getDefaultSample();
        break;
      case "particles":
        this.codeTextarea.value = this.getParticlesSample();
        break;
      case "typing":
        this.codeTextarea.value = this.getTypingSample();
        break;
      case "path":
        this.codeTextarea.value = this.getPathSample();
        break;
      case "wave":
        this.codeTextarea.value = this.getWaveSample();
        break;
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "4px";
    notification.style.zIndex = "2000";
    notification.style.fontFamily = "Arial, sans-serif";
    notification.style.fontSize = "14px";
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    notification.style.transition = "opacity 0.3s, transform 0.3s";

    if (type === "error") {
      notification.style.backgroundColor = "#ff4c4c";
      notification.style.color = "white";
    } else if (type === "success") {
      notification.style.backgroundColor = "#4caf50";
      notification.style.color = "white";
    } else {
      notification.style.backgroundColor = "#2196f3";
      notification.style.color = "white";
    }

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  getDefaultSample() {
    return `// Clear all existing objects
animAPI.clearAll();

// Set the animation FPS and duration
animAPI.setFPS(24);
animAPI.setDuration(10); // seconds

// Create a circle
const circle = animAPI.createShape('circle', {
    x: 400,
    y: 300,
    size: 100,
    fill: color(255, 100, 100),
    name: "My Circle"
});

// Animate the circle
animAPI.animate(circle, 'x', [
    {frame: 0, value: 400},
    {frame: 120, value: 600, easing: 'easeInOutQuad'},
    {frame: 240, value: 400, easing: 'easeInOutQuad'}
]);

// Add a pulsing effect
animAPI.pulse(circle, 0, 5, 240, 0.8, 1.2);

// Create a text object
const text = animAPI.createShape('text', {
    x: 400,
    y: 150,
    text: "Programmatic Animation",
    fontSize: 32,
    fill: color(255, 255, 255),
    name: "Title"
});

// Fade in the text
// Fade in the text
animAPI.fadeIn(text, 0, 30);

// Play the animation
animAPI.play();`;
  }

  getParticlesSample() {
    return `// Create a particle explosion
animAPI.clearAll();
animAPI.setFPS(30);
animAPI.setDuration(5);

// Create particle system at the center of screen
const particles = animAPI.createParticleSystem(400, 300, 50, {
    type: 'circle',
    size: 15,
    color: [255, 200, 100],
    duration: 90,
    spread: 300,
    easing: 'easeOutCubic',
    scaleDown: true
});

// Add some text
const text = animAPI.createShape('text', {
    x: 400,
    y: 300,
    text: "BOOM!",
    fontSize: 48,
    fill: color(255, 100, 50),
    name: "Explosion Text"
});

// Animate the text
animAPI.animate(text, 'fontSize', [
    {frame: 0, value: 10, easing: 'easeOutElastic'},
    {frame: 20, value: 72, easing: 'easeOutElastic'}
]);

// Play the animation
animAPI.play();`;
  }

  getTypingSample() {
    return `// Create a typing text animation
animAPI.clearAll();
animAPI.setDuration(8);

// Background rect
const bg = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 600,
    height: 300,
    fill: color(40, 40, 40),
    cornerRadius: 10,
    name: "Background"
});

// Create text with typing effect
const text = animAPI.createShape('text', {
    x: 400,
    y: 300,
    text: "",
    fontSize: 24,
    fill: color(100, 255, 100),
    name: "Code Text"
});

// Generate the typing effect
animAPI.typeText(text, 10, 
  "function animate() {\n" +
  "  // Create cool animations\n" +
  "  const circle = new Circle(400, 300);\n" +
  "  circle.animate('rotation', 0, 360);\n" +
  "  return 'Animation complete!';\n" +
  "}"
, 120);

// Create cursor
const cursor = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 2,
    height: 24,
    fill: color(100, 255, 100),
    name: "Cursor"
});

// Blink the cursor
for (let i = 0; i < 16; i++) {
    cursor.addKeyframe('opacity', i * 15, i % 2 === 0 ? 255 : 0);
}

animAPI.play();`;
  }

  getPathSample() {
    return `// Create an object following a complex path
animAPI.clearAll();
animAPI.setDuration(10);

// Create a shape to animate
const shape = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 40,
    height: 40,
    fill: color(255, 150, 50),
    cornerRadius: 5,
    name: "Path Follower"
});

// Define a path (heart shape)
const path = [];
const scale = 5;
for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const x = 400 + 16 * scale * Math.pow(Math.sin(t), 3);
    const y = 300 - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    path.push({x, y});
}

// Make the object follow the path
animAPI.followPath(shape, path, 0, 240);

// Also rotate the shape to follow the direction
animAPI.animate(shape, 'rotation', [
    {frame: 0, value: 0},
    {frame: 240, value: 360}
]);

// Add some particles that follow behind
let lastPoint = {x: shape.x, y: shape.y};
for (let i = 0; i < path.length; i += 10) {
    if (i > 0) {
        const particle = animAPI.createShape('circle', {
            x: path[i].x,
            y: path[i].y,
            size: 10,
            fill: color(255, 150, 50, 150),
            name: "Particle_" + i
        });
        
        // Fade in/out
        animAPI.animate(particle, 'opacity', [
            {frame: i - 10, value: 0},
            {frame: i, value: 200},
            {frame: i + 10, value: 0}
        ]);
    }
}

animAPI.play();`;
  }

  getWaveSample() {
    return `// Create a wave animation with multiple objects
animAPI.clearAll();
animAPI.setDuration(10);

// Create a bunch of rectangles in a row
const rects = [];
const count = 20;

for (let i = 0; i < count; i++) {
    const rect = animAPI.createShape('rectangle', {
        x: 100 + i * 35,
        y: 300,
        width: 20,
        height: 100,
        fill: color(50 + i * 10, 100, 255 - i * 10),
        name: "Bar_" + i
    });
    rects.push(rect);
}

// Create sine wave animation
for (let i = 0; i < count; i++) {
    const delay = i * 5; // Staggered timing
    const keyframes = [];
    
    // Create multiple wave cycles
    for (let frame = 0; frame <= 240; frame += 10) {
        keyframes.push({
            frame: frame,
            value: 300 + Math.sin((frame + delay) * 0.05) * 100,
            easing: 'linear'
        });
    }
    
    // Apply the animation
    animAPI.animate(rects[i], 'y', keyframes);
    
    // Also animate the height for added effect
    const heightFrames = [];
    for (let frame = 0; frame <= 240; frame += 10) {
        heightFrames.push({
            frame: frame,
            value: 100 + Math.cos((frame + delay) * 0.05) * 50,
            easing: 'linear'
        });
    }
    
    animAPI.animate(rects[i], 'height', heightFrames);
}

// Add a circle that moves across the wave
const ball = animAPI.createShape('circle', {
    x: 100,
    y: 200,
    size: 30,
    fill: color(255, 255, 255),
    name: "Surfer"
});

// Make the ball move across
animAPI.animate(ball, 'x', [
    {frame: 0, value: 100},
    {frame: 240, value: 100 + (count - 1) * 35}
]);

// Make the ball follow the wave height
const ballYKeyframes = [];
for (let frame = 0; frame <= 240; frame += 5) {
    // Calculate x position at this frame
    const xPos = 100 + (frame / 240) * ((count - 1) * 35);
    // Calculate which bar the ball is over
    const barIndex = Math.floor((xPos - 100) / 35);
    
    if (barIndex >= 0 && barIndex < count) {
        ballYKeyframes.push({
            frame: frame,
            value: 200 + Math.sin((frame + barIndex * 5) * 0.05) * 80,
            easing: 'linear'
        });
    }
}

animAPI.animate(ball, 'y', ballYKeyframes);

animAPI.play();`;
  }
}

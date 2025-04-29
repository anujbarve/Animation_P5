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
    // Use the container defined in HTML
    this.editorContainer = document.getElementById("code-editor-container");
    if (!this.editorContainer) {
      this.editorContainer = document.createElement("div");
      this.editorContainer.id = "code-editor-container";
      this.editorContainer.className =
        "bg-gray-800 border border-gray-600 rounded-lg shadow-2xl w-[700px] h-[500px] flex flex-col overflow-hidden";
      document.body.appendChild(this.editorContainer);
    }
    this.editorContainer.innerHTML = "";

    // Editor header
    const header = document.createElement("div");
    header.className =
      "editor-header flex justify-between items-center p-3 border-b border-gray-600 bg-gray-700";

    const title = document.createElement("h3");
    title.textContent = "Animation Script Editor";
    title.className = "m-0 text-base cursor-move";

    const headerActions = document.createElement("div");
    headerActions.className = "flex gap-2";

    const closeBtn = document.createElement("button");
    closeBtn.className =
      "bg-gray-600 text-gray-100 border-none rounded w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-500 text-xl font-bold";
    closeBtn.innerHTML = "×";
    closeBtn.addEventListener("click", () => {
      this.toggleEditor(false);
    });

    headerActions.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(headerActions);

    // Editor content area
    const contentArea = document.createElement("div");
    contentArea.className =
      "editor-content flex flex-col h-[calc(100%-50px)] p-2";

    // Editor textarea
    this.codeTextarea = document.createElement("textarea");
    this.codeTextarea.className =
      "code-textarea w-full h-[calc(100%-50px)] bg-gray-700 text-gray-200 border border-gray-600 p-2 font-mono text-sm resize-none leading-5";
    this.codeTextarea.style.tabSize = "2";

    // Button controls
    const controls = document.createElement("div");
    controls.className = "editor-controls flex justify-between mt-2 p-2";

    const runButton = document.createElement("button");
    runButton.className =
      "bg-blue-600 text-gray-100 border-none rounded px-4 py-2 cursor-pointer hover:bg-blue-500";
    runButton.textContent = "Run Animation";
    runButton.addEventListener("click", () => {
      this.runCode();
    });

    const samplesWrapper = document.createElement("div");
    samplesWrapper.className = "flex items-center gap-2";

    const samplesLabel = document.createElement("span");
    samplesLabel.className = "text-sm";
    samplesLabel.textContent = "Examples:";

    const sampleMenu = document.createElement("select");
    sampleMenu.className =
      "bg-gray-700 text-gray-100 border border-gray-600 rounded p-2";

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
    lineNumbers.className =
      "line-numbers absolute left-0 top-0 w-8 h-full bg-gray-700 text-gray-500 font-mono text-sm text-right pr-1 overflow-y-hidden";

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

    const editorWrapper = document.getElementById("code-editor-wrapper");
    if (editorWrapper) {
      if (this.isVisible) {
        editorWrapper.classList.remove("hidden");
      } else {
        editorWrapper.classList.add("hidden");
      }
    }

    // Update toggle button state if there is one
    const button = document.querySelector(".code-editor-toggle");
    if (button) {
      button.classList.toggle("active", this.isVisible);
    }
  }

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
    notification.className = `fixed bottom-5 right-5 p-3 rounded shadow-lg z-50 font-sans text-sm opacity-0 transform translate-y-5 transition-opacity duration-300 transition-transform duration-300`;
    notification.textContent = message;

    if (type === "error") {
      notification.classList.add("bg-red-500", "text-white");
    } else if (type === "success") {
      notification.classList.add("bg-green-500", "text-white");
    } else {
      notification.classList.add("bg-blue-500", "text-white");
    }

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.remove("opacity-0", "translate-y-5");
      notification.classList.add("opacity-100", "translate-y-0");
    }, 10);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add("opacity-0", "translate-y-5");
      notification.classList.remove("opacity-100", "translate-y-0");

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

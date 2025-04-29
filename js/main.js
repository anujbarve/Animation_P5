let engine;
let uiManager;
let animAPI;

// Setup function for p5.js
function setup() {
    // Create canvas and add it to container
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    // Initialize animation engine
    engine = new AnimationEngine();
    engine.initialize();
    
    // Initialize UI manager
    uiManager = new UIManager(engine);
    engine.uiManager = uiManager;
    uiManager.initialize();
    
    // Initialize Animation API
    animAPI = new AnimationAPI(engine);
    
    // Set framerate
    frameRate(60);
}

// Draw loop for p5.js
function draw() {
    // Update engine and UI
    engine.update();
    engine.render();
    uiManager.update();
}

// Create sample objects for demonstration
function createSampleObjects() {
    // Add a few sample shapes
    const circle = new Circle(200, 300, 80);
    circle.fill = color(255, 100, 100);
    circle.name = "Red Circle";
    engine.addObject(circle);
    
    // Add animation to circle
    circle.addKeyframe('x', 0, 200, 'easeInOutCubic');
    circle.addKeyframe('x', 120, 600, 'easeInOutCubic');
    circle.addKeyframe('x', 240, 200, 'easeInOutCubic');
    
    circle.addKeyframe('y', 0, 300);
    circle.addKeyframe('y', 60, 200);
    circle.addKeyframe('y', 180, 400);
    circle.addKeyframe('y', 240, 300);
    
    const rect = new Rectangle(400, 300, 120, 80);
    rect.fill = color(100, 200, 255);
    rect.cornerRadius = 15;
    rect.name = "Blue Rectangle";
    engine.addObject(rect);
    
    // Add animation to rectangle
    rect.addKeyframe('rotation', 0, 0, 'easeInOutQuad');
    rect.addKeyframe('rotation', 120, 180, 'easeInOutQuad');
    rect.addKeyframe('rotation', 240, 360, 'easeInOutQuad');
    rect.addKeyframe('rotation', 360, 270, 'easeInOutQuad');
    
    const text = new Text(400, 150, "Animated Text");
    text.fontSize = 32;
    text.fill = color(255, 255, 100);
    text.name = "Title Text";
    engine.addObject(text);
    
    // Add animation to text
    text.addKeyframe('opacity', 0, 0, 'easeOutCubic');
    text.addKeyframe('opacity', 30, 255, 'easeOutCubic');
    text.addKeyframe('opacity', 210, 255, 'easeInCubic');
    text.addKeyframe('opacity', 240, 0, 'easeInCubic');
    
    // Select the circle to start
    engine.selectObject(circle);
}

// Handle window resize
function windowResized() {
    // Optionally resize canvas if needed
    // resizeCanvas(windowWidth, windowHeight);
    // engine.setCanvasSize(windowWidth, windowHeight);
}

// Prevent default behavior for some keyboard events
function keyPressed() {
    // Space bar
    if (keyCode === 32) {
        return false;
    }
}
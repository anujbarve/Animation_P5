## Usage Examples

Here are some examples of how to use the `FlowPath` class to create flowing connections between shapes:

### Basic Connection

```javascript
// Create two shapes to connect
const sourceShape = animation.createShape("rectangle", {
  x: 200,
  y: 300,
  width: 120,
  height: 80,
  fill: [50, 150, 255],
  cornerRadius: 10
});

const targetShape = animation.createShape("circle", {
  x: 500,
  y: 300,
  size: 100,
  fill: [255, 100, 100]
});

// Create a flow path between the shapes
const connection = new FlowPath(
  sourceShape.x + 60, // right side of source
  sourceShape.y,
  targetShape.x - 50, // left side of target
  targetShape.y
);

// Customize the connection
connection.stroke = color(100, 200, 150);
connection.strokeWeight = 3;
connection.pathStyle = "bezier"; // Try "wave", "step", or "arc"
connection.curveIntensity = 0.4;
connection.arrowEnd = true;
connection.arrowSize = 12;

// Add to engine
engine.addObject(connection);
```

### Using the connectShapes Method

```javascript
// Create two shapes
const source = animation.createShape("rectangle", {
  x: 200, y: 300, width: 120, height: 80, fill: [50, 150, 255]
});

const target = animation.createShape("diamond", {
  x: 500, y: 300, width: 100, height: 100, fill: [255, 100, 100]
});

// Create a flow path
const flowPath = new FlowPath(0, 0, 0, 0); // Initial coordinates will be set by connectShapes
flowPath.strokeWeight = 3;
flowPath.stroke = color(100, 200, 150);
flowPath.pathStyle = "wave";
flowPath.waveAmplitude = 15;
flowPath.waveFrequency = 2;

// Connect the shapes
flowPath.connectShapes(source, target, "right", "left");

// Add to engine
engine.addObject(flowPath);
```

### Animated Flow with Particles

```javascript
// Create a flowing connection with animated particles
const dataFlow = new FlowPath(200, 200, 500, 350);
dataFlow.stroke = color(50, 150, 255);
dataFlow.strokeWeight = 2;
dataFlow.pathStyle = "bezier";
dataFlow.curveIntensity = 0.5;
dataFlow.arrowEnd = true;

// Add flow particles
dataFlow.flowParticles = 10;         // Number of particles
dataFlow.particleSize = 6;           // Size of particles
dataFlow.fill = color(255, 255, 100); // Particle color
dataFlow.animationSpeed = 3;         // Speed of flow (0 = static)

// Add to engine
engine.addObject(dataFlow);
```

### Dashed/Dotted Line Styles

```javascript
// Create a dashed connection
const dashedConnection = new FlowPath(100, 400, 700, 400);
dashedConnection.stroke = color(200, 100, 255);
dashedConnection.strokeWeight = 2;
dashedConnection.pathStyle = "arc";
dashedConnection.curveIntensity = 0.3;
dashedConnection.lineStyle = "dashed"; // "solid", "dashed", "dotted"
dashedConnection.dashLength = 15;

// Add to engine
engine.addObject(dashedConnection);
```

### Animating a FlowPath

```javascript
// Create a flow path
const flowPath = new FlowPath(200, 200, 500, 300);
flowPath.stroke = color(50, 150, 255);
flowPath.pathStyle = "wave";
flowPath.waveAmplitude = 15;
flowPath.arrowEnd = true;

// Add to engine
engine.addObject(flowPath);

// Animate the flow using AnimationAPI
animation.animate(flowPath, "waveAmplitude", [
  { frame: 0, value: 5, easing: "easeInOutQuad" },
  { frame: 30, value: 25, easing: "easeInOutQuad" },
  { frame: 60, value: 5, easing: "easeInOutQuad" }
]);

animation.animate(flowPath, "animationSpeed", [
  { frame: 0, value: 0, easing: "linear" },
  { frame: 15, value: 4, easing: "easeOutQuad" },
  { frame: 90, value: 4, easing: "linear" },
  { frame: 105, value: 0, easing: "easeInQuad" }
]);
```

This `FlowPath` class provides a flexible way to create flowing connections between shapes with various styles and animated effects. It's perfect for data flow diagrams, process visualizations, and interactive relationship mapping.
# AnimationAPI Documentation

The `AnimationAPI` provides a high-level interface for creating and manipulating animations programmatically in the p5.js Animation Platform. This API simplifies the process of creating complex animations with minimal code.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Creating Shapes](#creating-shapes)
- [Animation Methods](#animation-methods)
- [Special Effects](#special-effects)
- [Group Animations](#group-animations)
- [Playback Control](#playback-control)
- [Examples](#examples)

## Basic Usage

```javascript
// Create a new animation API instance
const animAPI = new AnimationAPI(engine);

// Clear any existing objects
animAPI.clearAll();

// Create a circle
const circle = animAPI.createShape('circle', {
    x: 400,
    y: 300,
    size: 100,
    fill: color(255, 0, 0)
});

// Add a horizontal movement animation
animAPI.animate(circle, 'x', [
    {frame: 0, value: 400},
    {frame: 60, value: 600, easing: 'easeInOutQuad'},
    {frame: 120, value: 400, easing: 'easeInOutQuad'}
]);

// Play the animation
animAPI.play();
```

## Creating Shapes

### createShape(type, props)
Creates a new shape with the specified properties and adds it to the animation engine.

**Parameters:**
- `type` (String): Shape type: 'circle', 'rectangle', 'text', or 'path'
- `props` (Object): Properties for the shape

**Returns:** The created shape object

**Common Props for All Shapes:**
- `x` (Number): X position (defaults to canvas center)
- `y` (Number): Y position (defaults to canvas center)
- `fill` (p5.Color): Fill color
- `stroke` (p5.Color): Stroke color
- `strokeWeight` (Number): Stroke thickness
- `opacity` (Number): Opacity (0-255)
- `rotation` (Number): Rotation in degrees
- `name` (String): Identifying name for the shape

**Shape-Specific Props:**

Circle:
- `size` (Number): Diameter of the circle (defaults to 100)

Rectangle:
- `width` (Number): Width of rectangle (defaults to 100)
- `height` (Number): Height of rectangle (defaults to 80)
- `cornerRadius` (Number): Corner radius for rounded rectangles

Text:
- `text` (String): Text content (defaults to "Text")
- `fontSize` (Number): Font size
- `fontFamily` (String): Font family

Path:
- `points` (Array): Array of {x, y} points
- `closed` (Boolean): Whether the path is closed

**Example:**
```javascript
// Create a rounded rectangle
const rect = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 200,
    height: 100,
    cornerRadius: 20,
    fill: color(100, 150, 255),
    name: "My Rectangle"
});
```

## Animation Methods

### animate(shape, property, keyframes, easingType)
Animates a property of a shape using multiple keyframes.

**Parameters:**
- `shape` (Object): The shape to animate
- `property` (String): Property name to animate (e.g., 'x', 'y', 'rotation', 'width')
- `keyframes` (Array): Array of keyframe objects {frame, value, easing}
- `easingType` (String, optional): Default easing function (defaults to 'easeInOutCubic')

**Returns:** The shape object (for chaining)

**Example:**
```javascript
animAPI.animate(circle, 'x', [
    {frame: 0, value: 100},
    {frame: 30, value: 500, easing: 'easeOutQuad'},
    {frame: 60, value: 300, easing: 'easeInQuad'}
]);
```

### fadeIn(shape, startFrame, duration, easing)
Creates a fade-in animation.

**Parameters:**
- `shape` (Object): The shape to fade in
- `startFrame` (Number, optional): Starting frame (defaults to 0)
- `duration` (Number, optional): Duration in frames (defaults to 30)
- `easing` (String, optional): Easing function (defaults to 'easeOutCubic')

**Returns:** The shape object (for chaining)

### fadeOut(shape, startFrame, duration, easing)
Creates a fade-out animation.

**Parameters:**
- `shape` (Object): The shape to fade out
- `startFrame` (Number): Starting frame
- `duration` (Number, optional): Duration in frames (defaults to 30)
- `easing` (String, optional): Easing function (defaults to 'easeInCubic')

**Returns:** The shape object (for chaining)

### moveFromTo(shape, startFrame, endFrame, fromX, fromY, toX, toY, easing)
Animates a shape from one position to another.

**Parameters:**
- `shape` (Object): The shape to move
- `startFrame` (Number): Starting frame
- `endFrame` (Number): Ending frame
- `fromX` (Number): Starting X position
- `fromY` (Number): Starting Y position
- `toX` (Number): Ending X position
- `toY` (Number): Ending Y position
- `easing` (String, optional): Easing function (defaults to 'easeInOutCubic')

**Returns:** The shape object (for chaining)

### scale(shape, startFrame, endFrame, fromScale, toScale, easing)
Creates a scaling animation.

**Parameters:**
- `shape` (Object): The shape to scale
- `startFrame` (Number): Starting frame
- `endFrame` (Number): Ending frame
- `fromScale` (Number): Starting scale
- `toScale` (Number): Ending scale
- `easing` (String, optional): Easing function (defaults to 'easeInOutQuad')

**Returns:** The shape object (for chaining)

### rotate(shape, startFrame, endFrame, fromAngle, toAngle, easing)
Animates the rotation of a shape.

**Parameters:**
- `shape` (Object): The shape to rotate
- `startFrame` (Number): Starting frame
- `endFrame` (Number): Ending frame
- `fromAngle` (Number): Starting angle in degrees
- `toAngle` (Number): Ending angle in degrees
- `easing` (String, optional): Easing function (defaults to 'easeInOutCubic')

**Returns:** The shape object (for chaining)

### followPath(shape, path, startFrame, endFrame, easing)
Makes a shape follow a path animation.

**Parameters:**
- `shape` (Object): The shape to animate
- `path` (Array): Array of {x, y} points defining the path
- `startFrame` (Number): Starting frame
- `endFrame` (Number): Ending frame
- `easing` (String, optional): Easing function (defaults to 'linear')

**Returns:** The shape object (for chaining)

## Special Effects

### pulse(shape, startFrame, count, duration, minScale, maxScale, easing)
Creates a pulsing animation that scales up and down.

**Parameters:**
- `shape` (Object): The shape to pulse
- `startFrame` (Number): Starting frame
- `count` (Number, optional): Number of pulses (defaults to 3)
- `duration` (Number, optional): Total duration in frames (defaults to 60)
- `minScale` (Number, optional): Minimum scale factor (defaults to 0.8)
- `maxScale` (Number, optional): Maximum scale factor (defaults to 1.2)
- `easing` (String, optional): Easing function (defaults to 'easeInOutQuad')

**Returns:** The shape object (for chaining)

### typeText(textObj, startFrame, text, duration, easing)
Creates a typing animation for text objects.

**Parameters:**
- `textObj` (Text): The text object to animate
- `startFrame` (Number): Starting frame
- `text` (String): The text to type
- `duration` (Number, optional): Duration in frames (defaults to 60)
- `easing` (String, optional): Easing function (defaults to 'linear')

**Returns:** The text object (for chaining)

### createParticleSystem(x, y, count, options)
Creates a particle system at the specified position.

**Parameters:**
- `x` (Number): X position of the particle emitter
- `y` (Number): Y position of the particle emitter
- `count` (Number, optional): Number of particles (defaults to 20)
- `options` (Object, optional): Configuration options:
  - `type` (String): Particle shape type (defaults to 'circle')
  - `size` (Number): Particle size (defaults to 10)
  - `color` (Array): RGB color array (defaults to [255, 255, 255])
  - `duration` (Number): Animation duration (defaults to 60)
  - `spread` (Number): Maximum distance particles travel (defaults to 200)
  - `easing` (String): Movement easing (defaults to 'easeOutCubic')
  - `scaleDown` (Boolean): Whether particles should shrink (defaults to false)

**Returns:** Array of particle objects

## Group Animations

### createGroup(count, type, baseProps, arrangement)
Creates a group of shapes arranged in a pattern.

**Parameters:**
- `count` (Number): Number of shapes to create
- `type` (String): Shape type ('circle', 'rectangle', etc.)
- `baseProps` (Object, optional): Base properties for all shapes
- `arrangement` (String, optional): Arrangement pattern:
  - 'circle': Arranged in a circle (default)
  - 'grid': Arranged in a grid
  - 'line': Arranged in a horizontal line

**Additional BaseProps for Arrangements:**
- `centerX` (Number): Center X position (defaults to canvas center)
- `centerY` (Number): Center Y position (defaults to canvas center)
- `radius` (Number): Radius/size of arrangement (defaults to 150)

**Returns:** Array of created shapes

### animateGroup(group, property, keyframes, staggerFrames, easingType)
Animates a property of all shapes in a group with staggered timing.

**Parameters:**
- `group` (Array): Array of shapes to animate
- `property` (String): Property to animate
- `keyframes` (Array): Array of keyframe objects
- `staggerFrames` (Number, optional): Frames to stagger between objects (defaults to 5)
- `easingType` (String, optional): Default easing function (defaults to 'easeInOutCubic')

**Returns:** The group array (for chaining)

### waveEffect(group, property, startFrame, duration, minValue, maxValue, easing)
Creates a wave effect animation on a group of shapes.

**Parameters:**
- `group` (Array): Array of shapes
- `property` (String): Property to animate
- `startFrame` (Number): Starting frame
- `duration` (Number): Total duration in frames
- `minValue` (Number): Minimum property value
- `maxValue` (Number): Maximum property value
- `easing` (String, optional): Easing function (defaults to 'easeInOutSine')

**Returns:** The group array (for chaining)

## Playback Control

### clearAll()
Removes all objects and resets the animation.

**Returns:** The AnimationAPI instance (for chaining)

### setDuration(seconds)
Sets the total animation duration in seconds.

**Parameters:**
- `seconds` (Number): Duration in seconds

**Returns:** The AnimationAPI instance (for chaining)

### setFPS(fps)
Sets the animation framerate.

**Parameters:**
- `fps` (Number): Frames per second

**Returns:** The AnimationAPI instance (for chaining)

### reset()
Resets the animation to the beginning (frame 0).

**Returns:** The AnimationAPI instance (for chaining)

### play()
Starts playing the animation.

**Returns:** The AnimationAPI instance (for chaining)

## Examples

### 1. Bouncing Ball Animation

```javascript
// Create a bouncing ball animation
animAPI.clearAll();
animAPI.setFPS(30);
animAPI.setDuration(5);

// Create a ball
const ball = animAPI.createShape('circle', {
    x: 400,
    y: 100,
    size: 80,
    fill: color(255, 100, 100),
    name: "Bouncing Ball"
});

// Create a floor
const floor = animAPI.createShape('rectangle', {
    x: 400,
    y: 550,
    width: 800,
    height: 20,
    fill: color(100, 100, 100),
    name: "Floor"
});

// Set up path for bouncing
const path = [
    {x: 400, y: 100},
    {x: 400, y: 500},
    {x: 400, y: 200},
    {x: 400, y: 500},
    {x: 400, y: 300},
    {x: 400, y: 500}
];

// Animate along the path
animAPI.followPath(ball, path, 0, 150, 'easeOutBounce');

// Add squash and stretch
animAPI.animate(ball, 'width', [
    {frame: 30, value: 80},
    {frame: 40, value: 100, easing: 'easeInCubic'},
    {frame: 45, value: 60, easing: 'easeOutCubic'},
    {frame: 50, value: 80, easing: 'easeInOutCubic'},
    {frame: 90, value: 80},
    {frame: 100, value: 100, easing: 'easeInCubic'},
    {frame: 105, value: 60, easing: 'easeOutCubic'},
    {frame: 110, value: 80, easing: 'easeInOutCubic'}
]);

animAPI.play();
```

### 2. Text Typing with Cursor

```javascript
animAPI.clearAll();
animAPI.setDuration(8);

// Background
const bg = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 600,
    height: 200,
    fill: color(40, 40, 40),
    cornerRadius: 10
});

// Create text with typing effect
const text = animAPI.createShape('text', {
    x: 400,
    y: 300,
    text: "",
    fontSize: 24,
    fill: color(50, 255, 50)
});

// Generate the typing effect
animAPI.typeText(text, 10, "console.log('Animation complete!');", 120);

// Create blinking cursor
const cursor = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 2,
    height: 24,
    fill: color(50, 255, 50)
});

// Make cursor blink and follow text
for (let i = 0; i < 12; i++) {
    cursor.addKeyframe('opacity', i * 15, i % 2 === 0 ? 255 : 0);
}

animAPI.play();
```

### 3. Particle Explosion

```javascript
animAPI.clearAll();
animAPI.setFPS(30);
animAPI.setDuration(4);

// Create particle system
animAPI.createParticleSystem(400, 300, 50, {
    type: 'circle',
    size: 15,
    color: [255, 200, 50],
    duration: 90,
    spread: 300,
    easing: 'easeOutCubic',
    scaleDown: true
});

// Add title that scales up
const title = animAPI.createShape('text', {
    x: 400,
    y: 300,
    text: "BOOM!",
    fontSize: 10,
    fill: color(255, 100, 50)
});

// Animate title
animAPI.animate(title, 'fontSize', [
    {frame: 0, value: 10, easing: 'easeOutElastic'},
    {frame: 20, value: 72, easing: 'easeOutElastic'}
]);

animAPI.play();
```

### 4. Wave Animation

```javascript
animAPI.clearAll();
animAPI.setDuration(5);

// Create a row of circles
const circles = animAPI.createGroup(15, 'circle', {
    size: 30,
    fill: color(100, 200, 255),
    centerY: 300,
    arrangement: 'line',
    radius: 300  // Controls the length of the line
});

// Create wave effect
animAPI.waveEffect(circles, 'y', 0, 120, 250, 350);

// Add color transition
circles.forEach((circle, index) => {
    animAPI.animate(circle, 'fill', [
        { 
            frame: index * 5, 
            value: color(100, 150, 255) 
        },
        { 
            frame: index * 5 + 60, 
            value: color(255, 100, 150) 
        },
        { 
            frame: index * 5 + 120, 
            value: color(100, 150, 255) 
        }
    ]);
});

animAPI.play();
```

### 5. Logo Reveal Animation

```javascript
animAPI.clearAll();
animAPI.setDuration(5);

// Create background
const bg = animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 800,
    height: 600,
    fill: color(30, 30, 40)
});

// Create logo elements
const circle = animAPI.createShape('circle', {
    x: 400,
    y: 300,
    size: 0,
    fill: color(0, 120, 255, 200),
    name: "Logo Circle"
});

const ring = animAPI.createShape('circle', {
    x: 400,
    y: 300,
    size: 0,
    fill: color(0, 0, 0, 0),  // Transparent fill
    stroke: color(0, 180, 255),
    strokeWeight: 10,
    name: "Logo Ring"
});

const logoText = animAPI.createShape('text', {
    x: 400,
    y: 300,
    text: "ANIM8",
    fontSize: 64,
    fill: color(255, 255, 255, 0),  // Start transparent
    name: "Logo Text"
});

// Animate circle growing
animAPI.animate(circle, 'size', [
    {frame: 10, value: 0, easing: 'easeOutBack'},
    {frame: 40, value: 200, easing: 'easeOutBack'}
]);

// Animate ring appearing slightly later
animAPI.animate(ring, 'size', [
    {frame: 20, value: 0, easing: 'easeOutElastic'},
    {frame: 60, value: 250, easing: 'easeOutElastic'}
]);

// Fade in and scale up the logo text
animAPI.animate(logoText, 'fontSize', [
    {frame: 30, value: 40, easing: 'easeOutExpo'},
    {frame: 70, value: 64, easing: 'easeOutExpo'}
]);

animAPI.animate(logoText, 'fill', [
    {frame: 30, value: color(255, 255, 255, 0)},
    {frame: 70, value: color(255, 255, 255, 255)}
]);

animAPI.play();
```

### 6. Interactive Chart Animation

```javascript
animAPI.clearAll();
animAPI.setDuration(6);

// Data to visualize
const data = [28, 45, 65, 32, 78, 50, 42, 60];
const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

// Background
animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 800,
    height: 600,
    fill: color(240, 240, 245)
});

// Title
const title = animAPI.createShape('text', {
    x: 400,
    y: 80,
    text: "Monthly Performance",
    fontSize: 32,
    fill: color(50, 50, 70),
    name: "Chart Title"
});

// Fade in title
animAPI.fadeIn(title, 0, 20);

// Create bars with animation
for (let i = 0; i < data.length; i++) {
    // Bar
    const bar = animAPI.createShape('rectangle', {
        x: 150 + i * 70,
        y: 500,
        width: 40,
        height: 1,  // Start with minimal height
        fill: color(70 + i * 20, 100, 180),
        name: `Bar ${i}`
    });
    
    // Animate height and position
    animAPI.animate(bar, 'height', [
        {frame: i * 5, value: 1, easing: 'easeOutExpo'},
        {frame: i * 5 + 30, value: data[i] * 4, easing: 'easeOutExpo'}
    ]);
    
    animAPI.animate(bar, 'y', [
        {frame: i * 5, value: 500, easing: 'easeOutExpo'},
        {frame: i * 5 + 30, value: 500 - data[i] * 2, easing: 'easeOutExpo'}
    ]);
    
    // Label
    const label = animAPI.createShape('text', {
        x: 150 + i * 70,
        y: 520,
        text: labels[i],
        fontSize: 14,
        fill: color(70, 70, 90, 0),  // Start transparent
        name: `Label ${i}`
    });
    
    // Fade in label
    animAPI.fadeIn(label, i * 5 + 20, 15);
    
    // Value label
    const value = animAPI.createShape('text', {
        x: 150 + i * 70,
        y: 480 - data[i] * 2,
        text: data[i].toString(),
        fontSize: 14,
        fill: color(50, 50, 70, 0),  // Start transparent
        name: `Value ${i}`
    });
    
    // Fade in value
    animAPI.fadeIn(value, i * 5 + 35, 10);
}

animAPI.play();
```

### 7. Circular Progress Indicator

```javascript
animAPI.clearAll();
animAPI.setDuration(5);

// Create background
animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 800,
    height: 600,
    fill: color(40, 40, 50)
});

// Create progress path (full circle)
const path = [];
const radius = 120;
const center = {x: 400, y: 300};
const segments = 36;

for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2 - Math.PI/2; // Start from top
    path.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
    });
}

// Create progress indicator
const indicator = animAPI.createShape('circle', {
    x: path[0].x,
    y: path[0].y,
    size: 30,
    fill: color(50, 200, 100),
    name: "Progress Indicator"
});

// Make indicator follow the path
animAPI.followPath(indicator, path, 0, 120);

// Create percentage text
const percentText = animAPI.createShape('text', {
    x: center.x,
    y: center.y,
    text: "0%",
    fontSize: 48,
    fill: color(255, 255, 255),
    name: "Percentage"
});

// Update percentage as animation progresses
for (let i = 0; i <= 100; i += 5) {
    const frame = Math.round(i * 1.2); // 120 frames total
    animAPI.animate(percentText, 'text', [
        {frame: frame, value: `${i}%`}
    ]);
}

// Create a trail effect
for (let i = 0; i < 10; i++) {
    const trailDot = animAPI.createShape('circle', {
        x: path[0].x,
        y: path[0].y,
        size: 20 - i*2,
        fill: color(50, 200, 100, 150 - i*15),
        name: `Trail_${i}`
    });
    
    // Follow the same path with delay
    const delayedPath = [...path];
    animAPI.followPath(trailDot, delayedPath, i*3, 120 + i*3);
}

animAPI.play();
```

### 8. Simulating Physics

```javascript
animAPI.clearAll();
animAPI.setDuration(8);
animAPI.setFPS(60);

// Create background
animAPI.createShape('rectangle', {
    x: 400,
    y: 300,
    width: 800,
    height: 600,
    fill: color(230, 240, 250)
});

// Create a pendulum with a string and ball
const pendulumOrigin = {x: 400, y: 100};
const stringLength = 200;

// String (represented as a rectangle for simplicity)
const string = animAPI.createShape('rectangle', {
    x: pendulumOrigin.x,
    y: pendulumOrigin.y + stringLength/2,
    width: 2,
    height: stringLength,
    fill: color(50, 50, 50),
    name: "Pendulum String"
});

// Pendulum weight
const weight = animAPI.createShape('circle', {
    x: pendulumOrigin.x,
    y: pendulumOrigin.y + stringLength,
    size: 50,
    fill: color(100, 150, 200),
    stroke: color(50, 100, 150),
    strokeWeight: 2,
    name: "Pendulum Weight"
});

// Create swinging motion
// We'll use sin function to create the natural pendulum motion
const numFrames = 240; // 4 seconds at 60fps
const keyframes = [];
const angleKeyframes = [];

// Calculate pendulum positions using physics-like formulas
for (let frame = 0; frame <= numFrames; frame++) {
    const t = frame / 60; // Time in seconds
    const angle = Math.PI/6 * Math.sin(2 * t - Math.PI/2); // Max angle ±30°
    
    // Calculate position
    const x = pendulumOrigin.x + Math.sin(angle) * stringLength;
    const y = pendulumOrigin.y + Math.cos(angle) * stringLength;
    
    // Add keyframes for the weight position
    keyframes.push({frame: frame, value: x, easing: 'linear'});
    angleKeyframes.push({frame: frame, value: angle * 180/Math.PI, easing: 'linear'});
}

// Apply animations
animAPI.animate(weight, 'x', keyframes);
animAPI.animate(weight, 'y', [
    ...Array(numFrames + 1).fill(0).map((_, i) => {
        const t = i / 60;
        const angle = Math.PI/6 * Math.sin(2 * t - Math.PI/2);
        return {
            frame: i,
            value: pendulumOrigin.y + Math.cos(angle) * stringLength,
            easing: 'linear'
        };
    })
]);

// Animate the string's angle and position
animAPI.animate(string, 'rotation', angleKeyframes);
// Update string position to follow pendulum
animAPI.animate(string, 'x', keyframes);
// Keep the string attached to the pendulum origin
animAPI.animate(string, 'y', [
    ...Array(numFrames + 1).fill(0).map((_, i) => {
        const t = i / 60;
        const angle = Math.PI/6 * Math.sin(2 * t - Math.PI/2);
        const weightY = pendulumOrigin.y + Math.cos(angle) * stringLength;
        return {
            frame: i,
            value: (pendulumOrigin.y + weightY) / 2,
            easing: 'linear'
        };
    })
]);

animAPI.play();
```

## Available Easing Functions

The API supports various easing functions to control the motion dynamics:

- **Linear**: `linear`
- **Quadratic**: `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- **Cubic**: `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- **Quartic**: `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- **Quintic**: `easeInQuint`, `easeOutQuint`, `easeInOutQuint`
- **Sinusoidal**: `easeInSine`, `easeOutSine`, `easeInOutSine`
- **Exponential**: `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
- **Circular**: `easeInCirc`, `easeOutCirc`, `easeInOutCirc`
- **Elastic**: `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- **Back**: `easeInBack`, `easeOutBack`, `easeInOutBack`
- **Bounce**: `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

For detailed visualization of these easing functions, visit [easings.net](https://easings.net/).

## Best Practices

1. **Clear Before Creating**: Always start with `clearAll()` to reset the animation state.
2. **Set Duration and FPS Early**: Use `setDuration()` and `setFPS()` at the beginning to establish animation timing.
3. **Chain Methods**: Most methods return the original object, allowing for method chaining.
4. **Use Consistent Naming**: Name your objects descriptively for easier management.
5. **Group Related Objects**: Use `createGroup()` for sets of related objects.
6. **Test Different Easings**: The right easing function can dramatically improve an animation's feel.
7. **Combine Simple Animations**: Create complex effects by combining multiple simple animations.

---

This API aims to simplify the creation of complex animations while providing fine-grained control when needed. Explore the examples and experiment with different combinations to create your own unique animations.
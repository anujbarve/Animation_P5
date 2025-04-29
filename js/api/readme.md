# AnimationAPI Documentation

An extensive JavaScript animation library for creating and manipulating animated shapes and effects in a canvas environment.

## Table of Contents

- [AnimationAPI Documentation](#animationapi-documentation)
  - [Table of Contents](#table-of-contents)
  - [Constructor](#constructor)
  - [Shape Management](#shape-management)
    - [createShape](#createshape)
  - [Basic Animation](#basic-animation)
    - [animate](#animate)
    - [animateMultiple](#animatemultiple)
    - [clearAnimation](#clearanimation)
    - [clearAllAnimations](#clearallanimations)
  - [Movement Animations](#movement-animations)
    - [moveFromTo](#movefromto)
    - [moveTo](#moveto)
    - [followPath](#followpath)
  - [Transformation Animations](#transformation-animations)
    - [scale](#scale)
    - [scaleTo](#scaleto)
    - [rotate](#rotate)
    - [spin](#spin)
    - [morph](#morph)
  - [Visual Effects](#visual-effects)
    - [fadeIn](#fadein)
    - [fadeOut](#fadeout)
    - [crossFade](#crossfade)
    - [pulse](#pulse)
    - [colorCycle](#colorcycle)
    - [flash](#flash)
    - [transition](#transition)
  - [Particle Systems](#particle-systems)
    - [createParticleSystem](#createparticlesystem)
    - [createEmitter](#createemitter)
  - [Camera Effects](#camera-effects)
    - [cameraShake](#camerashake)
    - [zoom](#zoom)
  - [Group Animations](#group-animations)
    - [createGroup](#creategroup)
    - [animateGroup](#animategroup)
    - [animateGroupMultiple](#animategroupmultiple)
    - [waveEffect](#waveeffect)
    - [pulseGroup](#pulsegroup)
  - [Text Animations](#text-animations)
    - [typeText](#typetext)
  - [Sequence Management](#sequence-management)
    - [defineSequence](#definesequence)
    - [applySequence](#applysequence)
    - [applyPreset](#applypreset)
    - [addFrameAction](#addframeaction)
  - [Playback Controls](#playback-controls)
    - [play](#play)
    - [pause](#pause)
    - [reset](#reset)
    - [setDuration](#setduration)
    - [setFPS](#setfps)
    - [clearAll](#clearall)
  - [Project Management](#project-management)
    - [export](#export)
    - [saveProject](#saveproject)
    - [loadProject](#loadproject)
    - [setBackgroundColor](#setbackgroundcolor)
  - [Advanced Usage Examples](#advanced-usage-examples)
    - [Creating and Animating a Simple Shape](#creating-and-animating-a-simple-shape)
    - [Creating a Particle Effect](#creating-a-particle-effect)
    - [Creating a Complex Scene with Camera Effects](#creating-a-complex-scene-with-camera-effects)
- [AnimationAPI Documentation (Continued)](#animationapi-documentation-continued)
  - [Advanced Usage Examples (Continued)](#advanced-usage-examples-continued)
    - [Creating and Animating a Group](#creating-and-animating-a-group)
    - [Morphing Between Shapes](#morphing-between-shapes)
    - [Creating Text Animation](#creating-text-animation)
    - [Using Custom Animation Sequences](#using-custom-animation-sequences)
    - [Creating a Complex Transition](#creating-a-complex-transition)
    - [Using Particle Systems for Special Effects](#using-particle-systems-for-special-effects)
    - [Creating Camera Effects](#creating-camera-effects)
  - [Best Practices](#best-practices)
    - [Performance Optimization](#performance-optimization)
    - [Animation Timing](#animation-timing)
    - [Code Organization](#code-organization)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging Tools](#debugging-tools)
  - [Integration with Other Systems](#integration-with-other-systems)

## Constructor

```javascript
const animation = new AnimationAPI(engine);
```

Initializes a new AnimationAPI instance with the specified rendering engine.

**Parameters:**
- `engine`: The rendering engine that will handle the animation

## Shape Management

### createShape

```javascript
const shape = animation.createShape(type, props);
```

Creates a new shape of the specified type with the given properties.

**Parameters:**
- `type`: Type of shape to create ("circle", "rectangle", "rect", "text", "path")
- `props`: Object containing properties for the shape

**Returns:** The created shape

**Example:**
```javascript
const circle = animation.createShape("circle", {
  x: 100,
  y: 100,
  size: 50,
  fill: [255, 0, 0]
});
```

**Common Properties:**
- `x`, `y`: Position coordinates
- `fill`: Fill color (string, array, or color object)
- `stroke`: Stroke color
- `strokeWeight`: Width of stroke
- `opacity`: Transparency (0-255)
- `rotation`: Rotation in degrees
- `visible`: Whether the shape is visible

**Shape-Specific Properties:**
- Circle: `size` or `diameter`
- Rectangle: `width`, `height`, `cornerRadius`
- Text: `text`, `fontSize`, `fontFamily`, `textAlign`, `textStyle`
- Path: `points` (array of {x, y} coordinates), `closed` (boolean)

## Basic Animation

### animate

```javascript
animation.animate(shape, property, keyframes, easingType);
```

Animates a property of a shape with multiple keyframes.

**Parameters:**
- `shape`: Shape to animate
- `property`: Property to animate (e.g., "x", "y", "opacity")
- `keyframes`: Array of keyframe objects `{frame, value, easing}`
- `easingType`: Default easing type (e.g., "easeInOutCubic")

**Returns:** The shape for chaining

**Example:**
```javascript
animation.animate(circle, "opacity", [
  { frame: 0, value: 0 },
  { frame: 30, value: 255 },
  { frame: 60, value: 0 }
], "easeInOutQuad");
```

### animateMultiple

```javascript
animation.animateMultiple(shape, propertyMap, defaultEasing);
```

Animates multiple properties of a shape at once.

**Parameters:**
- `shape`: Shape to animate
- `propertyMap`: Object mapping properties to keyframe arrays
- `defaultEasing`: Default easing type for all animations

**Returns:** The shape for chaining

**Example:**
```javascript
animation.animateMultiple(circle, {
  "x": [
    { frame: 0, value: 100 },
    { frame: 60, value: 300 }
  ],
  "y": [
    { frame: 0, value: 100 },
    { frame: 60, value: 200 }
  ]
}, "easeOutQuad");
```

### clearAnimation

```javascript
animation.clearAnimation(shape, property);
```

Removes all keyframes for a property.

**Parameters:**
- `shape`: Shape to modify
- `property`: Property to clear animations for

**Returns:** The shape for chaining

### clearAllAnimations

```javascript
animation.clearAllAnimations(shape);
```

Clears all animations on a shape.

**Parameters:**
- `shape`: Shape to clear animations from

**Returns:** The shape for chaining

## Movement Animations

### moveFromTo

```javascript
animation.moveFromTo(shape, startFrame, endFrame, fromX, fromY, toX, toY, easing);
```

Moves a shape from one position to another.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `endFrame`: Ending frame
- `fromX`: Start X position
- `fromY`: Start Y position
- `toX`: End X position
- `toY`: End Y position
- `easing`: Easing function (default: "easeInOutCubic")

**Returns:** The shape for chaining

### moveTo

```javascript
animation.moveTo(shape, startFrame, duration, toX, toY, easing);
```

Moves a shape from its current position to a target position.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `toX`: Target X position
- `toY`: Target Y position
- `easing`: Easing function (default: "easeInOutCubic")

**Returns:** The shape for chaining

### followPath

```javascript
animation.followPath(shape, path, startFrame, endFrame, easing, orientToPath);
```

Makes a shape follow a path.

**Parameters:**
- `shape`: Shape to animate
- `path`: Array of points `{x, y}`
- `startFrame`: Starting frame
- `endFrame`: Ending frame
- `easing`: Easing function (default: "linear")
- `orientToPath`: Whether the shape should rotate to follow the path (default: false)

**Returns:** The shape for chaining

## Transformation Animations

### scale

```javascript
animation.scale(shape, startFrame, endFrame, fromScale, toScale, easing);
```

Scales a shape.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `endFrame`: Ending frame
- `fromScale`: Starting scale factor
- `toScale`: Ending scale factor
- `easing`: Easing function (default: "easeInOutQuad")

**Returns:** The shape for chaining

### scaleTo

```javascript
animation.scaleTo(shape, startFrame, duration, targetWidth, targetHeight, easing);
```

Scales a shape to specific dimensions.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `targetWidth`: Target width
- `targetHeight`: Target height (optional, maintains aspect ratio if not specified)
- `easing`: Easing function (default: "easeInOutQuad")

**Returns:** The shape for chaining

### rotate

```javascript
animation.rotate(shape, startFrame, endFrame, fromAngle, toAngle, easing);
```

Rotates a shape from one angle to another.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `endFrame`: Ending frame
- `fromAngle`: Starting angle in degrees
- `toAngle`: Ending angle in degrees
- `easing`: Easing function (default: "easeInOutCubic")

**Returns:** The shape for chaining

### spin

```javascript
animation.spin(shape, startFrame, duration, revolutions, clockwise, easing);
```

Creates a continuous rotation animation.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `revolutions`: Number of full revolutions (default: 1)
- `clockwise`: Direction of rotation (default: true)
- `easing`: Easing function (default: "linear")

**Returns:** The shape for chaining

### morph

```javascript
animation.morph(fromShape, toShape, startFrame, duration, easing);
```

Creates a morph animation between two shapes.

**Parameters:**
- `fromShape`: Starting shape
- `toShape`: Target shape
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `easing`: Easing function (default: "easeInOutCubic")

**Returns:** The morphed shape

## Visual Effects

### fadeIn

```javascript
animation.fadeIn(shape, startFrame, duration, easing);
```

Creates a fade-in animation.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame (default: 0)
- `duration`: Duration in frames (default: 30)
- `easing`: Easing function (default: "easeOutCubic")

**Returns:** The shape for chaining

### fadeOut

```javascript
animation.fadeOut(shape, startFrame, duration, easing);
```

Creates a fade-out animation.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames (default: 30)
- `easing`: Easing function (default: "easeInCubic")

**Returns:** The shape for chaining

### crossFade

```javascript
animation.crossFade(shapeOut, shapeIn, startFrame, duration, easing);
```

Creates a cross-fade between two shapes.

**Parameters:**
- `shapeOut`: Shape to fade out
- `shapeIn`: Shape to fade in
- `startFrame`: Starting frame
- `duration`: Duration in frames (default: 30)
- `easing`: Easing function (default: "easeInOutCubic")

**Returns:** Array of the two shapes

### pulse

```javascript
animation.pulse(shape, startFrame, count, duration, minScale, maxScale, easing);
```

Creates a pulsing animation (scale up and down).

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `count`: Number of pulses (default: 3)
- `duration`: Duration in frames (default: 60)
- `minScale`: Minimum scale factor (default: 0.8)
- `maxScale`: Maximum scale factor (default: 1.2)
- `easing`: Easing function (default: "easeInOutQuad")

**Returns:** The shape for chaining

### colorCycle

```javascript
animation.colorCycle(shape, startFrame, duration, colors, property, easing);
```

Creates a color cycling animation.

**Parameters:**
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `colors`: Array of colors to cycle through
- `property`: Property to animate ('fill' or 'stroke', default: 'fill')
- `easing`: Easing function (default: "linear")

**Returns:** The shape for chaining

### flash

```javascript
animation.flash(startFrame, count, duration, color);
```

Creates a flashing effect (for lightning, etc.).

**Parameters:**
- `startFrame`: Starting frame
- `count`: Number of flashes (default: 1)
- `duration`: Duration in frames (default: 10)
- `color`: Flash color (default: [255, 255, 255])

**Returns:** The flash object

### transition

```javascript
animation.transition(startFrame, duration, type, options);
```

Creates a scene transition effect.

**Parameters:**
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `type`: Transition type ('fade', 'wipe', 'iris', 'dissolve', default: 'fade')
- `options`: Transition options (color, direction, onTransition callback)

**Returns:** The transition shape

## Particle Systems

### createParticleSystem

```javascript
animation.createParticleSystem(x, y, count, options);
```

Creates a particle system.

**Parameters:**
- `x`: X position of emitter
- `y`: Y position of emitter
- `count`: Number of particles (default: 20)
- `options`: Particle system options

**Options:**
- `type`: Type of particles (default: "circle")
- `size`: Particle size (default: 10)
- `sizeVariation`: Random size variation (default: 0)
- `colorStart`: Starting color (default: [255, 255, 255])
- `colorEnd`: Ending color (optional)
- `duration`: Particle lifespan in frames (default: 60)
- `durationVariation`: Random duration variation (default: 0)
- `spread`: Spread distance (default: 200)
- `spreadX`, `spreadY`: Independent X/Y spread
- `radialSpread`: Use radial distribution if true
- `gravity`: Gravity effect (default: 0)
- `startFrame`: Starting frame (default: 0)
- `emitRate`: Emission rate (default: 0, all at once)
- `opacityStart`: Starting opacity (default: 255)
- `opacityEnd`: Ending opacity (default: 0)
- `scaleDown`: Whether particles should scale down (default: false)
- `endScale`: Final scale if scaling down (default: 0.2)
- `rotation`: Whether particles should rotate (default: false)
- `startRotation`, `endRotation`: Rotation angles if rotating

**Returns:** Array of particle objects

### createEmitter

```javascript
animation.createEmitter(x, y, options);
```

Creates a continuous particle emitter.

**Parameters:**
- `x`: X position of emitter
- `y`: Y position of emitter
- `options`: Emitter options

**Options:**
- `rate`: Particles per second (default: 5)
- `duration`: Emitter duration in frames (default: -1, indefinite)
- `particleLifespan`: Lifespan of each particle in frames (default: 60)
- `particleCount`: Maximum number of particles (default: 100)
- `particleSize`: Size of particles (default: 10)
- `spread`: Spread of particles (default: 100)
- `type`: Type of particles (default: "circle")
- `color`: Particle color (default: [255, 255, 255])
- `opacity`: Particle opacity (default: 255)
- `fadeOut`: Whether particles should fade out (default: true)
- `scaleDown`: Whether particles should scale down (default: false)
- `gravity`: Gravity effect (default: 0)
- `active`: Whether emitter starts active (default: true)

**Returns:** Emitter control object with methods:
- `start()`: Activates the emitter
- `stop()`: Deactivates the emitter
- `setPosition(x, y)`: Changes the emitter position
- `setRate(rate)`: Changes the emission rate
- `setColor(color)`: Changes the particle color
- `clearParticles()`: Removes all current particles

## Camera Effects

### cameraShake

```javascript
animation.cameraShake(startFrame, duration, intensity, frequency);
```

Creates a camera shake effect.

**Parameters:**
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `intensity`: Shake intensity (default: 10)
- `frequency`: Shake frequency (default: 4)

**Returns:** The animation API for chaining

### zoom

```javascript
animation.zoom(startFrame, duration, startScale, endScale, focusPoint, easing);
```

Creates a zoom effect.

**Parameters:**
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `startScale`: Starting scale (default: 1)
- `endScale`: Ending scale (default: 2)
- `focusPoint`: Point to focus on `{x, y}` (default: center of canvas)
- `easing`: Easing function (default: "easeInOutQuad")

**Returns:** The animation API for chaining

## Group Animations

### createGroup

```javascript
animation.createGroup(count, type, baseProps, arrangement);
```

Creates a group of objects.

**Parameters:**
- `count`: Number of objects to create
- `type`: Type of shapes to create
- `baseProps`: Base properties for all shapes
- `arrangement`: Arrangement pattern ("circle", "grid", "line", "random", "stack", default: "circle")

**Returns:** Array of created shapes

### animateGroup

```javascript
animation.animateGroup(group, property, keyframes, staggerFrames, easingType, reverse);
```

Animates a group with staggered timing.

**Parameters:**
- `group`: Array of shapes to animate
- `property`: Property to animate
- `keyframes`: Array of keyframe objects
- `staggerFrames`: Frame offset between each object's animation (default: 5)
- `easingType`: Easing function (default: "easeInOutCubic")
- `reverse`: Whether to animate in reverse order (default: false)

**Returns:** The group for chaining

### animateGroupMultiple

```javascript
animation.animateGroupMultiple(group, propertyMap, staggerFrames, easingType, reverse);
```

Animates multiple properties of a group with staggers.

**Parameters:**
- `group`: Array of shapes to animate
- `propertyMap`: Map of properties to keyframe arrays
- `staggerFrames`: Frame offset between each object's animation (default: 5)
- `easingType`: Default easing function (default: "easeInOutCubic")
- `reverse`: Whether to animate in reverse order (default: false)

**Returns:** The group for chaining

### waveEffect

```javascript
animation.waveEffect(group, property, startFrame, duration, minValue, maxValue, easing, loop);
```

Creates a wave effect on a group of objects.

**Parameters:**
- `group`: Array of shapes to animate
- `property`: Property to animate
- `startFrame`: Starting frame
- `duration`: Duration in frames
- `minValue`: Minimum value
- `maxValue`: Maximum value
- `easing`: Easing function (default: "easeInOutSine")
- `loop`: Whether to loop the animation (default: false)

**Returns:** The group for chaining

### pulseGroup

```javascript
animation.pulseGroup(group, startFrame, duration, minScale, maxScale, staggerFrames);
```

Creates a pulsing effect on a group.

**Parameters:**
- `group`: Array of shapes
- `startFrame`: Starting frame
- `duration`: Duration in frames (default: 60)
- `minScale`: Minimum scale (default: 0.8)
- `maxScale`: Maximum scale (default: 1.2)
- `staggerFrames`: Frame offset between animations (default: 6)

**Returns:** The group for chaining

## Text Animations

### typeText

```javascript
animation.typeText(textObj, startFrame, text, duration, easing, options);
```

Creates a typing animation for text objects.

**Parameters:**
- `textObj`: Text object to animate
- `startFrame`: Starting frame
- `text`: Text to type
- `duration`: Duration in frames (default: 60)
- `easing`: Easing function (default: "linear")
- `options`: Additional options

**Options:**
- `cursor`: Whether to show cursor (default: true)
- `cursorChar`: Character to use for cursor (default: "|")
- `cursorBlinkRate`: Cursor blink rate in frames (default: 15)
- `startWithEmpty`: Whether to start with empty text (default: true)

**Returns:** The text object for chaining

## Sequence Management

### defineSequence

```javascript
animation.defineSequence(name, sequenceFn);
```

Creates an animation sequence that can be reused.

**Parameters:**
- `name`: Name of the sequence
- `sequenceFn`: Function that defines the sequence

**Returns:** The animation API for chaining

### applySequence

```javascript
animation.applySequence(name, target, startFrame, options);
```

Applies a pre-defined animation sequence.

**Parameters:**
- `name`: Name of the sequence to apply
- `target`: Target shape or group to animate
- `startFrame`: Starting frame for the sequence (default: 0)
- `options`: Custom options for the sequence

**Returns:** The animated object(s)

### applyPreset

```javascript
animation.applyPreset(presetName, shape, startFrame, options);
```

Applies a simple animation preset for common effects.

**Parameters:**
- `presetName`: Name of the animation preset
- `shape`: Shape to animate
- `startFrame`: Starting frame
- `options`: Preset options

**Available Presets:**
- `bounce`: Bouncing animation
- `wiggle`: Wiggling animation
- `pop`: Popping in effect
- `dropIn`: Drop from top with bounce
- `slideIn`: Slide in from a direction
- `fadeRotateIn`: Fade in with rotation
- `pulseAndShrink`: Pulse and then shrink away
- `typewriter`: Typewriter text effect
- `shimmer`: Shimmer/highlight effect

**Returns:** The animated shape

### addFrameAction

```javascript
animation.addFrameAction(frame, callback);
```

Adds a new animation frame action.

**Parameters:**
- `frame`: Frame number to add
- `callback`: Function to call on this frame

**Returns:** The animation API for chaining

## Playback Controls

### play

```javascript
animation.play(loop);
```

Plays the animation.

**Parameters:**
- `loop`: Whether to loop the animation (default: false)

**Returns:** The animation API for chaining

### pause

```javascript
animation.pause();
```

Pauses the animation.

**Returns:** The animation API for chaining

### reset

```javascript
animation.reset();
```

Resets the animation to the beginning.

**Returns:** The animation API for chaining

### setDuration

```javascript
animation.setDuration(seconds);
```

Sets the animation duration.

**Parameters:**
- `seconds`: Duration in seconds

**Returns:** The animation API for chaining

### setFPS

```javascript
animation.setFPS(fps);
```

Sets the animation FPS.

**Parameters:**
- `fps`: Frames per second

**Returns:** The animation API for chaining

### clearAll

```javascript
animation.clearAll();
```

Clears all objects and resets the animation.

**Returns:** The animation API for chaining

## Project Management

### export

```javascript
animation.export(options);
```

Exports the animation.

**Parameters:**
- `options`: Export options

**Options:**
- `format`: Output format (default: "webm")
- `quality`: Output quality (default: 0.8)
- `fps`: Frames per second (default: engine's FPS)
- `filename`: Output filename (default: generated from timestamp)

**Returns:** The animation API for chaining

### saveProject

```javascript
animation.saveProject(filename);
```

Saves the current project.

**Parameters:**
- `filename`: Optional filename

**Returns:** The animation API for chaining

### loadProject

```javascript
animation.loadProject(jsonData);
```

Loads a project.

**Parameters:**
- `jsonData`: Project data

**Returns:** The animation API for chaining

### setBackgroundColor

```javascript
animation.setBackgroundColor(colorValue);
```

Sets the background color.

**Parameters:**
- `colorValue`: Background color (string, array, or color object)

**Returns:** The animation API for chaining

## Advanced Usage Examples

### Creating and Animating a Simple Shape

```javascript
// Create a circle
const circle = animation.createShape("circle", {
  x: 100,
  y: 100,
  size: 50,
  fill: [255, 0, 0]
});

// Animate it moving in a circle
animation.animate(circle, "x", [
  { frame: 0, value: 100 },
  { frame: 30, value: 200 },
  { frame: 60, value: 100 }
], "easeInOutQuad");

animation.animate(circle, "y", [
  { frame: 0, value: 100 },
  { frame: 30, value: 200 },
  { frame: 60, value: 100 }
], "easeInOutQuad");

// Fade it in and out
animation.fadeIn(circle, 0, 20);
animation.fadeOut(circle, 40, 20);
```

### Creating a Particle Effect

```javascript
// Create a burst of particles
const particles = animation.createParticleSystem(
  400, 300, 50, {
    type: "circle",
    size: 10,
    sizeVariation: 5,
    colorStart: [255, 0, 0],
    colorEnd: [255, 255, 0],
    duration: 60,
    spread: 200,
    gravity: 2,
    scaleDown: true
  }
);

// Create a continuous emitter
const emitter = animation.createEmitter(
  400, 300, {
    rate: 10,
    particleLifespan: 45,
    color: [0, 255, 255],
    spread: 100,
    gravity: 1,
    scaleDown: true
  }
);

// Move the emitter
animation.addFrameAction(60, () => {
  emitter.setPosition(200, 200);
});

// Stop the emitter after 120 frames
animation.addFrameAction(120, () => {
  emitter.stop();
});
```

### Creating a Complex Scene with Camera Effects

```javascript
// Create a scene with multiple elements
const background = animation.createShape("rectangle", {
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  fill: [20, 20, 40]
});

const sun = animation.createShape("circle", {
  x: 600,
  y: 200,
  size: 80,
  fill: [255, 200, 0]
});

// Create a scene transition
animation.transition(120, 60, "iris", {
  x: 400,
  y: 300,
  color: [0, 0, 0],
  onTransition: (engine) => {
    // This runs at the middle of the transition
    animation.setBackgroundColor([40, 20, 20]);
  }
});

// Add a camera shake effect
animation.cameraShake(200, 30, 15, 5);

// Zoom into the sun
animation.zoom(250, 90, 1, 2, { x: 600, y: 200 });
```

# AnimationAPI Documentation (Continued)

## Advanced Usage Examples (Continued)

### Creating and Animating a Group

```javascript
// Create a group of circles arranged in a circle
const circleGroup = animation.createGroup(12, "circle", {
  centerX: 400,
  centerY: 300,
  radius: 150,
  size: 30,
  fill: [100, 100, 255],
  colors: [
    [255, 0, 0], [255, 127, 0], [255, 255, 0], 
    [0, 255, 0], [0, 0, 255], [75, 0, 130]
  ]
}, "circle");

// Apply a wave effect to the group
animation.waveEffect(
  circleGroup,
  "size",
  0,
  120,
  20,
  60,
  "easeInOutSine",
  true
);

// Animate the group with staggered rotation
animation.animateGroup(
  circleGroup,
  "rotation",
  [
    { frame: 0, value: 0 },
    { frame: 60, value: 360 }
  ],
  5,
  "easeInOutCubic"
);
```

### Morphing Between Shapes

```javascript
// Create two shapes to morph between
const square = animation.createShape("rectangle", {
  x: 300,
  y: 300,
  width: 100,
  height: 100,
  fill: [255, 0, 0],
  cornerRadius: 0
});

const circle = animation.createShape("rectangle", {
  x: 500,
  y: 300,
  width: 120,
  height: 120,
  fill: [0, 0, 255],
  cornerRadius: 60,
  opacity: 0
});

// Morph the square into the circle
animation.morph(square, circle, 30, 60);

// Remove the target shape since it was just used as a reference
animation.addFrameAction(30, () => {
  animation.engine.removeObject(circle);
});
```

### Creating Text Animation

```javascript
// Create a text object
const title = animation.createShape("text", {
  x: 400,
  y: 300,
  text: "Animation API",
  fontSize: 48,
  fontFamily: "Arial",
  textAlign: "center",
  fill: [255, 255, 255],
  opacity: 0
});

// Apply the typing effect
animation.typeText(title, 10, "Animation API Demo", 60, "linear", {
  cursor: true,
  cursorChar: "_",
  cursorBlinkRate: 20
});

// Animate the text after typing
animation.addFrameAction(80, () => {
  animation.pulse(title, 80, 2, 40, 0.9, 1.1);
  animation.colorCycle(title, 80, 120, [
    [255, 255, 255],
    [255, 220, 100],
    [255, 255, 255]
  ]);
});
```

### Using Custom Animation Sequences

```javascript
// Define a reusable animation sequence
animation.defineSequence("enterAndSpin", function(shape, startFrame, options) {
  const duration = options.duration || 60;
  const direction = options.direction || "left";
  
  // Start from off-screen
  let startX = shape.x;
  let startY = shape.y;
  
  if (direction === "left") {
    startX = -shape.width;
  } else if (direction === "right") {
    startX = this.engine.canvasWidth + shape.width;
  }
  
  // Move in
  this.moveFromTo(
    shape, 
    startFrame, 
    startFrame + duration/2,
    startX,
    startY,
    shape.x,
    shape.y,
    "easeOutQuint"
  );
  
  // Spin
  this.spin(
    shape,
    startFrame + duration/2,
    duration/2,
    2,
    true,
    "easeOutCubic"
  );
  
  return shape;
});

// Create a shape
const star = animation.createShape("path", {
  x: 400,
  y: 300,
  points: [
    {x: 0, y: -50},
    {x: 15, y: -15},
    {x: 50, y: -15},
    {x: 25, y: 10},
    {x: 35, y: 50},
    {x: 0, y: 30},
    {x: -35, y: 50},
    {x: -25, y: 10},
    {x: -50, y: -15},
    {x: -15, y: -15}
  ],
  closed: true,
  fill: [255, 255, 0]
});

// Apply the sequence
animation.applySequence("enterAndSpin", star, 10, {
  direction: "right",
  duration: 90
});
```

### Creating a Complex Transition

```javascript
// Create some initial scene elements
const scene1 = animation.createShape("rectangle", {
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  fill: [50, 100, 150],
  name: "scene1Background"
});

const scene1Title = animation.createShape("text", {
  x: 400,
  y: 200,
  text: "Scene 1",
  fontSize: 64,
  textAlign: "center",
  fill: [255, 255, 255]
});

// Create transition and scene change
animation.transition(120, 45, "wipe", {
  direction: "left",
  color: [0, 0, 0],
  onTransition: (engine) => {
    // Remove first scene elements
    const scene1 = engine.getObjectByName("scene1Background");
    engine.removeObject(scene1);
    engine.removeObject(scene1Title);
    
    // Create second scene
    const scene2 = animation.createShape("rectangle", {
      x: 400,
      y: 300,
      width: 800,
      height: 600,
      fill: [150, 50, 100],
      name: "scene2Background"
    });
    
    const scene2Title = animation.createShape("text", {
      x: 400,
      y: 200,
      text: "Scene 2",
      fontSize: 64,
      textAlign: "center",
      fill: [255, 255, 255]
    });
    
    // Apply some animation to the new scene
    animation.fadeIn(scene2Title, 142, 30);
    animation.applyPreset("bounce", scene2Title, 175);
  }
});
```

### Using Particle Systems for Special Effects

```javascript
// Create a fire effect
const fire = animation.createEmitter(400, 500, {
  rate: 15,
  type: "circle",
  particleLifespan: 45,
  particleCount: 100,
  particleSize: 20,
  sizeVariation: 10,
  spread: 30,
  spreadY: 80,
  color: [255, 100, 10],
  colorEnd: [255, 200, 0],
  gravity: -2,
  scaleDown: true
});

// Create smoke above the fire
const smoke = animation.createEmitter(400, 450, {
  rate: 5,
  type: "circle",
  particleLifespan: 90,
  particleCount: 30,
  particleSize: 25,
  spread: 40,
  color: [150, 150, 150, 100],
  colorEnd: [200, 200, 200, 0],
  gravity: -1,
  scaleDown: false
});

// Add a spark effect on a specific frame
animation.addFrameAction(60, () => {
  animation.createParticleSystem(400, 490, 20, {
    type: "circle",
    size: 5,
    colorStart: [255, 255, 200],
    colorEnd: [255, 255, 0],
    duration: 30,
    spread: 100,
    spreadY: 60,
    gravity: -3,
    scaleDown: true
  });
});

// Move fire position
animation.addFrameAction(120, () => {
  fire.setPosition(300, 500);
  smoke.setPosition(300, 450);
});
```

### Creating Camera Effects

```javascript
// Create a scene
const sky = animation.createShape("rectangle", {
  x: 400,
  y: 150,
  width: 800,
  height: 300,
  fill: [100, 150, 255]
});

const ground = animation.createShape("rectangle", {
  x: 400,
  y: 450,
  width: 800,
  height: 300,
  fill: [100, 200, 100]
});

const character = animation.createShape("circle", {
  x: 200,
  y: 350,
  size: 50,
  fill: [255, 0, 0]
});

// Move character
animation.moveTo(character, 0, 120, 600, 350);

// Add camera shake when character reaches midpoint
animation.addFrameAction(60, () => {
  animation.cameraShake(60, 20, 8, 5);
});

// Zoom in on character at the end
animation.addFrameAction(130, () => {
  animation.zoom(130, 60, 1, 2.5, { x: 600, y: 350 });
});
```

## Best Practices

### Performance Optimization

1. **Limit Particle Count**: Keep particle counts reasonable (under 500 for most applications).
2. **Clean Up Unused Objects**: Remove objects that are no longer needed.
3. **Use Keyframes Efficiently**: Avoid creating too many keyframes for smooth animations.
4. **Group Similar Animations**: Use `animateMultiple` and `animateGroup` when possible.
5. **Reuse Common Sequences**: Define sequences for repeated patterns.

### Animation Timing

1. **Plan Your Timeline**: Map out your animation sequence before coding.
2. **Use Frame Actions**: Add logical breakpoints with `addFrameAction`.
3. **Consider Easing**: Select appropriate easing functions for natural movement.
4. **Stagger Animations**: Offset animations for visual interest using staggered timing.
5. **Test Performance**: Verify animation runs smoothly on target devices.

### Code Organization

1. **Create Animation Sections**: Group related animations together.
2. **Define Reusable Properties**: Store common values in variables.
3. **Chain Methods**: Use method chaining for cleaner code.
4. **Comment Complex Animations**: Document the purpose of animation sequences.
5. **Use Descriptive Names**: Name objects according to their purpose.

## Troubleshooting

### Common Issues

1. **Animations Not Playing**: Check if the animation engine is properly initialized and playing.
2. **Objects Disappearing**: Verify that opacity isn't being set to 0.
3. **Jerky Animations**: Add more keyframes or adjust easing functions.
4. **High CPU Usage**: Reduce particle count or complex animations.
5. **Animation Timing Off**: Verify frame numbers and durations.

### Debugging Tools

1. **Frame Markers**: Add timeline markers to track progress.
2. **Logging Actions**: Use `addFrameAction` to log state at specific frames.
3. **Visible Bounding Boxes**: Add temporary outline shapes for positioning.
4. **Slow Down Playback**: Reduce FPS temporarily to observe details.
5. **Step Through Frames**: Use the timeline controls to move frame by frame.

## Integration with Other Systems

The AnimationAPI can be integrated with other systems:

1. **Event Listeners**: Trigger animations based on user interactions.
2. **Data Visualization**: Animate data changes over time.
3. **Game Engines**: Add visual effects to game objects.
4. **Video Production**: Create animated segments for videos.
5. **Interactive Storytelling**: Build interactive animated narratives.

By leveraging the full power of the AnimationAPI, you can create complex, professional-quality animations for a wide range of applications.
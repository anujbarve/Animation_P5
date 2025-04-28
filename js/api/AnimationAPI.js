class AnimationAPI {
  constructor(engine) {
    this.engine = engine;
    this.keyframeManager = new KeyframeManager();

    // Cached references to utility functions
    this.easing = EasingFunctions;
    this.interpolation = Interpolation;

    // Predefined animation sequences
    this.sequences = {};

    // Store a reference to objects created by the API
    this.createdObjects = [];
  }

  /**
   * Create a shape with a type and initial properties
   * @param {string} type - Type of shape to create
   * @param {object} props - Properties to initialize the shape with
   * @returns {BaseShape} The created shape
   */
  createShape(type, props = {}) {
    let shape;
    const x = props.x || this.engine.canvasWidth / 2;
    const y = props.y || this.engine.canvasHeight / 2;

    switch (type.toLowerCase()) {
      case "circle":
        shape = new Circle(x, y, props.size || props.diameter || 100);
        break;

      case "rectangle":
      case "rect":
        shape = new Rectangle(x, y, props.width || 100, props.height || 80);
        if (props.cornerRadius !== undefined) {
          shape.cornerRadius = props.cornerRadius;
        }
        break;

      case "text":
        shape = new Text(x, y, props.text || "Text");
        if (props.fontSize) shape.fontSize = props.fontSize;
        if (props.fontFamily) shape.fontFamily = props.fontFamily;
        if (props.textAlign) shape.textAlign = props.textAlign;
        if (props.textStyle) shape.textStyle = props.textStyle;
        break;

      case "path":
        shape = new Path(x, y);
        if (props.points && Array.isArray(props.points)) {
          props.points.forEach((point) => {
            shape.addPoint(point.x, point.y);
          });
        }
        shape.closed = props.closed !== undefined ? props.closed : false;
        break;

      default:
        console.error("Unknown shape type:", type);
        return null;
    }

    // Apply common properties
    this._applyCommonProperties(shape, props);

    // Add to engine and track in our created objects
    this.engine.addObject(shape);
    this.createdObjects.push(shape);

    return shape;
  }

  /**
   * Apply common properties to a shape
   * @private
   */
  _applyCommonProperties(shape, props) {
    // Handle color properties with multiple formats
    if (props.fill !== undefined) {
      if (typeof props.fill === "string") {
        // Handle hex or CSS color strings
        shape.fill = color(props.fill);
      } else if (Array.isArray(props.fill)) {
        // Handle RGB or RGBA arrays
        shape.fill = color(...props.fill);
      } else {
        // Handle p5.js color object or our own color format
        shape.fill = props.fill;
      }
    }

    if (props.stroke !== undefined) {
      if (typeof props.stroke === "string") {
        shape.stroke = color(props.stroke);
      } else if (Array.isArray(props.stroke)) {
        shape.stroke = color(...props.stroke);
      } else {
        shape.stroke = props.stroke;
      }
    }

    // Apply other common properties
    if (props.strokeWeight !== undefined)
      shape.strokeWeight = props.strokeWeight;
    if (props.opacity !== undefined) shape.opacity = props.opacity;
    if (props.rotation !== undefined) shape.rotation = props.rotation;
    if (props.name) shape.name = props.name;
    if (props.visible !== undefined) shape.visible = props.visible;

    // Allow direct setting of position properties
    if (props.left !== undefined) shape.x = props.left + shape.width / 2;
    if (props.top !== undefined) shape.y = props.top + shape.height / 2;
    if (props.right !== undefined) shape.x = props.right - shape.width / 2;
    if (props.bottom !== undefined) shape.y = props.bottom - shape.height / 2;
    if (props.center !== undefined) {
      if (props.center.x !== undefined) shape.x = props.center.x;
      if (props.center.y !== undefined) shape.y = props.center.y;
    }
  }

  /**
   * Animate a property with multiple keyframes
   * @param {BaseShape} shape - Shape to animate
   * @param {string} property - Property to animate
   * @param {Array} keyframes - Array of keyframe objects {frame, value, easing}
   * @param {string} easingType - Default easing type
   * @returns {BaseShape} The shape for chaining
   */
  animate(shape, property, keyframes, easingType = "easeInOutCubic") {
    if (!shape || !keyframes || !Array.isArray(keyframes)) {
      console.error("Invalid animation parameters");
      return shape;
    }

    // Validate property can be animated
    if (typeof shape[property] === "undefined") {
      console.error(`Property ${property} does not exist on shape`);
      return shape;
    }

    // Register this property with the keyframe manager
    this.keyframeManager.registerKeyframedProperty(property);

    // Sort keyframes by frame number to ensure proper sequencing
    const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);

    // Add each keyframe to the shape
    sortedKeyframes.forEach((kf) => {
      shape.addKeyframe(property, kf.frame, kf.value, kf.easing || easingType);
    });

    return shape; // For chaining
  }

  /**
   * Animate multiple properties at once
   * @param {BaseShape} shape - Shape to animate
   * @param {Object} propertyMap - Map of properties to keyframe arrays
   * @param {string} defaultEasing - Default easing type
   * @returns {BaseShape} The shape for chaining
   */
  animateMultiple(shape, propertyMap, defaultEasing = "easeInOutCubic") {
    if (!shape || !propertyMap || typeof propertyMap !== "object") {
      console.error("Invalid animation parameters");
      return shape;
    }

    // Apply animations for each property
    for (const property in propertyMap) {
      if (propertyMap.hasOwnProperty(property)) {
        this.animate(shape, property, propertyMap[property], defaultEasing);
      }
    }

    return shape;
  }

  /**
   * Remove all keyframes for a property
   * @param {BaseShape} shape - Shape to modify
   * @param {string} property - Property to clear animations for
   * @returns {BaseShape} The shape for chaining
   */
  clearAnimation(shape, property) {
    if (!shape || !property) {
      console.error("Invalid parameters");
      return shape;
    }

    if (shape.keyframes[property]) {
      delete shape.keyframes[property];

      // Check if any objects still have keyframes for this property
      let propertyStillUsed = false;
      for (const obj of this.engine.objects) {
        if (obj.keyframes[property] && obj.keyframes[property].length > 0) {
          propertyStillUsed = true;
          break;
        }
      }

      if (!propertyStillUsed) {
        this.keyframeManager.unregisterKeyframedProperty(property);
      }
    }

    return shape;
  }

  /**
   * Clear all animations on a shape
   * @param {BaseShape} shape - Shape to clear animations from
   * @returns {BaseShape} The shape for chaining
   */
  clearAllAnimations(shape) {
    if (!shape) return null;

    // Clear all keyframes
    shape.keyframes = {};

    return shape;
  }

  /**
   * Fade in animation
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {string} easing - Easing function to use
   * @returns {BaseShape} The shape for chaining
   */
  fadeIn(shape, startFrame = 0, duration = 30, easing = "easeOutCubic") {
    shape.opacity = 0;
    this.animate(
      shape,
      "opacity",
      [
        { frame: startFrame, value: 0 },
        { frame: startFrame + duration, value: 255 },
      ],
      easing
    );
    return shape;
  }

  /**
   * Fade out animation
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {string} easing - Easing function to use
   * @returns {BaseShape} The shape for chaining
   */
  fadeOut(shape, startFrame, duration = 30, easing = "easeInCubic") {
    this.animate(
      shape,
      "opacity",
      [
        { frame: startFrame, value: 255 },
        { frame: startFrame + duration, value: 0 },
      ],
      easing
    );
    return shape;
  }

  /**
   * Cross-fade between two shapes
   * @param {BaseShape} shapeOut - Shape to fade out
   * @param {BaseShape} shapeIn - Shape to fade in
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {string} easing - Easing function
   * @returns {Array} Array of the two shapes
   */
  crossFade(
    shapeOut,
    shapeIn,
    startFrame,
    duration = 30,
    easing = "easeInOutCubic"
  ) {
    this.fadeOut(shapeOut, startFrame, duration, easing);
    this.fadeIn(shapeIn, startFrame, duration, easing);
    return [shapeOut, shapeIn];
  }

  /**
   * Move from point A to B
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} endFrame - Ending frame
   * @param {number} fromX - Start X position
   * @param {number} fromY - Start Y position
   * @param {number} toX - End X position
   * @param {number} toY - End Y position
   * @param {string} easing - Easing function to use
   * @returns {BaseShape} The shape for chaining
   */
  moveFromTo(
    shape,
    startFrame,
    endFrame,
    fromX,
    fromY,
    toX,
    toY,
    easing = "easeInOutCubic"
  ) {
    this.animate(
      shape,
      "x",
      [
        { frame: startFrame, value: fromX },
        { frame: endFrame, value: toX },
      ],
      easing
    );

    this.animate(
      shape,
      "y",
      [
        { frame: startFrame, value: fromY },
        { frame: endFrame, value: toY },
      ],
      easing
    );

    return shape;
  }

  /**
   * Move to a position (from current position)
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} toX - End X position
   * @param {number} toY - End Y position
   * @param {string} easing - Easing function to use
   * @returns {BaseShape} The shape for chaining
   */
  moveTo(shape, startFrame, duration, toX, toY, easing = "easeInOutCubic") {
    return this.moveFromTo(
      shape,
      startFrame,
      startFrame + duration,
      shape.x,
      shape.y,
      toX,
      toY,
      easing
    );
  }

  /**
   * Scale animation
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} endFrame - Ending frame
   * @param {number} fromScale - Starting scale
   * @param {number} toScale - Ending scale
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  scale(
    shape,
    startFrame,
    endFrame,
    fromScale,
    toScale,
    easing = "easeInOutQuad"
  ) {
    // For circles, adjust width (diameter)
    if (shape instanceof Circle) {
      const originalSize = shape.width / fromScale;

      this.animate(
        shape,
        "width",
        [
          { frame: startFrame, value: originalSize * fromScale },
          { frame: endFrame, value: originalSize * toScale },
        ],
        easing
      );

      // For consistency, also set the height (since it's a circle)
      this.animate(
        shape,
        "height",
        [
          { frame: startFrame, value: originalSize * fromScale },
          { frame: endFrame, value: originalSize * toScale },
        ],
        easing
      );

      return shape;
    }

    // For rectangles, adjust both width and height
    if (shape instanceof Rectangle || shape instanceof Text) {
      const originalWidth = shape.width / fromScale;
      const originalHeight = shape.height / fromScale;

      this.animate(
        shape,
        "width",
        [
          { frame: startFrame, value: originalWidth * fromScale },
          { frame: endFrame, value: originalWidth * toScale },
        ],
        easing
      );

      this.animate(
        shape,
        "height",
        [
          { frame: startFrame, value: originalHeight * fromScale },
          { frame: endFrame, value: originalHeight * toScale },
        ],
        easing
      );
    }

    return shape;
  }

  /**
   * Scale shape to specific dimensions
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} targetWidth - Target width
   * @param {number} targetHeight - Target height (optional, maintains aspect ratio if not specified)
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  scaleTo(
    shape,
    startFrame,
    duration,
    targetWidth,
    targetHeight,
    easing = "easeInOutQuad"
  ) {
    const endFrame = startFrame + duration;

    // If targetHeight is not specified, maintain aspect ratio
    if (targetHeight === undefined) {
      const aspectRatio = shape.height / shape.width;
      targetHeight = targetWidth * aspectRatio;
    }

    this.animate(
      shape,
      "width",
      [
        { frame: startFrame, value: shape.width },
        { frame: endFrame, value: targetWidth },
      ],
      easing
    );

    this.animate(
      shape,
      "height",
      [
        { frame: startFrame, value: shape.height },
        { frame: endFrame, value: targetHeight },
      ],
      easing
    );

    return shape;
  }

  /**
   * Rotation animation
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} endFrame - Ending frame
   * @param {number} fromAngle - Starting angle in degrees
   * @param {number} toAngle - Ending angle in degrees
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  rotate(
    shape,
    startFrame,
    endFrame,
    fromAngle,
    toAngle,
    easing = "easeInOutCubic"
  ) {
    this.animate(
      shape,
      "rotation",
      [
        { frame: startFrame, value: fromAngle },
        { frame: endFrame, value: toAngle },
      ],
      easing
    );

    return shape;
  }

  /**
   * Continuous rotation animation (multiple revolutions)
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} revolutions - Number of full revolutions
   * @param {boolean} clockwise - Direction of rotation
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  spin(
    shape,
    startFrame,
    duration,
    revolutions = 1,
    clockwise = true,
    easing = "linear"
  ) {
    const startAngle = shape.rotation;
    const endAngle = startAngle + (clockwise ? 1 : -1) * 360 * revolutions;

    return this.rotate(
      shape,
      startFrame,
      startFrame + duration,
      startAngle,
      endAngle,
      easing
    );
  }

  /**
   * Create a motion path animation (object follows a path)
   * @param {BaseShape} shape - Shape to animate
   * @param {Array} path - Array of points {x, y}
   * @param {number} startFrame - Starting frame
   * @param {number} endFrame - Ending frame
   * @param {string} easing - Easing function
   * @param {boolean} orientToPath - Whether the object should rotate to follow the path
   * @returns {BaseShape} The shape for chaining
   */
  followPath(
    shape,
    path,
    startFrame,
    endFrame,
    easing = "linear",
    orientToPath = false
  ) {
    if (!Array.isArray(path) || path.length < 2) {
      console.error("Path must be an array of at least 2 points");
      return shape;
    }

    // Calculate total path length for even distribution
    let totalLength = 0;
    const segmentLengths = [];

    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x;
      const dy = path[i + 1].y - path[i].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      totalLength += length;
      segmentLengths.push(length);
    }

    // Create keyframes distributed by distance
    const xKeyframes = [];
    const yKeyframes = [];
    const rotationKeyframes = [];

    let accumulatedLength = 0;

    for (let i = 0; i < path.length; i++) {
      if (i > 0) {
        accumulatedLength += segmentLengths[i - 1];
      }

      const progress = accumulatedLength / totalLength;
      const frame = startFrame + Math.round(progress * (endFrame - startFrame));

      xKeyframes.push({ frame: frame, value: path[i].x });
      yKeyframes.push({ frame: frame, value: path[i].y });

      // Calculate rotation if orientToPath is true
      if (orientToPath && i < path.length - 1) {
        const dx = path[i + 1].x - path[i].x;
        const dy = path[i + 1].y - path[i].y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        rotationKeyframes.push({ frame: frame, value: angle });
      }
    }

    // Ensure the first and last frames are exactly as specified
    xKeyframes[0].frame = startFrame;
    yKeyframes[0].frame = startFrame;
    xKeyframes[xKeyframes.length - 1].frame = endFrame;
    yKeyframes[yKeyframes.length - 1].frame = endFrame;

    if (rotationKeyframes.length > 0) {
      rotationKeyframes[0].frame = startFrame;
      // The last rotation keyframe should be at the second to last point
      rotationKeyframes[rotationKeyframes.length - 1].frame =
        xKeyframes[xKeyframes.length - 2].frame;
    }

    // Apply the animations
    this.animate(shape, "x", xKeyframes, easing);
    this.animate(shape, "y", yKeyframes, easing);

    if (orientToPath && rotationKeyframes.length > 0) {
      this.animate(shape, "rotation", rotationKeyframes, easing);
    }

    return shape;
  }

  /**
   * Create a group of objects and animate them together
   * @param {number} count - Number of objects to create
   * @param {string} type - Type of shapes to create
   * @param {object} baseProps - Base properties for all shapes
   * @param {string} arrangement - Arrangement pattern: 'circle', 'grid', 'line', 'random'
   * @returns {Array} Array of created shapes
   */
  createGroup(count, type, baseProps = {}, arrangement = "circle") {
    const group = [];
    const centerX = baseProps.centerX || this.engine.canvasWidth / 2;
    const centerY = baseProps.centerY || this.engine.canvasHeight / 2;
    const radius = baseProps.radius || 150;

    for (let i = 0; i < count; i++) {
      const props = { ...baseProps };

      // Position based on arrangement
      if (arrangement === "circle") {
        const angle = (i / count) * Math.PI * 2;
        props.x = centerX + Math.cos(angle) * radius;
        props.y = centerY + Math.sin(angle) * radius;
      } else if (arrangement === "grid") {
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const cellWidth = (radius * 2) / cols;
        const cellHeight = (radius * 2) / rows;

        const col = i % cols;
        const row = Math.floor(i / cols);

        props.x = centerX - radius + (col + 0.5) * cellWidth;
        props.y = centerY - radius + (row + 0.5) * cellHeight;
      } else if (arrangement === "line") {
        if (count === 1) {
          props.x = centerX;
        } else {
          props.x = centerX - radius + (2 * radius * i) / (count - 1);
        }
        props.y = centerY;
      } else if (arrangement === "random") {
        props.x = centerX + (Math.random() * 2 - 1) * radius;
        props.y = centerY + (Math.random() * 2 - 1) * radius;
      } else if (arrangement === "stack") {
        // Stack objects on top of each other with a small offset
        props.x = centerX + i * (baseProps.offsetX || 5);
        props.y = centerY + i * (baseProps.offsetY || 5);
      }

      // Set index-based properties if provided
      if (baseProps.colors && Array.isArray(baseProps.colors)) {
        props.fill = baseProps.colors[i % baseProps.colors.length];
      }

      if (baseProps.sizes && Array.isArray(baseProps.sizes)) {
        props.size = baseProps.sizes[i % baseProps.sizes.length];
        props.width = baseProps.sizes[i % baseProps.sizes.length];
        props.height = baseProps.sizes[i % baseProps.sizes.length];
      }

      // Create the shape
      const shape = this.createShape(type, props);

      // Add sequence index for later reference
      shape.groupIndex = i;
      shape.groupCount = count;

      group.push(shape);
    }

    return group;
  }

  /**
   * Animate a group with staggered timing
   * @param {Array} group - Array of shapes to animate
   * @param {string} property - Property to animate
   * @param {Array} keyframes - Array of keyframe objects
   * @param {number} staggerFrames - Frame offset between each object's animation
   * @param {string} easingType - Easing function to use
   * @param {boolean} reverse - Whether to animate in reverse order
   * @returns {Array} The group for chaining
   */
  animateGroup(
    group,
    property,
    keyframes,
    staggerFrames = 5,
    easingType = "easeInOutCubic",
    reverse = false
  ) {
    if (!Array.isArray(group)) {
      console.error("Group must be an array of shapes");
      return [];
    }

    // Determine the animation order
    const indices = reverse
      ? Array.from({ length: group.length }, (_, i) => group.length - 1 - i)
      : Array.from({ length: group.length }, (_, i) => i);

    indices.forEach((index) => {
      const shape = group[index];

      // Create staggered keyframes
      const staggeredKeyframes = keyframes.map((kf) => ({
        frame: kf.frame + index * staggerFrames,
        value: kf.value,
        easing: kf.easing || easingType,
      }));

      // Apply animation
      this.animate(shape, property, staggeredKeyframes);
    });

    return group;
  }

  /**
   * Animate multiple properties of a group with staggers
   * @param {Array} group - Array of shapes to animate
   * @param {Object} propertyMap - Map of properties to keyframe arrays
   * @param {number} staggerFrames - Frame offset between each object's animation
   * @param {string} easingType - Default easing function
   * @param {boolean} reverse - Whether to animate in reverse order
   * @returns {Array} The group for chaining
   */
  animateGroupMultiple(
    group,
    propertyMap,
    staggerFrames = 5,
    easingType = "easeInOutCubic",
    reverse = false
  ) {
    if (!Array.isArray(group) || !propertyMap) {
      console.error("Invalid parameters");
      return group;
    }

    // For each property, apply staggered animation
    for (const property in propertyMap) {
      if (propertyMap.hasOwnProperty(property)) {
        this.animateGroup(
          group,
          property,
          propertyMap[property],
          staggerFrames,
          easingType,
          reverse
        );
      }
    }

    return group;
  }

  /**
   * Create a wave effect on a group of objects
   * @param {Array} group - Array of shapes to animate
   * @param {string} property - Property to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} minValue - Minimum value
   * @param {number} maxValue - Maximum value
   * @param {string} easing - Easing function
   * @param {boolean} loop - Whether to loop the animation
   * @returns {Array} The group for chaining
   */
  waveEffect(
    group,
    property,
    startFrame,
    duration,
    minValue,
    maxValue,
    easing = "easeInOutSine",
    loop = false
  ) {
    if (!Array.isArray(group) || group.length === 0) {
      console.error("Group must be a non-empty array of shapes");
      return group;
    }

    const framesPerObject = Math.floor(duration / group.length);

    group.forEach((shape, index) => {
      const delay = index * framesPerObject;

      // Basic wave keyframes
      const keyframes = [
        { frame: startFrame + delay, value: minValue },
        { frame: startFrame + delay + duration / 4, value: maxValue },
        { frame: startFrame + delay + duration / 2, value: minValue },
      ];

      // Add looping keyframes if needed
      if (loop) {
        // Calculate how many full cycles within the duration
        const cycleLength = duration / 2; // One full up-down cycle
        const numCycles = Math.ceil(duration / cycleLength);

        // Create keyframes for each cycle
        const loopingKeyframes = [];
        for (let cycle = 0; cycle < numCycles; cycle++) {
          const cycleStart = startFrame + delay + cycle * cycleLength;

          loopingKeyframes.push(
            { frame: cycleStart, value: minValue },
            { frame: cycleStart + cycleLength / 2, value: maxValue },
            { frame: cycleStart + cycleLength, value: minValue }
          );
        }

        this.animate(shape, property, loopingKeyframes, easing);
      } else {
        this.animate(shape, property, keyframes, easing);
      }
    });

    return group;
  }

  /**
   * Create a pulse animation (scale up and down)
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} count - Number of pulses
   * @param {number} duration - Duration in frames
   * @param {number} minScale - Minimum scale factor
   * @param {number} maxScale - Maximum scale factor
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  pulse(
    shape,
    startFrame,
    count = 3,
    duration = 60,
    minScale = 0.8,
    maxScale = 1.2,
    easing = "easeInOutQuad"
  ) {
    const keyframes = [];
    const frameDuration = duration / count;

    // Determine the original size
    let originalWidth, originalHeight;

    if (shape instanceof Circle) {
      originalWidth = originalHeight = shape.width;
    } else {
      originalWidth = shape.width;
      originalHeight = shape.height;
    }

    // Create pulsing keyframes
    for (let i = 0; i <= count; i++) {
      const frame = startFrame + i * frameDuration;
      const scale = i % 2 === 0 ? minScale : maxScale;

      keyframes.push({
        frame: frame,
        scaleValue: scale,
        easing: easing,
      });
    }

    // Ensure we end at the original scale
    keyframes.push({
      frame: startFrame + duration,
      scaleValue: 1.0,
      easing: easing,
    });

    // Apply animations to width and height
    this.animate(
      shape,
      "width",
      keyframes.map((kf) => ({
        frame: kf.frame,
        value: originalWidth * kf.scaleValue,
        easing: kf.easing,
      }))
    );

    this.animate(
      shape,
      "height",
      keyframes.map((kf) => ({
        frame: kf.frame,
        value: originalHeight * kf.scaleValue,
        easing: kf.easing,
      }))
    );

    return shape;
  }

  /**
   * Create a pulsing effect on a group
   * @param {Array} group - Array of shapes
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} minScale - Minimum scale
   * @param {number} maxScale - Maximum scale
   * @param {number} staggerFrames - Frame offset between animations
   * @returns {Array} The group for chaining
   */
  pulseGroup(
    group,
    startFrame,
    duration = 60,
    minScale = 0.8,
    maxScale = 1.2,
    staggerFrames = 6
  ) {
    if (!Array.isArray(group)) {
      console.error("Group must be an array of shapes");
      return group;
    }

    group.forEach((shape, index) => {
      this.pulse(
        shape,
        startFrame + index * staggerFrames,
        1, // Just one pulse per shape
        duration,
        minScale,
        maxScale
      );
    });

    return group;
  }

  /**
   * Create a typing animation for text objects
   * @param {Text} textObj - Text object to animate
   * @param {number} startFrame - Starting frame
   * @param {string} text - Text to type
   * @param {number} duration - Duration in frames
   * @param {string} easing - Easing function
   * @param {object} options - Additional options (cursor, cursorBlinkRate, etc)
   * @returns {Text} The text object for chaining
   */
  typeText(
    textObj,
    startFrame,
    text,
    duration = 60,
    easing = "linear",
    options = {}
  ) {
    if (!(textObj instanceof Text)) {
      console.error("Object must be a Text instance");
      return textObj;
    }

    const showCursor = options.cursor !== false;
    const cursorChar = options.cursorChar || "|";
    const cursorBlinkRate = options.cursorBlinkRate || 15; // frames
    const startWithEmpty = options.startWithEmpty !== false;

    // If starting with empty, set initial text
    if (startWithEmpty) {
      textObj.text = "";
    }

    // Calculate frames per character
    const frameDuration = duration / text.length;

    // Create a custom property for typing animation
    if (!textObj.customProperties) {
      textObj.customProperties = {};
    }

    textObj.customProperties.typingText = {
      fullText: text,
      isTyping: false,
      startFrame: startFrame,
      endFrame: startFrame + duration,
      cursorVisible: showCursor,
      cursorChar: cursorChar,
      cursorBlinkRate: cursorBlinkRate,
    };

    // Override the updateToFrame method to handle typing
    const originalUpdateToFrame = textObj.updateToFrame;

    textObj.updateToFrame = function (frame) {
      // Call the original update first (for other properties)
      originalUpdateToFrame.call(this, frame);

      // Handle typing animation
      const typing = this.customProperties.typingText;

      if (frame >= typing.startFrame && frame <= typing.endFrame) {
        typing.isTyping = true;

        // Calculate progress
        const progress =
          (frame - typing.startFrame) / (typing.endFrame - typing.startFrame);
        const charIndex = Math.floor(progress * typing.fullText.length);

        // Get substring based on progress
        let currentText = typing.fullText.substring(0, charIndex);

        // Add cursor if needed
        if (typing.cursorVisible) {
          const cursorVisible =
            Math.floor(frame / typing.cursorBlinkRate) % 2 === 0;
          if (cursorVisible) {
            currentText += typing.cursorChar;
          }
        }

        this.text = currentText;
      } else if (frame > typing.endFrame && typing.isTyping) {
        // Animation completed
        typing.isTyping = false;
        this.text = typing.fullText;
      }
    };

    return textObj;
  }

  /**
   * Create a particle system
   * @param {number} x - X position of emitter
   * @param {number} y - Y position of emitter
   * @param {number} count - Number of particles
   * @param {object} options - Particle system options
   * @returns {Array} Array of particle objects
   */
  createParticleSystem(x, y, count = 20, options = {}) {
    const particles = [];
    const particleType = options.type || "circle";
    const size = options.size || 10;
    const sizeVariation = options.sizeVariation || 0;
    const colorStart = options.colorStart || [255, 255, 255];
    const colorEnd = options.colorEnd;
    const duration = options.duration || 60;
    const durationVariation = options.durationVariation || 0;
    const spread = options.spread || 200;
    const spreadX = options.spreadX || spread;
    const spreadY = options.spreadY || spread;
    const gravity = options.gravity || 0;
    const startFrame = options.startFrame || 0;
    const emitRate = options.emitRate || 0; // 0 means all at once
    const opacityStart =
      options.opacityStart !== undefined ? options.opacityStart : 255;
    const opacityEnd =
      options.opacityEnd !== undefined ? options.opacityEnd : 0;

    for (let i = 0; i < count; i++) {
      // Determine emission frame based on emit rate
      const emissionFrame =
        emitRate > 0
          ? startFrame + Math.floor(i / (count / (duration / emitRate)))
          : startFrame;

      // Random particle size with variation
      const particleSize = size + (Math.random() * 2 - 1) * sizeVariation;

      // Random particle duration with variation
      const particleDuration =
        duration + (Math.random() * 2 - 1) * durationVariation;

      // Create particle with starting opacity
      const particle = this.createShape(particleType, {
        x: x,
        y: y,
        size: particleSize,
        width: particleSize,
        height: particleSize,
        fill: Array.isArray(colorStart)
          ? color(...colorStart, opacityStart)
          : colorStart,
        name: `Particle_${i}`,
        opacity: opacityStart,
      });

      // Random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const distanceX = (Math.random() * 2 - 1) * spreadX;
      const distanceY = (Math.random() * 2 - 1) * spreadY;

      // Calculate end position
      let endX, endY;

      if (options.radialSpread) {
        // For radial spread, use angle and distance
        const distance = Math.random() * spread;
        endX = x + Math.cos(angle) * distance;
        endY = y + Math.sin(angle) * distance;
      } else {
        // For rectangular spread, use random x and y
        endX = x + distanceX;
        endY = y + distanceY;
      }

      // Apply gravity if needed
      if (gravity !== 0) {
        // Adjust end position based on gravity
        endY += gravity * particleDuration;
      }

      // Animate position
      this.moveFromTo(
        particle,
        emissionFrame,
        emissionFrame + particleDuration,
        x,
        y,
        endX,
        endY,
        options.easing || "easeOutCubic"
      );

      // Animate opacity (fade out)
      this.animate(particle, "opacity", [
        { frame: emissionFrame, value: opacityStart },
        { frame: emissionFrame + particleDuration, value: opacityEnd },
      ]);

      // Animate color if end color specified
      if (colorEnd) {
        this.animate(particle, "fill", [
          {
            frame: emissionFrame,
            value: Array.isArray(colorStart)
              ? color(...colorStart)
              : colorStart,
          },
          {
            frame: emissionFrame + particleDuration,
            value: Array.isArray(colorEnd) ? color(...colorEnd) : colorEnd,
          },
        ]);
      }

      // Scale down if specified
      if (options.scaleDown) {
        this.scale(
          particle,
          emissionFrame,
          emissionFrame + particleDuration,
          1,
          options.endScale || 0.2,
          options.scaleEasing || "easeInQuad"
        );
      }

      // Add rotation if specified
      if (options.rotation) {
        const startRotation = options.startRotation || 0;
        const endRotation = options.endRotation || 360;
        this.rotate(
          particle,
          emissionFrame,
          emissionFrame + particleDuration,
          startRotation,
          endRotation,
          options.rotationEasing || "linear"
        );
      }

      particles.push(particle);
    }

    return particles;
  }

  /**
   * Create a continuous particle emitter
   * @param {number} x - X position of emitter
   * @param {number} y - Y position of emitter
   * @param {object} options - Emitter options
   * @returns {object} Emitter control object
   */
  createEmitter(x, y, options = {}) {
    const emitterDefaults = {
      rate: 5, // Particles per second
      duration: -1, // -1 means run indefinitely
      particleLifespan: 60, // frames
      particleCount: 100, // Maximum number of particles
      particleSize: 10,
      spread: 100,
      type: "circle",
      color: [255, 255, 255],
      opacity: 255,
      fadeOut: true,
      scaleDown: false,
      gravity: 0,
      active: true,
    };

    // Merge defaults with provided options
    const emitterOptions = { ...emitterDefaults, ...options };

    // Create emitter object
    const emitter = {
      x: x,
      y: y,
      options: emitterOptions,
      particles: [],
      active: emitterOptions.active,
      lastEmitFrame: 0,
      frameInterval: Math.round(this.engine.timeline.fps / emitterOptions.rate),

      update: (frame) => {
        if (!emitter.active) return;

        // Check if we should emit a particle
        if (frame - emitter.lastEmitFrame >= emitter.frameInterval) {
          emitter.lastEmitFrame = frame;

          // Create new particles
          if (emitter.particles.length < emitterOptions.particleCount) {
            const newParticles = this.createParticleSystem(
              emitter.x,
              emitter.y,
              1,
              {
                type: emitterOptions.type,
                size: emitterOptions.particleSize,
                colorStart: emitterOptions.color,
                colorEnd: emitterOptions.colorEnd,
                duration: emitterOptions.particleLifespan,
                spread: emitterOptions.spread,
                gravity: emitterOptions.gravity,
                startFrame: frame,
                opacityStart: emitterOptions.opacity,
                opacityEnd: emitterOptions.fadeOut ? 0 : emitterOptions.opacity,
                scaleDown: emitterOptions.scaleDown,
                rotation: emitterOptions.rotation,
              }
            );

            emitter.particles.push(...newParticles);
          }
        }

        // Clean up expired particles (optimization)
        if (frame % 30 === 0 && emitter.particles.length > 0) {
          const currentParticles = [];

          for (const particle of emitter.particles) {
            // Check if particle is still alive
            const isStillAlive = this.engine.objects.includes(particle);
            if (isStillAlive) {
              currentParticles.push(particle);
            }
          }

          emitter.particles = currentParticles;
        }

        // Check duration
        if (emitterOptions.duration > 0 && frame >= emitterOptions.duration) {
          emitter.stop();
        }
      },

      start: () => {
        emitter.active = true;
        return emitter;
      },

      stop: () => {
        emitter.active = false;
        return emitter;
      },

      setPosition: (newX, newY) => {
        emitter.x = newX;
        emitter.y = newY;
        return emitter;
      },

      setRate: (newRate) => {
        emitterOptions.rate = newRate;
        emitter.frameInterval = Math.round(this.engine.timeline.fps / newRate);
        return emitter;
      },

      setColor: (newColor) => {
        emitterOptions.color = newColor;
        return emitter;
      },

      clearParticles: () => {
        for (const particle of emitter.particles) {
          const index = this.engine.objects.indexOf(particle);
          if (index !== -1) {
            this.engine.objects.splice(index, 1);
          }
        }
        emitter.particles = [];
        return emitter;
      },
    };

    // Register the emitter with the animation engine for updates
    if (!this.engine.emitters) {
      this.engine.emitters = [];

      // Add update hook to the engine
      const originalUpdate = this.engine.update;
      this.engine.update = function () {
        originalUpdate.call(this);

        // Update all emitters
        if (this.emitters) {
          for (const emitter of this.emitters) {
            emitter.update(this.timeline.currentFrame);
          }
        }
      };
    }

    this.engine.emitters.push(emitter);
    return emitter;
  }

  /**
   * Create a morph animation between two shapes
   * @param {BaseShape} fromShape - Starting shape
   * @param {BaseShape} toShape - Target shape
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {string} easing - Easing function
   * @returns {BaseShape} The morphed shape
   */
  morph(fromShape, toShape, startFrame, duration, easing = "easeInOutCubic") {
    // For morphing, we'll animate all the common properties
    const endFrame = startFrame + duration;

    // Animate position, size and rotation
    this.animate(
      fromShape,
      "x",
      [
        { frame: startFrame, value: fromShape.x },
        { frame: endFrame, value: toShape.x },
      ],
      easing
    );

    this.animate(
      fromShape,
      "y",
      [
        { frame: startFrame, value: fromShape.y },
        { frame: endFrame, value: toShape.y },
      ],
      easing
    );

    this.animate(
      fromShape,
      "width",
      [
        { frame: startFrame, value: fromShape.width },
        { frame: endFrame, value: toShape.width },
      ],
      easing
    );

    this.animate(
      fromShape,
      "height",
      [
        { frame: startFrame, value: fromShape.height },
        { frame: endFrame, value: toShape.height },
      ],
      easing
    );

    this.animate(
      fromShape,
      "rotation",
      [
        { frame: startFrame, value: fromShape.rotation },
        { frame: endFrame, value: toShape.rotation },
      ],
      easing
    );

    // Animate colors
    this.animate(
      fromShape,
      "fill",
      [
        { frame: startFrame, value: fromShape.fill },
        { frame: endFrame, value: toShape.fill },
      ],
      easing
    );

    this.animate(
      fromShape,
      "stroke",
      [
        { frame: startFrame, value: fromShape.stroke },
        { frame: endFrame, value: toShape.stroke },
      ],
      easing
    );

    // For shape-specific properties
    if (fromShape instanceof Rectangle && toShape instanceof Rectangle) {
      // Animate corner radius for rectangles
      this.animate(
        fromShape,
        "cornerRadius",
        [
          { frame: startFrame, value: fromShape.cornerRadius || 0 },
          { frame: endFrame, value: toShape.cornerRadius || 0 },
        ],
        easing
      );
    }

    return fromShape;
  }

  /**
   * Create animation sequences that can be reused
   * @param {string} name - Name of the sequence
   * @param {function} sequenceFn - Function that defines the sequence
   * @returns {object} The animation API for chaining
   */
  defineSequence(name, sequenceFn) {
    if (typeof sequenceFn !== "function") {
      console.error("Sequence must be a function");
      return this;
    }

    this.sequences[name] = sequenceFn;
    return this;
  }

  /**
   * Apply a pre-defined animation sequence
   * @param {string} name - Name of the sequence to apply
   * @param {BaseShape|Array} target - Target shape or group to animate
   * @param {number} startFrame - Starting frame for the sequence
   * @param {object} options - Custom options for the sequence
   * @returns {BaseShape|Array} The animated object(s)
   */
  applySequence(name, target, startFrame = 0, options = {}) {
    if (!this.sequences[name]) {
      console.error(`Sequence "${name}" not found`);
      return target;
    }

    return this.sequences[name].call(this, target, startFrame, options);
  }

  /**
   * Create a camera shake effect
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} intensity - Shake intensity
   * @param {number} frequency - Shake frequency
   * @returns {object} The animation API for chaining
   */
  cameraShake(startFrame, duration, intensity = 10, frequency = 4) {
    // We'll implement a camera shake by creating a container for all objects
    // and animating its position

    // First, create a camera container if it doesn't exist
    if (!this.engine.cameraContainer) {
      // Create a Path as a camera container (won't be visible)
      this.engine.cameraContainer = new Path(0, 0);
      this.engine.cameraContainer.name = "CameraContainer";
      this.engine.cameraContainer.visible = false;

      // Override the render method to apply camera transformations
      const originalRender = this.engine.render;
      this.engine.render = function () {
        // Save the current state
        push();

        // Apply camera transform
        if (this.cameraContainer) {
          translate(-this.cameraContainer.x, -this.cameraContainer.y);
          rotate(-radians(this.cameraContainer.rotation));
        }

        // Call the original render
        originalRender.call(this);

        // Restore state
        pop();
      };
    }

    // Generate random shake keyframes
    const shakeKeyframes = [];
    const endFrame = startFrame + duration;
    const framesPerShake = Math.ceil(this.engine.timeline.fps / frequency);

    for (let frame = startFrame; frame <= endFrame; frame += framesPerShake) {
      // Random displacement within intensity
      const dx = (Math.random() * 2 - 1) * intensity;
      const dy = (Math.random() * 2 - 1) * intensity;

      shakeKeyframes.push({ frame: frame, value: { x: dx, y: dy } });
    }

    // Add final keyframe to reset position
    shakeKeyframes.push({ frame: endFrame, value: { x: 0, y: 0 } });

    // Animate the camera container
    this.animate(
      this.engine.cameraContainer,
      "x",
      shakeKeyframes.map((kf) => ({ frame: kf.frame, value: kf.value.x })),
      "linear"
    );

    this.animate(
      this.engine.cameraContainer,
      "y",
      shakeKeyframes.map((kf) => ({ frame: kf.frame, value: kf.value.y })),
      "linear"
    );

    return this;
  }

  /**
   * Create a flashing effect (for lightning, etc.)
   * @param {number} startFrame - Starting frame
   * @param {number} count - Number of flashes
   * @param {number} duration - Duration in frames
   * @param {Array} color - Flash color
   * @returns {BaseShape} The flash object
   */
  flash(startFrame, count = 1, duration = 10, color = [255, 255, 255]) {
    // Create a full-screen rectangle for the flash
    const flash = this.createShape("rectangle", {
      x: this.engine.canvasWidth / 2,
      y: this.engine.canvasHeight / 2,
      width: this.engine.canvasWidth,
      height: this.engine.canvasHeight,
      fill: Array.isArray(color)
        ? color(color[0], color[1], color[2], 0)
        : color,
      opacity: 0,
      name: "Flash",
    });

    // Create flash keyframes
    const keyframes = [];
    const flashDuration = duration / count;

    for (let i = 0; i < count; i++) {
      const flashStartFrame = startFrame + i * flashDuration;
      const peakFrame = flashStartFrame + flashDuration * 0.2;
      const endFlashFrame = flashStartFrame + flashDuration;

      keyframes.push(
        { frame: flashStartFrame, value: 0 },
        { frame: peakFrame, value: 200 },
        { frame: endFlashFrame, value: 0 }
      );
    }

    // Apply animation
    this.animate(flash, "opacity", keyframes, "easeOutQuad");

    return flash;
  }

  /**
   * Create a zoom effect
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {number} startScale - Starting scale
   * @param {number} endScale - Ending scale
   * @param {object} focusPoint - Point to focus on {x, y}
   * @param {string} easing - Easing function
   * @returns {object} The animation API for chaining
   */
  zoom(
    startFrame,
    duration,
    startScale = 1,
    endScale = 2,
    focusPoint = null,
    easing = "easeInOutQuad"
  ) {
    // Initialize camera container if not already done
    if (!this.engine.cameraContainer) {
      this.engine.cameraContainer = new Path(0, 0);
      this.engine.cameraContainer.name = "CameraContainer";
      this.engine.cameraContainer.visible = false;
      this.engine.cameraContainer.scale = 1;

      // Override the render method to apply camera transformations
      const originalRender = this.engine.render;
      this.engine.render = function () {
        // Save the current state
        push();

        // Apply camera transform
        if (this.cameraContainer) {
          // Apply scale around focus point
          const scale = this.cameraContainer.scale || 1;

          if (scale !== 1) {
            const tx = this.cameraContainer.focusX || this.canvasWidth / 2;
            const ty = this.cameraContainer.focusY || this.canvasHeight / 2;

            // Move to focus point, scale, and move back
            translate(tx, ty);
            scale(scale);
            translate(-tx, -ty);
          }

          // Apply any position offset
          translate(-this.cameraContainer.x, -this.cameraContainer.y);
          rotate(-radians(this.cameraContainer.rotation));
        }

        // Call the original render
        originalRender.call(this);

        // Restore state
        pop();
      };
    }

    // Set focus point
    if (focusPoint) {
      this.engine.cameraContainer.focusX = focusPoint.x;
      this.engine.cameraContainer.focusY = focusPoint.y;
    } else {
      this.engine.cameraContainer.focusX = this.engine.canvasWidth / 2;
      this.engine.cameraContainer.focusY = this.engine.canvasHeight / 2;
    }

    // Animate camera scale
    this.animate(
      this.engine.cameraContainer,
      "scale",
      [
        { frame: startFrame, value: startScale },
        { frame: startFrame + duration, value: endScale },
      ],
      easing
    );

    return this;
  }

  /**
   * Create a color cycling animation
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {Array} colors - Array of colors to cycle through
   * @param {string} property - Property to animate ('fill' or 'stroke')
   * @param {string} easing - Easing function
   * @returns {BaseShape} The shape for chaining
   */
  colorCycle(
    shape,
    startFrame,
    duration,
    colors,
    property = "fill",
    easing = "linear"
  ) {
    if (!Array.isArray(colors) || colors.length < 2) {
      console.error("At least two colors are required for color cycling");
      return shape;
    }

    const keyframes = [];
    const segmentDuration = duration / colors.length;

    // Create keyframes for each color
    colors.forEach((color, index) => {
      keyframes.push({
        frame: startFrame + index * segmentDuration,
        value: color,
      });
    });

    // Add final keyframe to complete the cycle
    keyframes.push({
      frame: startFrame + duration,
      value: colors[0],
    });

    // Apply animation
    this.animate(shape, property, keyframes, easing);

    return shape;
  }

  /**
   * Clear all objects and reset the animation
   * @returns {object} The animation API for chaining
   */
  clearAll() {
    this.engine.objects = [];
    this.createdObjects = [];
    this.engine.timeline.setFrame(0);
    return this;
  }

  /**
   * Set the animation duration
   * @param {number} seconds - Duration in seconds
   * @returns {object} The animation API for chaining
   */
  setDuration(seconds) {
    this.engine.timeline.setDuration(seconds);
    return this;
  }

  /**
   * Set the animation FPS
   * @param {number} fps - Frames per second
   * @returns {object} The animation API for chaining
   */
  setFPS(fps) {
    this.engine.timeline.setFPS(fps);
    return this;
  }

  /**
   * Reset the animation to the beginning
   * @returns {object} The animation API for chaining
   */
  reset() {
    this.engine.timeline.setFrame(0);
    return this;
  }

  /**
   * Play the animation
   * @param {boolean} loop - Whether to loop the animation
   * @returns {object} The animation API for chaining
   */
  play(loop = false) {
    this.engine.timeline.isLooping = loop;
    this.engine.play();
    return this;
  }

  /**
   * Pause the animation
   * @returns {object} The animation API for chaining
   */
  pause() {
    this.engine.pause();
    return this;
  }

  /**
   * Export the animation
   * @param {object} options - Export options
   * @returns {object} The animation API for chaining
   */
  export(options = {}) {
    // Default export options
    const exportOptions = {
      format: options.format || "webm",
      quality: options.quality || 0.8,
      fps: options.fps || this.engine.timeline.fps,
      filename: options.filename || `animation_${Date.now()}`,
    };

    // Configure recorder
    this.engine.recorder.setFormat(exportOptions.format);
    this.engine.recorder.setQuality(exportOptions.quality);
    this.engine.recorder.setFrameRate(exportOptions.fps);

    // Start recording
    this.engine.recorder.startRecording();

    return this;
  }

  /**
   * Save the current project
   * @param {string} filename - Optional filename
   * @returns {object} The animation API for chaining
   */
  saveProject(filename) {
    ProjectManager.saveProject(this.engine);
    return this;
  }

  /**
   * Load a project
   * @param {object} jsonData - Project data
   * @returns {object} The animation API for chaining
   */
  loadProject(jsonData) {
    ProjectManager.loadProject(this.engine, jsonData);
    // Clear our tracking array and refresh it
    this.createdObjects = [...this.engine.objects];
    return this;
  }

  /**
   * Set the background color
   * @param {color|string|Array} color - Background color
   * @returns {object} The animation API for chaining
   */
  setBackgroundColor(colorValue) {
    if (typeof colorValue === "string") {
      this.engine.backgroundColor = color(colorValue);
    } else if (Array.isArray(colorValue)) {
      this.engine.backgroundColor = color(...colorValue);
    } else {
      this.engine.backgroundColor = colorValue;
    }
    return this;
  }

  /**
   * Create a simple animation presets for common effects
   * @param {string} presetName - Name of the animation preset
   * @param {BaseShape} shape - Shape to animate
   * @param {number} startFrame - Starting frame
   * @param {object} options - Preset options
   * @returns {BaseShape} The animated shape
   */
  applyPreset(presetName, shape, startFrame, options = {}) {
    const duration = options.duration || 60;

    switch (presetName.toLowerCase()) {
      case "bounce":
        // Simple bounce animation
        return this.animate(
          shape,
          "y",
          [
            { frame: startFrame, value: shape.y },
            {
              frame: startFrame + duration * 0.4,
              value: shape.y - (options.height || 50),
            },
            {
              frame: startFrame + duration * 0.7,
              value: shape.y + (options.height || 50) * 0.2,
            },
            {
              frame: startFrame + duration * 0.85,
              value: shape.y - (options.height || 50) * 0.1,
            },
            { frame: startFrame + duration, value: shape.y },
          ],
          options.easing || "easeOutBounce"
        );

      case "wiggle":
        // Wiggle animation
        const angle = options.angle || 15;
        const cycles = options.cycles || 3;

        const rotKeyframes = [];
        const framesPerCycle = Math.floor(duration / cycles);

        for (let i = 0; i <= cycles; i++) {
          rotKeyframes.push({
            frame: startFrame + i * framesPerCycle,
            value: shape.rotation + (i % 2 === 0 ? angle : -angle),
          });
        }

        // Add final keyframe to return to original rotation
        rotKeyframes.push({
          frame: startFrame + duration,
          value: shape.rotation,
        });

        return this.animate(
          shape,
          "rotation",
          rotKeyframes,
          options.easing || "easeInOutSine"
        );

      case "pop":
        // Pop in animation
        const originalWidth = shape.width;
        const originalHeight = shape.height;

        // Set initial small size and 0 opacity
        shape.width = 0.1;
        shape.height = 0.1;
        shape.opacity = 0;

        this.animate(
          shape,
          "width",
          [
            { frame: startFrame, value: 0.1 },
            { frame: startFrame + duration * 0.6, value: originalWidth * 1.2 },
            { frame: startFrame + duration, value: originalWidth },
          ],
          options.easing || "easeOutBack"
        );

        this.animate(
          shape,
          "height",
          [
            { frame: startFrame, value: 0.1 },
            { frame: startFrame + duration * 0.6, value: originalHeight * 1.2 },
            { frame: startFrame + duration, value: originalHeight },
          ],
          options.easing || "easeOutBack"
        );

        this.animate(
          shape,
          "opacity",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration * 0.3, value: 255 },
          ],
          "easeOutQuad"
        );

        return shape;

      case "dropIn":
        // Drop in from top
        const dropStartY = options.startY || -100;  // Renamed from startY to dropStartY

        return this.animate(
          shape,
          "y",
          [
            { frame: startFrame, value: dropStartY },
            { frame: startFrame + duration * 0.7, value: shape.y + 20 },
            { frame: startFrame + duration * 0.85, value: shape.y - 10 },
            { frame: startFrame + duration, value: shape.y },
          ],
          options.easing || "easeOutBounce"
        );

      case "slideIn":
        // Slide in from a direction
        const direction = options.direction || "left";
        let slideStartX = shape.x;  // Renamed from startX to slideStartX
        let slideStartY = shape.y;  // Renamed from startY to slideStartY

        switch (direction) {
          case "left":
            slideStartX = options.startX || -100;
            break;
          case "right":
            slideStartX = options.startX || this.engine.canvasWidth + 100;
            break;
          case "top":
            slideStartY = options.startY || -100;
            break;
          case "bottom":
            slideStartY = options.startY || this.engine.canvasHeight + 100;
            break;
        }

        return this.moveFromTo(
          shape,
          startFrame,
          startFrame + duration,
          slideStartX,
          slideStartY,
          shape.x,
          shape.y,
          options.easing || "easeOutQuint"
        );

      case "fadeRotateIn":
        // Fade in with rotation
        shape.opacity = 0;
        const startRotation = options.startRotation || -90;

        this.animate(
          shape,
          "opacity",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration, value: 255 },
          ],
          "easeOutQuad"
        );

        this.animate(
          shape,
          "rotation",
          [
            { frame: startFrame, value: startRotation },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeOutQuart"
        );

        return shape;

      case "pulseAndShrink":
        // Pulse and then shrink away
        return this.animate(
          shape,
          "width",
          [
            { frame: startFrame, value: shape.width },
            { frame: startFrame + duration * 0.3, value: shape.width * 1.3 },
            { frame: startFrame + duration * 0.6, value: shape.width * 1.1 },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeInOutQuad"
        );

      case "typewriter":
        if (!(shape instanceof Text)) {
          console.error(
            "Typewriter effect can only be applied to Text objects"
          );
          return shape;
        }

        return this.typeText(
          shape,
          startFrame,
          options.text || shape.text,
          duration,
          options.easing || "linear",
          {
            cursor: options.cursor !== false,
            cursorChar: options.cursorChar || "|",
            cursorBlinkRate: options.cursorBlinkRate || 15,
          }
        );

      case "shimmer":
        // Create a shimmer/highlight effect
        const originalFill = shape.fill;
        const highlightColor =
          options.highlightColor || color(255, 255, 255, 200);

        this.animate(
          shape,
          "fill",
          [
            { frame: startFrame, value: originalFill },
            { frame: startFrame + duration * 0.3, value: highlightColor },
            { frame: startFrame + duration * 0.5, value: originalFill },
            { frame: startFrame + duration * 0.7, value: highlightColor },
            { frame: startFrame + duration, value: originalFill },
          ],
          options.easing || "easeInOutSine"
        );

        return shape;

      default:
        console.error(`Animation preset "${presetName}" not found`);
        return shape;
    }
  }

  /**
   * Add a new animation frame
   * @param {number} frame - Frame number to add
   * @param {function} callback - Function to call on this frame
   * @returns {object} The animation API for chaining
   */
  addFrameAction(frame, callback) {
    if (typeof callback !== "function") {
      console.error("Frame action must be a function");
      return this;
    }

    // Create a unique marker name
    const markerId = `action_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Add a marker at this frame
    this.engine.timeline.addMarker(frame, markerId);

    // Store the callback
    if (!this.engine.frameActions) {
      this.engine.frameActions = {};

      // Add hook to check for frame actions
      const originalUpdate = this.engine.update;
      this.engine.update = function () {
        originalUpdate.call(this);

        // Check if there are actions for the current frame
        const currentFrame = this.timeline.currentFrame;
        if (this.frameActions && this.frameActions[currentFrame]) {
          // Execute all actions for this frame
          for (const action of this.frameActions[currentFrame]) {
            action(this);
          }

          // Remove the actions so they don't run again
          delete this.frameActions[currentFrame];
        }
      };
    }

    // Store the callback by frame
    if (!this.engine.frameActions[frame]) {
      this.engine.frameActions[frame] = [];
    }

    this.engine.frameActions[frame].push(callback);

    return this;
  }

  /**
   * Create a scene transition effect
   * @param {number} startFrame - Starting frame
   * @param {number} duration - Duration in frames
   * @param {string} type - Transition type (fade, wipe, etc.)
   * @param {object} options - Transition options
   * @returns {object} The animation API for chaining
   */
  transition(startFrame, duration, type = "fade", options = {}) {
    // Create a full-screen shape for the transition
    const transitionShape = this.createShape("rectangle", {
      x: this.engine.canvasWidth / 2,
      y: this.engine.canvasHeight / 2,
      width: this.engine.canvasWidth,
      height: this.engine.canvasHeight,
      fill: options.color || color(0, 0, 0),
      opacity: 0,
      name: "Transition",
    });

    switch (type.toLowerCase()) {
      case "fade":
        // Simple fade to black and back
        this.animate(
          transitionShape,
          "opacity",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration / 2, value: 255 },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeInOutQuad"
        );
        break;

      case "wipe":
        // Wipe transition using scaling
        const direction = options.direction || "left";

        transitionShape.opacity = 255;

        if (direction === "left" || direction === "right") {
          transitionShape.width = 0;

          if (direction === "right") {
            transitionShape.x = this.engine.canvasWidth;
          } else {
            transitionShape.x = 0;
          }

          this.animate(
            transitionShape,
            "width",
            [
              { frame: startFrame, value: 0 },
              {
                frame: startFrame + duration / 2,
                value: this.engine.canvasWidth,
              },
              { frame: startFrame + duration, value: 0 },
            ],
            options.easing || "easeInOutCubic"
          );

          this.animate(
            transitionShape,
            "x",
            [
              {
                frame: startFrame,
                value: direction === "right" ? this.engine.canvasWidth : 0,
              },
              {
                frame: startFrame + duration / 2,
                value: this.engine.canvasWidth / 2,
              },
              {
                frame: startFrame + duration,
                value: direction === "right" ? 0 : this.engine.canvasWidth,
              },
            ],
            options.easing || "easeInOutCubic"
          );
        } else {
          transitionShape.height = 0;

          if (direction === "bottom") {
            transitionShape.y = this.engine.canvasHeight;
          } else {
            transitionShape.y = 0;
          }

          this.animate(
            transitionShape,
            "height",
            [
              { frame: startFrame, value: 0 },
              {
                frame: startFrame + duration / 2,
                value: this.engine.canvasHeight,
              },
              { frame: startFrame + duration, value: 0 },
            ],
            options.easing || "easeInOutCubic"
          );

          this.animate(
            transitionShape,
            "y",
            [
              {
                frame: startFrame,
                value: direction === "bottom" ? this.engine.canvasHeight : 0,
              },
              {
                frame: startFrame + duration / 2,
                value: this.engine.canvasHeight / 2,
              },
              {
                frame: startFrame + duration,
                value: direction === "bottom" ? 0 : this.engine.canvasHeight,
              },
            ],
            options.easing || "easeInOutCubic"
          );
        }
        break;

      case "iris":
        // Iris transition (circle that grows/shrinks)
        const irisShape = this.createShape("circle", {
          x: options.x || this.engine.canvasWidth / 2,
          y: options.y || this.engine.canvasHeight / 2,
          size: 0,
          fill: options.color || color(0, 0, 0),
          name: "IrisTransition",
        });

        // Calculate the maximum diameter needed to cover the screen
        const maxDiameter = Math.sqrt(
          Math.pow(this.engine.canvasWidth, 2) +
            Math.pow(this.engine.canvasHeight, 2)
        );

        this.animate(
          irisShape,
          "width",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration / 2, value: maxDiameter },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeInOutCubic"
        );

        this.animate(
          irisShape,
          "height",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration / 2, value: maxDiameter },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeInOutCubic"
        );

        // Remove the rectangle transition
        this.engine.removeObject(transitionShape);
        break;

      case "dissolve":
        // Create a noise-based dissolve transition
        const dissolveFrames = Math.floor(duration / 2);

        // Create a noise pattern for the dissolve
        this.addFrameAction(startFrame, (engine) => {
          // Start the dissolve at this frame
          transitionShape.customProperties = {
            dissolve: true,
            noiseScale: options.noiseScale || 0.1,
            threshold: 0,
          };

          // Override render to apply noise pattern
          const originalRenderShape = transitionShape._renderShape;
          transitionShape._renderShape = function () {
            if (this.customProperties.dissolve) {
              noiseDetail(2, 0.5);

              // Create a pixelated dissolve effect
              for (let y = 0; y < engine.canvasHeight; y += 5) {
                for (let x = 0; x < engine.canvasWidth; x += 5) {
                  const noiseVal = noise(
                    x * this.customProperties.noiseScale,
                    y * this.customProperties.noiseScale
                  );

                  if (noiseVal > this.customProperties.threshold) {
                    rect(x - this.x, y - this.y, 5, 5);
                  }
                }
              }
            } else {
              originalRenderShape.call(this);
            }
          };
        });

        // Animate the dissolve threshold
        this.animate(
          transitionShape,
          "customProperties.threshold",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + dissolveFrames, value: 1 },
            { frame: startFrame + dissolveFrames + 1, value: 0 },
            { frame: startFrame + duration, value: 1 },
          ],
          "linear"
        );

        break;

      default:
        console.warn(`Transition type "${type}" not recognized, using fade`);
        this.animate(
          transitionShape,
          "opacity",
          [
            { frame: startFrame, value: 0 },
            { frame: startFrame + duration / 2, value: 255 },
            { frame: startFrame + duration, value: 0 },
          ],
          options.easing || "easeInOutQuad"
        );
    }

    // Add frame action to execute callback at middle of transition
    if (options.onTransition && typeof options.onTransition === "function") {
      this.addFrameAction(
        startFrame + Math.floor(duration / 2),
        options.onTransition
      );
    }

    return transitionShape;
  }
}

/**
 * FlowPath - Creates a flowing curved path between two shapes
 * Perfect for showing data flow or connections in diagrams
 */
class FlowPath extends BaseShape {
  constructor(startX, startY, endX, endY, animationEngine = null) {
    // Use the midpoint as the object center
    super((startX + endX) / 2, (startY + endY) / 2);

    // Reference to animation engine
    this.animationEngine = animationEngine;

    // Start and end positions
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    // Path style properties
    this.pathStyle = "bezier"; // "bezier", "wave", "step", "arc"
    this.curveIntensity = 0.5; // Controls the curve's intensity (0-1)
    this.waveAmplitude = 20; // Controls wave height
    this.waveFrequency = 3; // Controls number of waves
    this.animationSpeed = 0; // Speed of flowing animation (0 = static)
    this.arrowStart = false; // Whether to show arrow at start
    this.arrowEnd = true; // Whether to show arrow at end
    this.arrowSize = 10; // Size of the arrow
    this.flowParticles = 0; // Number of particles flowing along the path (0 = none)
    this.particleSize = 5; // Size of flow particles
    this.lineStyle = "solid"; // "solid", "dashed", "dotted"
    this.dashLength = 10; // Length of dashes if dashed
    this.name = "FlowPath";

    // Animation state for flowing effects
    this._animationOffset = 0;
    this._particles = [];
    this._lastFrameTime = Date.now(); // Track time between frames for smooth animation

    // Update dimensions based on points
    this._updateDimensions();

    // Initialize flow particles if needed
    this._initializeParticles();
  }

  /**
   * Set the animation engine reference
   */
  setAnimationEngine(engine) {
    this.animationEngine = engine;
  }

  /**
   * Check if animation is currently playing
   */
  isAnimationPlaying() {
    if (this.animationEngine) {
      return this.animationEngine.isPlaying;
    }
    // Default to true if no animation engine is attached
    return true;
  }

  /**
   * Set the start point of the path
   */
  setStartPoint(x, y) {
    this.startX = x;
    this.startY = y;
    this._updateDimensions();
    this._resetParticles();
  }

  /**
   * Set the end point of the path
   */
  setEndPoint(x, y) {
    this.endX = x;
    this.endY = y;
    this._updateDimensions();
    this._resetParticles();
  }

  /**
   * Connect two shapes with this flow path
   * @param {BaseShape} startShape - The source shape
   * @param {BaseShape} endShape - The target shape
   * @param {string} startConnection - Connection point on start ("top", "right", "bottom", "left", "center")
   * @param {string} endConnection - Connection point on end ("top", "right", "bottom", "left", "center")
   */
  connectShapes(
    startShape,
    endShape,
    startConnection = "center",
    endConnection = "center"
  ) {
    // Get connection points based on shape's bounding boxes
    const startPoint = this._getConnectionPoint(startShape, startConnection);
    const endPoint = this._getConnectionPoint(endShape, endConnection);

    // Set path endpoints
    this.setStartPoint(startPoint.x, startPoint.y);
    this.setEndPoint(endPoint.x, endPoint.y);
  }

  /**
   * Get connection point for a shape based on specified position
   */
  _getConnectionPoint(shape, connection) {
    const bb = shape.getBoundingBox();
    const centerX = bb.x + bb.width / 2;
    const centerY = bb.y + bb.height / 2;

    switch (connection) {
      case "top":
        return { x: centerX, y: bb.y };
      case "right":
        return { x: bb.x + bb.width, y: centerY };
      case "bottom":
        return { x: centerX, y: bb.y + bb.height };
      case "left":
        return { x: bb.x, y: centerY };
      case "center":
      default:
        return { x: centerX, y: centerY };
    }
  }

  /**
   * Update the dimensions and position of the path
   */
  _updateDimensions() {
    // Center point of the path
    this.x = (this.startX + this.endX) / 2;
    this.y = (this.startY + this.endY) / 2;

    // Calculate size including curve intensity
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Account for curve intensity and wave amplitude in dimensions
    const curveOffset = distance * this.curveIntensity;
    const maxAmplitude = Math.max(this.waveAmplitude, curveOffset);

    // Make width and height large enough to include the full curve
    this.width = Math.abs(dx) + maxAmplitude * 2;
    this.height = Math.abs(dy) + maxAmplitude * 2;
  }

  /**
   * Initialize flow particles
   */
  _initializeParticles() {
    this._particles = [];
    if (this.flowParticles <= 0) return;

    for (let i = 0; i < this.flowParticles; i++) {
      this._particles.push({
        t: i / this.flowParticles, // position along path (0-1)
        size: this.particleSize * (0.7 + Math.random() * 0.6), // slightly varied sizes
      });
    }
  }

  /**
   * Reset particle positions
   */
  _resetParticles() {
    this._initializeParticles();
  }

  /**
   * Render the shape with animation engine state awareness
   */
  render() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.scaleX, this.scaleY);
    
    // Apply stroke properties
    if (this.strokeWeight > 0) {
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
    } else {
      noStroke();
    }
    
    // Apply fill
    if (this.fill) {
      fill(this.fill);
    } else {
      noFill();
    }
    
    // Render the actual shape with animation state
    this._renderShape();
    
    pop();
  }

  /**
   * Render the path with animation state awareness
   */
  _renderShape() {
    // Save local coordinates relative to the center
    const localStartX = this.startX - this.x;
    const localStartY = this.startY - this.y;
    const localEndX = this.endX - this.x;
    const localEndY = this.endY - this.y;

    // Calculate control points for the path
    const points = this._calculatePathPoints(
      localStartX,
      localStartY,
      localEndX,
      localEndY
    );

    // Don't fill the path itself
    noFill();

    // Draw the path based on line style
    switch (this.lineStyle) {
      case "dashed":
        this._drawDashedPath(points);
        break;
      case "dotted":
        this._drawDottedPath(points);
        break;
      default:
        this._drawSolidPath(points);
    }

    // Draw flow particles if needed - these should still be filled
    if (this.flowParticles > 0 && this.animationSpeed > 0) {
      this._drawFlowParticles(points);
    }

    // Draw arrows if needed - these should still be filled
    noFill(); // Reset to no fill
    if (this.arrowEnd) {
      // Restore fill for arrow
      fill(this.stroke);
      this._drawArrowHead(
        localEndX,
        localEndY,
        points[points.length - 2].x,
        points[points.length - 2].y
      );
    }

    if (this.arrowStart) {
      // Restore fill for arrow
      fill(this.stroke);
      this._drawArrowHead(localStartX, localStartY, points[1].x, points[1].y);
    }

    // Update particle positions for the next frame - only if animation is playing
    if (this.flowParticles > 0 && this.animationSpeed > 0) {
      this._updateParticlePositions();
    }
  }

  /**
   * Calculate points along the path based on style
   */
  _calculatePathPoints(startX, startY, endX, endY) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const points = [];

    switch (this.pathStyle) {
      case "bezier":
        // Bezier curve with control points based on distance and intensity
        const controlOffset = distance * this.curveIntensity;
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;

        // Calculate control points
        const cx1 = startX + Math.cos(angle) * distance * 0.3;
        const cy1 =
          startY +
          Math.sin(angle) * distance * 0.3 +
          Math.cos(perpAngle) * controlOffset;
        const cx2 = endX - Math.cos(angle) * distance * 0.3;
        const cy2 =
          endY -
          Math.sin(angle) * distance * 0.3 +
          Math.cos(perpAngle) * controlOffset;

        // Generate points along the bezier curve
        const steps = Math.max(20, Math.floor(distance / 10));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = this._bezierPoint(startX, cx1, cx2, endX, t);
          const y = this._bezierPoint(startY, cy1, cy2, endY, t);
          points.push({ x, y });
        }
        break;

      case "wave":
        // Sine wave along the straight line
        const steps2 = Math.max(20, Math.floor(distance / 10));
        for (let i = 0; i <= steps2; i++) {
          const t = i / steps2;

          // Base position along line
          const baseX = startX + dx * t;
          const baseY = startY + dy * t;

          // Wave offset
          const wavePhase =
            t * Math.PI * 2 * this.waveFrequency + this._animationOffset;
          const waveOffset = Math.sin(wavePhase) * this.waveAmplitude;

          // Calculate perpendicular offset
          const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
          const offsetX = Math.cos(perpAngle) * waveOffset;
          const offsetY = Math.sin(perpAngle) * waveOffset;

          points.push({ x: baseX + offsetX, y: baseY + offsetY });
        }
        break;

      case "step":
        // Create step pattern (orthogonal lines)
        points.push({ x: startX, y: startY });

        // Determine whether to do horizontal or vertical first
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal first
          points.push({ x: startX + dx * 0.5, y: startY });
          points.push({ x: startX + dx * 0.5, y: endY });
        } else {
          // Vertical first
          points.push({ x: startX, y: startY + dy * 0.5 });
          points.push({ x: endX, y: startY + dy * 0.5 });
        }

        points.push({ x: endX, y: endY });
        break;

      case "arc":
        // Create an arc path
        const arcSteps = Math.max(20, Math.floor(distance / 10));
        const arcAngle = Math.atan2(dy, dx);
        const arcRadius = distance / 2 / Math.sin(Math.PI / 4); // adjusted for nice arc
        const arcCenterX = (startX + endX) / 2;
        const arcCenterY = (startY + endY) / 2;
        const arcStartAngle = arcAngle - Math.PI / 2;
        const arcEndAngle = arcAngle + Math.PI / 2;

        for (let i = 0; i <= arcSteps; i++) {
          const t = i / arcSteps;
          const angle = arcStartAngle + (arcEndAngle - arcStartAngle) * t;
          const x =
            arcCenterX + Math.cos(angle) * arcRadius * this.curveIntensity;
          const y =
            arcCenterY + Math.sin(angle) * arcRadius * this.curveIntensity;
          points.push({ x, y });
        }
        break;

      default:
        // Simple straight line
        points.push({ x: startX, y: startY });
        points.push({ x: endX, y: endY });
    }

    return points;
  }

  /**
   * Draw a solid line along the path
   */
  _drawSolidPath(points) {
    beginShape();
    for (const point of points) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  /**
   * Draw a dashed line along the path
   */
  _drawDashedPath(points) {
    const dashLength = this.dashLength;
    let currentLength = 0;
    let drawing = true;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const segmentLength = this._distance(p1, p2);

      let startT = 0;
      while (startT < 1) {
        const remainingDash = drawing
          ? dashLength - currentLength
          : dashLength - currentLength;
        const segmentT = remainingDash / segmentLength;
        let endT = startT + segmentT;

        if (endT > 1) endT = 1;

        if (drawing) {
          const startX = p1.x + (p2.x - p1.x) * startT;
          const startY = p1.y + (p2.y - p1.y) * startT;
          const endX = p1.x + (p2.x - p1.x) * endT;
          const endY = p1.y + (p2.y - p1.y) * endT;

          line(startX, startY, endX, endY);
        }

        const usedLength = segmentLength * (endT - startT);
        currentLength += usedLength;

        if (currentLength >= dashLength) {
          currentLength = 0;
          drawing = !drawing;
        }

        startT = endT;
      }
    }
  }

  /**
   * Draw a dotted line along the path
   */
  _drawDottedPath(points) {
    const dotSpacing = this.dashLength;
    let accumulatedLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const segmentLength = this._distance(p1, p2);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      // Draw dots along this segment
      while (accumulatedLength < segmentLength) {
        const t = accumulatedLength / segmentLength;
        const x = p1.x + dx * t;
        const y = p1.y + dy * t;

        ellipse(x, y, 3, 3);
        accumulatedLength += dotSpacing;
      }

      accumulatedLength -= segmentLength;
    }
  }

  /**
   * Draw flow particles along the path
   */
  _drawFlowParticles(points) {
    // Save current stroke setting
    const currentStroke = this.stroke;

    // Set particles to use the fill color specified
    fill(this.fill);
    noStroke();

    for (const particle of this._particles) {
      // Calculate position on path
      const position = this._getPositionOnPath(points, particle.t);

      // Draw particle
      ellipse(position.x, position.y, particle.size, particle.size);
    }

    // Restore stroke for other parts
    stroke(currentStroke);
    noFill();
  }

  /**
   * Update particle positions for animation
   * Now respects animation engine state
   */
  _updateParticlePositions() {
    if (this.animationSpeed <= 0) return;
    
    // Only animate if the animation engine is playing
    const isPlaying = this.isAnimationPlaying();
    if (!isPlaying) return;

    // Calculate time delta for smooth animation
    const now = Date.now();
    const deltaTime = (now - this._lastFrameTime) / 1000; // in seconds
    this._lastFrameTime = now;

    // Update global animation offset - normalized to 60fps equivalent
    this._animationOffset += 0.01 * this.animationSpeed * Math.min(deltaTime * 60, 2);

    // Update each particle position
    for (const particle of this._particles) {
      particle.t += 0.005 * this.animationSpeed * Math.min(deltaTime * 60, 2);
      if (particle.t > 1) {
        particle.t = 0;
        particle.size = this.particleSize * (0.7 + Math.random() * 0.6);
      }
    }
  }

  /**
   * Get a position on the path at a specific progress amount (0-1)
   */
  _getPositionOnPath(points, t) {
    if (points.length < 2) return { x: 0, y: 0 };
    if (t <= 0) return points[0];
    if (t >= 1) return points[points.length - 1];

    // Calculate total path length
    let totalLength = 0;
    const segmentLengths = [];

    for (let i = 0; i < points.length - 1; i++) {
      const length = this._distance(points[i], points[i + 1]);
      segmentLengths.push(length);
      totalLength += length;
    }

    // Target distance along path
    const targetDistance = totalLength * t;

    // Find segment containing this distance
    let currentDistance = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      if (currentDistance + segmentLengths[i] >= targetDistance) {
        // Found the segment - calculate precise position
        const segmentProgress =
          (targetDistance - currentDistance) / segmentLengths[i];
        const p1 = points[i];
        const p2 = points[i + 1];

        return {
          x: p1.x + (p2.x - p1.x) * segmentProgress,
          y: p1.y + (p2.y - p1.y) * segmentProgress,
        };
      }

      currentDistance += segmentLengths[i];
    }

    // Shouldn't reach here, but just in case
    return points[points.length - 1];
  }

  /**
   * Calculate distance between two points
   */
  _distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Draw arrow head at the end of a line
   */
  _drawArrowHead(x, y, fromX, fromY) {
    // Calculate angle of the line
    const angle = Math.atan2(y - fromY, x - fromX);

    push();
    translate(x, y);
    rotate(angle);

    // Use the stroke color for filling the arrow
    fill(this.stroke);

    // Draw arrow head
    beginShape();
    vertex(0, 0);
    vertex(-this.arrowSize, -this.arrowSize / 2);
    vertex(-this.arrowSize, this.arrowSize / 2);
    endShape(CLOSE);

    pop();
  }

  /**
   * Calculate a point on a cubic bezier curve
   */
  _bezierPoint(a, b, c, d, t) {
    // Cubic Bezier formula: (1-t)³a + 3(1-t)²tb + 3(1-t)t²c + t³d
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    return mt3 * a + 3 * mt2 * t * b + 3 * mt * t2 * c + t3 * d;
  }

  /**
   * Hit testing for the path
   */
  _pointInShape(localX, localY) {
    // Real coordinates in shape space
    const realX = localX + this.x;
    const realY = localY + this.y;

    // Calculate points along the path
    const localStartX = this.startX - this.x;
    const localStartY = this.startY - this.y;
    const localEndX = this.endX - this.x;
    const localEndY = this.endY - this.y;

    const points = this._calculatePathPoints(
      localStartX,
      localStartY,
      localEndX,
      localEndY
    );

    // Check if point is near the path
    const threshold = Math.max(this.strokeWeight, 5); // Hit area thickness

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // Check distance to line segment
      const distance = this._distToSegment(
        realX - this.x,
        realY - this.y,
        p1.x,
        p1.y,
        p2.x,
        p2.y
      );
      if (distance <= threshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate distance from a point to a line segment
   */
  _distToSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;

    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate the bounding box
   */
  getBoundingBox() {
    // Calculate points along the path
    const localStartX = this.startX - this.x;
    const localStartY = this.startY - this.y;
    const localEndX = this.endX - this.x;
    const localEndY = this.endY - this.y;

    const points = this._calculatePathPoints(
      localStartX,
      localStartY,
      localEndX,
      localEndY
    );

    // Find min/max coordinates
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for (let i = 1; i < points.length; i++) {
      minX = Math.min(minX, points[i].x);
      minY = Math.min(minY, points[i].y);
      maxX = Math.max(maxX, points[i].x);
      maxY = Math.max(maxY, points[i].y);
    }

    // Add some padding for stroke and arrows
    const padding = Math.max(this.strokeWeight, this.arrowSize) + 5;

    return {
      x: this.x + minX - padding,
      y: this.y + minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }

  /**
   * Handle updating to a specific timeline frame
   * This integrates with the animation engine's timeline functionality
   */
  updateToFrame(frame) {
    // Implement keyframe-based animation here if needed
    // This allows the FlowPath to respond to timeline animations
    
    // Call the parent class method if it exists
    if (super.updateToFrame) {
      super.updateToFrame(frame);
    }
  }
}
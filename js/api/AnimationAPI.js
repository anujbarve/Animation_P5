class AnimationAPI {
    constructor(engine) {
        this.engine = engine;
    }
    
    // Create a shape with a type and initial properties
    createShape(type, props = {}) {
        let shape;
        const x = props.x || this.engine.canvasWidth / 2;
        const y = props.y || this.engine.canvasHeight / 2;
        
        switch(type) {
            case 'circle':
                shape = new Circle(x, y, props.size || 100);
                break;
            case 'rectangle':
                shape = new Rectangle(x, y, props.width || 100, props.height || 80);
                if (props.cornerRadius !== undefined) {
                    shape.cornerRadius = props.cornerRadius;
                }
                break;
            case 'text':
                shape = new Text(x, y, props.text || "Text");
                if (props.fontSize) shape.fontSize = props.fontSize;
                if (props.fontFamily) shape.fontFamily = props.fontFamily;
                break;
            case 'path':
                shape = new Path(x, y);
                if (props.points && Array.isArray(props.points)) {
                    props.points.forEach(point => {
                        shape.addPoint(point.x, point.y);
                    });
                }
                shape.closed = props.closed !== undefined ? props.closed : false;
                break;
            default:
                console.error('Unknown shape type:', type);
                return null;
        }
        
        // Apply common properties
        if (props.fill) shape.fill = props.fill;
        if (props.stroke) shape.stroke = props.stroke;
        if (props.strokeWeight) shape.strokeWeight = props.strokeWeight;
        if (props.opacity !== undefined) shape.opacity = props.opacity;
        if (props.rotation !== undefined) shape.rotation = props.rotation;
        if (props.name) shape.name = props.name;
        
        // Add to engine
        this.engine.addObject(shape);
        return shape;
    }
    
    // Animate a property with multiple keyframes
    animate(shape, property, keyframes, easingType = 'easeInOutCubic') {
        if (!shape || !keyframes || !Array.isArray(keyframes)) {
            console.error('Invalid animation parameters');
            return;
        }
        
        keyframes.forEach(kf => {
            shape.addKeyframe(
                property, 
                kf.frame, 
                kf.value, 
                kf.easing || easingType
            );
        });
        
        return shape; // For chaining
    }
    
    // Fade in animation
    fadeIn(shape, startFrame = 0, duration = 30, easing = 'easeOutCubic') {
        shape.opacity = 0;
        this.animate(shape, 'opacity', [
            {frame: startFrame, value: 0},
            {frame: startFrame + duration, value: 255}
        ], easing);
        return shape;
    }
    
    // Fade out animation
    fadeOut(shape, startFrame, duration = 30, easing = 'easeInCubic') {
        this.animate(shape, 'opacity', [
            {frame: startFrame, value: 255},
            {frame: startFrame + duration, value: 0}
        ], easing);
        return shape;
    }
    
    // Move from point A to B
    moveFromTo(shape, startFrame, endFrame, fromX, fromY, toX, toY, easing = 'easeInOutCubic') {
        this.animate(shape, 'x', [
            {frame: startFrame, value: fromX},
            {frame: endFrame, value: toX}
        ], easing);
        
        this.animate(shape, 'y', [
            {frame: startFrame, value: fromY},
            {frame: endFrame, value: toY}
        ], easing);
        
        return shape;
    }
    
    // Scale animation
    scale(shape, startFrame, endFrame, fromScale, toScale, easing = 'easeInOutQuad') {
        // For circles, adjust width (diameter)
        if (shape instanceof Circle) {
            this.animate(shape, 'width', [
                {frame: startFrame, value: fromScale},
                {frame: endFrame, value: toScale}
            ], easing);
            return shape;
        }
        
        // For rectangles, adjust both width and height
        if (shape instanceof Rectangle) {
            const aspectRatio = shape.height / shape.width;
            
            this.animate(shape, 'width', [
                {frame: startFrame, value: fromScale},
                {frame: endFrame, value: toScale}
            ], easing);
            
            this.animate(shape, 'height', [
                {frame: startFrame, value: fromScale * aspectRatio},
                {frame: endFrame, value: toScale * aspectRatio}
            ], easing);
        }
        
        return shape;
    }
    
    // Rotation animation
    rotate(shape, startFrame, endFrame, fromAngle, toAngle, easing = 'easeInOutCubic') {
        this.animate(shape, 'rotation', [
            {frame: startFrame, value: fromAngle},
            {frame: endFrame, value: toAngle}
        ], easing);
        
        return shape;
    }
    
    // Create a motion path animation (object follows a path)
    followPath(shape, path, startFrame, endFrame, easing = 'linear') {
        if (!Array.isArray(path) || path.length < 2) {
            console.error('Path must be an array of at least 2 points');
            return shape;
        }
        
        // Calculate total path length for even distribution
        let totalLength = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const dx = path[i+1].x - path[i].x;
            const dy = path[i+1].y - path[i].y;
            totalLength += Math.sqrt(dx*dx + dy*dy);
        }
        
        // Create keyframes distributed by distance
        const xKeyframes = [];
        const yKeyframes = [];
        
        let accumulatedLength = 0;
        
        for (let i = 0; i < path.length; i++) {
            if (i > 0) {
                const dx = path[i].x - path[i-1].x;
                const dy = path[i].y - path[i-1].y;
                accumulatedLength += Math.sqrt(dx*dx + dy*dy);
            }
            
            const progress = accumulatedLength / totalLength;
            const frame = startFrame + Math.round(progress * (endFrame - startFrame));
            
            xKeyframes.push({frame: frame, value: path[i].x});
            yKeyframes.push({frame: frame, value: path[i].y});
        }
        
        // Ensure the first and last frames are exactly as specified
        xKeyframes[0].frame = startFrame;
        yKeyframes[0].frame = startFrame;
        xKeyframes[xKeyframes.length-1].frame = endFrame;
        yKeyframes[yKeyframes.length-1].frame = endFrame;
        
        // Apply the animations
        this.animate(shape, 'x', xKeyframes, easing);
        this.animate(shape, 'y', yKeyframes, easing);
        
        return shape;
    }
    
    // Create a group of objects and animate them together
    createGroup(count, type, baseProps = {}, arrangement = 'circle') {
        const group = [];
        const centerX = baseProps.centerX || this.engine.canvasWidth / 2;
        const centerY = baseProps.centerY || this.engine.canvasHeight / 2;
        const radius = baseProps.radius || 150;
        
        for (let i = 0; i < count; i++) {
            const props = {...baseProps};
            
            // Position based on arrangement
            if (arrangement === 'circle') {
                const angle = (i / count) * Math.PI * 2;
                props.x = centerX + Math.cos(angle) * radius;
                props.y = centerY + Math.sin(angle) * radius;
            } 
            else if (arrangement === 'grid') {
                const cols = Math.ceil(Math.sqrt(count));
                const rows = Math.ceil(count / cols);
                const cellWidth = (radius * 2) / cols;
                const cellHeight = (radius * 2) / rows;
                
                const col = i % cols;
                const row = Math.floor(i / cols);
                
                props.x = centerX - radius + (col + 0.5) * cellWidth;
                props.y = centerY - radius + (row + 0.5) * cellHeight;
            }
            else if (arrangement === 'line') {
                props.x = centerX - radius + (2 * radius * i) / (count - 1 || 1);
                props.y = centerY;
            }
            
            // Create the shape
            const shape = this.createShape(type, props);
            group.push(shape);
        }
        
        return group;
    }
    
    // Animate a group with staggered timing
    animateGroup(group, property, keyframes, staggerFrames = 5, easingType = 'easeInOutCubic') {
        if (!Array.isArray(group)) {
            console.error('Group must be an array of shapes');
            return;
        }
        
        group.forEach((shape, index) => {
            // Create staggered keyframes
            const staggeredKeyframes = keyframes.map(kf => ({
                frame: kf.frame + (index * staggerFrames),
                value: kf.value,
                easing: kf.easing || easingType
            }));
            
            // Apply animation
            this.animate(shape, property, staggeredKeyframes);
        });
        
        return group;
    }
    
    // Create a wave effect on a group of objects
    waveEffect(group, property, startFrame, duration, minValue, maxValue, easing = 'easeInOutSine') {
        if (!Array.isArray(group) || group.length === 0) {
            console.error('Group must be a non-empty array of shapes');
            return;
        }
        
        const framesPerObject = Math.floor(duration / group.length);
        
        group.forEach((shape, index) => {
            const delay = index * framesPerObject;
            
            this.animate(shape, property, [
                { frame: startFrame + delay, value: minValue },
                { frame: startFrame + delay + (duration/4), value: maxValue },
                { frame: startFrame + delay + (duration/2), value: minValue }
            ], easing);
        });
        
        return group;
    }
    
    // Create a pulse animation (scale up and down)
    pulse(shape, startFrame, count = 3, duration = 60, minScale = 0.8, maxScale = 1.2, easing = 'easeInOutQuad') {
        const keyframes = [];
        const frameDuration = duration / count;
        
        // Create pulsing keyframes
        for (let i = 0; i <= count; i++) {
            keyframes.push({
                frame: startFrame + i * frameDuration,
                value: i % 2 === 0 ? minScale : maxScale,
                easing: easing
            });
        }
        
        // Ensure we end at the original scale
        keyframes.push({
            frame: startFrame + duration,
            value: 1.0,
            easing: easing
        });
        
        // For circles, animate width
        if (shape instanceof Circle) {
            const originalSize = shape.width;
            return this.animate(shape, 'width', keyframes.map(kf => ({
                ...kf,
                value: originalSize * kf.value
            })));
        }
        
        // For rectangles, animate both width and height
        if (shape instanceof Rectangle) {
            const originalWidth = shape.width;
            const originalHeight = shape.height;
            
            this.animate(shape, 'width', keyframes.map(kf => ({
                ...kf,
                value: originalWidth * kf.value
            })));
            
            this.animate(shape, 'height', keyframes.map(kf => ({
                ...kf,
                value: originalHeight * kf.value
            })));
        }
        
        return shape;
    }
    
    // Create a typing animation for text objects
    typeText(textObj, startFrame, text, duration = 60, easing = 'linear') {
        if (!(textObj instanceof Text)) {
            console.error('Object must be a Text instance');
            return textObj;
        }
        
        const frameDuration = duration / text.length;
        const keyframes = [];
        
        // Create keyframes for each character being typed
        for (let i = 0; i <= text.length; i++) {
            keyframes.push({
                frame: startFrame + Math.round(i * frameDuration),
                value: text.substring(0, i),
                easing: easing
            });
        }
        
        // Set initial empty text
        textObj.text = '';
        
        // Create custom animation function for text property
        keyframes.forEach(kf => {
            // Use a animation callback system instead of direct keyframe setting
            // since text is not a numeric property
            this.engine.timeline.addMarker(kf.frame, `type_${textObj.id}_${kf.frame}`);
            
            // Store the target text on the object for this frame
            if (!textObj.textKeyframes) textObj.textKeyframes = {};
            textObj.textKeyframes[kf.frame] = kf.value;
        });
        
        // Add update listener
        const originalUpdateFn = textObj.updateToFrame.bind(textObj);
        textObj.updateToFrame = function(frame) {
            // Call the original update first
            originalUpdateFn(frame);
            
            // Then update text based on frame
            if (this.textKeyframes) {
                // Find the latest keyframe that's before or at the current frame
                let latestFrame = 0;
                for (const keyframeFrame in this.textKeyframes) {
                    if (parseInt(keyframeFrame) <= frame && parseInt(keyframeFrame) >= latestFrame) {
                        latestFrame = parseInt(keyframeFrame);
                    }
                }
                
                // Apply the text from that keyframe
                if (latestFrame > 0) {
                    this.text = this.textKeyframes[latestFrame];
                }
            }
        };
        
        return textObj;
    }
    
    // Create a particle system
    createParticleSystem(x, y, count = 20, options = {}) {
        const particles = [];
        const particleType = options.type || 'circle';
        const size = options.size || 10;
        const color = options.color || [255, 255, 255];
        const duration = options.duration || 60;
        const spread = options.spread || 200;
        
        for (let i = 0; i < count; i++) {
            // Create particle
            const particle = this.createShape(particleType, {
                x: x,
                y: y,
                size: size,
                fill: color(color[0], color[1], color[2], 255),
                name: `Particle_${i}`
            });
            
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * spread;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            // Animate position
            this.moveFromTo(particle, 0, duration, x, y, endX, endY, options.easing || 'easeOutCubic');
            
            // Fade out
            this.fadeOut(particle, duration / 2, duration / 2);
            
            // Scale down if specified
            if (options.scaleDown) {
                this.scale(particle, 0, duration, size, size * 0.2);
            }
            
            particles.push(particle);
        }
        
        return particles;
    }
    
    // Clear all objects and reset the animation
    clearAll() {
        this.engine.objects = [];
        this.engine.timeline.setFrame(0);
        return this;
    }
    
    // Set the animation duration
    setDuration(seconds) {
        this.engine.timeline.setDuration(seconds);
        return this;
    }
    
    // Set the animation FPS
    setFPS(fps) {
        this.engine.timeline.setFPS(fps);
        return this;
    }
    
    // Reset the animation to the beginning
    reset() {
        this.engine.timeline.setFrame(0);
        return this;
    }
    
    // Play the animation
    play() {
        this.engine.play();
        return this;
    }
}
class BaseShape {
    constructor(x, y) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.x = x || 0;
        this.y = y || 0;
        this.width = 100;
        this.height = 100;
        this.rotation = 0; // in degrees
        this.fill = color(255);
        this.stroke = color(0);
        this.strokeWeight = 1;
        this.visible = true;
        this.opacity = 255; // 0-255
        this.name = "Shape";
        
        // Animation properties
        this.keyframes = {};
    }

    render() {
        if (!this.visible) return;
        
        push();
        
        // Apply opacity to both fill and stroke
        const fillWithOpacity = color(red(this.fill), green(this.fill), blue(this.fill), this.opacity);
        const strokeWithOpacity = color(red(this.stroke), green(this.stroke), blue(this.stroke), this.opacity);
        
        fill(fillWithOpacity);
        stroke(strokeWithOpacity);
        strokeWeight(this.strokeWeight);
        
        translate(this.x, this.y);
        rotate(radians(this.rotation));
        
        // The actual drawing happens in subclasses
        this._renderShape();
        
        pop();
    }
    
    _renderShape() {
        // Abstract method, should be implemented by subclasses
        console.warn("_renderShape not implemented in subclass");
    }
    
    setProperty(property, value) {
        if (this.hasOwnProperty(property)) {
            this[property] = value;
        }
    }
    
    addKeyframe(property, frame, value, easingFunc = "linear") {
        if (!this.keyframes[property]) {
            this.keyframes[property] = [];
        }
        
        // Check if a keyframe already exists at this frame
        const existingIndex = this.keyframes[property].findIndex(kf => kf.frame === frame);
        
        if (existingIndex !== -1) {
            // Update existing keyframe
            this.keyframes[property][existingIndex].value = value;
            this.keyframes[property][existingIndex].easing = easingFunc;
        } else {
            // Add new keyframe
            this.keyframes[property].push({
                frame: frame,
                value: value,
                easing: easingFunc
            });
            
            // Sort keyframes by frame
            this.keyframes[property].sort((a, b) => a.frame - b.frame);
        }
    }
    
    removeKeyframe(property, frame) {
        if (!this.keyframes[property]) return;
        
        const index = this.keyframes[property].findIndex(kf => kf.frame === frame);
        
        if (index !== -1) {
            this.keyframes[property].splice(index, 1);
            
            // If no more keyframes for this property, delete the array
            if (this.keyframes[property].length === 0) {
                delete this.keyframes[property];
            }
        }
    }
    
    updateToFrame(frame) {
        // Calculate all animated properties at this frame
        for (const property in this.keyframes) {
            const keyframesForProp = this.keyframes[property];
            
            if (keyframesForProp.length === 0) continue;
            
            // Find surrounding keyframes
            let prevKeyframe = null;
            let nextKeyframe = null;
            
            for (let i = 0; i < keyframesForProp.length; i++) {
                if (keyframesForProp[i].frame <= frame) {
                    prevKeyframe = keyframesForProp[i];
                }
                
                if (keyframesForProp[i].frame > frame && !nextKeyframe) {
                    nextKeyframe = keyframesForProp[i];
                    break;
                }
            }
            
            // Apply the value
            if (prevKeyframe && !nextKeyframe) {
                // We're after the last keyframe, use its value
                this[property] = prevKeyframe.value;
            } else if (!prevKeyframe && nextKeyframe) {
                // We're before the first keyframe, use its value
                this[property] = nextKeyframe.value;
            } else if (prevKeyframe && nextKeyframe) {
                // We're between keyframes, interpolate
                const t = (frame - prevKeyframe.frame) / (nextKeyframe.frame - prevKeyframe.frame);
                const easedT = EasingFunctions.getEasing(prevKeyframe.easing)(t);
                
                this[property] = Interpolation.interpolate(
                    prevKeyframe.value,
                    nextKeyframe.value,
                    easedT,
                    property
                );
            }
        }
    }
    
    containsPoint(x, y) {
        // Transform point to object's local coordinates
        const angle = -radians(this.rotation);
        const dx = x - this.x;
        const dy = y - this.y;
        
        const localX = dx * cos(angle) - dy * sin(angle);
        const localY = dx * sin(angle) + dy * cos(angle);
        
        // Check if point is within bounds
        return this._pointInShape(localX, localY);
    }
    
    _pointInShape(localX, localY) {
        // Default rectangular bounds check, override in subclasses
        return (
            localX >= -this.width/2 &&
            localX <= this.width/2 &&
            localY >= -this.height/2 &&
            localY <= this.height/2
        );
    }
    
    getBoundingBox() {
        // Default bounding box, override in subclasses if needed
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
    
    clone() {
        const copy = new this.constructor(this.x, this.y);
        
        // Copy all properties
        for (const prop in this) {
            if (this.hasOwnProperty(prop) && prop !== 'id') {
                if (prop === 'keyframes') {
                    // Deep copy keyframes
                    copy.keyframes = JSON.parse(JSON.stringify(this.keyframes));
                } else if (prop === 'fill' || prop === 'stroke') {
                    // Clone colors
                    copy[prop] = color(red(this[prop]), green(this[prop]), blue(this[prop]), alpha(this[prop]));
                } else {
                    copy[prop] = this[prop];
                }
            }
        }
        
        return copy;
    }
    
    // Export shape to JSON-compatible object
    toJSON() {
        const json = {};
        
        for (const prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (prop === 'fill' || prop === 'stroke') {
                    // Convert color to rgba string
                    json[prop] = {
                        r: red(this[prop]),
                        g: green(this[prop]),
                        b: blue(this[prop]),
                        a: alpha(this[prop])
                    };
                } else {
                    json[prop] = this[prop];
                }
            }
        }
        
        // Add shape type
        json.type = this.constructor.name;
        
        return json;
    }
}
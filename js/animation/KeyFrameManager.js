class KeyframeManager {
    constructor() {
        this.propertiesWithKeyframes = new Set();
    }
    
    // Track which properties have keyframes across all objects
    registerKeyframedProperty(property) {
        this.propertiesWithKeyframes.add(property);
    }
    
    unregisterKeyframedProperty(property) {
        this.propertiesWithKeyframes.delete(property);
    }
    
    // Get all keyframed properties
    getKeyframedProperties() {
        return Array.from(this.propertiesWithKeyframes);
    }
    
    // Create a keyframe for the selected object at the current frame
    createKeyframeForCurrentSelection(engine, property) {
        if (!engine.selectedObject) return;
        
        const currentFrame = engine.timeline.currentFrame;
        const currentValue = engine.selectedObject[property];
        
        engine.selectedObject.addKeyframe(property, currentFrame, currentValue);
        this.registerKeyframedProperty(property);
    }
    
    // Remove a keyframe for the selected object at the current frame
    removeKeyframeForCurrentSelection(engine, property) {
        if (!engine.selectedObject) return;
        
        const currentFrame = engine.timeline.currentFrame;
        engine.selectedObject.removeKeyframe(property, currentFrame);
        
        // Check if any objects still have keyframes for this property
        let propertyStillUsed = false;
        for (const obj of engine.objects) {
            if (obj.keyframes[property] && obj.keyframes[property].length > 0) {
                propertyStillUsed = true;
                break;
            }
        }
        
        if (!propertyStillUsed) {
            this.unregisterKeyframedProperty(property);
        }
    }
    
    // Get all keyframes for the current timeline
    getAllKeyframes(engine) {
        const allKeyframes = [];
        
        for (const obj of engine.objects) {
            for (const property in obj.keyframes) {
                for (const keyframe of obj.keyframes[property]) {
                    allKeyframes.push({
                        objectId: obj.id,
                        property: property,
                        frame: keyframe.frame,
                        value: keyframe.value,
                        easing: keyframe.easing
                    });
                }
            }
        }
        
        return allKeyframes;
    }
    
    // Get keyframes for a specific object
    getKeyframesForObject(obj) {
        const keyframes = [];
        
        for (const property in obj.keyframes) {
            for (const keyframe of obj.keyframes[property]) {
                keyframes.push({
                    property: property,
                    frame: keyframe.frame,
                    value: keyframe.value,
                    easing: keyframe.easing
                });
            }
        }
        
        return keyframes;
    }
    
    // Modify a keyframe
    updateKeyframe(obj, property, originalFrame, newFrame, newValue, newEasing) {
        if (!obj.keyframes[property]) return;
        
        // Find the keyframe
        const keyframeIndex = obj.keyframes[property].findIndex(kf => kf.frame === originalFrame);
        
        if (keyframeIndex === -1) return;
        
        // If frame is changing, we need to remove and add
        if (originalFrame !== newFrame) {
            obj.removeKeyframe(property, originalFrame);
            obj.addKeyframe(property, newFrame, newValue, newEasing);
        } else {
            // Just update value and easing
            obj.keyframes[property][keyframeIndex].value = newValue;
            obj.keyframes[property][keyframeIndex].easing = newEasing;
        }
    }
    
    // Check if a keyframe exists for a property at a specific frame
    hasKeyframeAt(obj, property, frame) {
        if (!obj.keyframes[property]) return false;
        
        return obj.keyframes[property].some(kf => kf.frame === frame);
    }
    
    // Find nearest keyframe to the current frame
    findNearestKeyframe(obj, currentFrame) {
        let nearestFrame = null;
        let minDistance = Infinity;
        
        for (const property in obj.keyframes) {
            for (const keyframe of obj.keyframes[property]) {
                const distance = Math.abs(keyframe.frame - currentFrame);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestFrame = {
                        property: property,
                        frame: keyframe.frame,
                        value: keyframe.value,
                        easing: keyframe.easing
                    };
                }
            }
        }
        
        return nearestFrame;
    }
}
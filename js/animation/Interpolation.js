class Interpolation {
    static interpolate(startValue, endValue, t, propertyType) {
        // Handle different property types
        if (typeof startValue === 'number' && typeof endValue === 'number') {
            return this.interpolateNumber(startValue, endValue, t);
        } 
        else if (typeof startValue === 'object' && startValue !== null && 
                 typeof endValue === 'object' && endValue !== null) {
            // Check if it's a color object
            if ('r' in startValue && 'g' in startValue && 'b' in startValue) {
                return this.interpolateColor(startValue, endValue, t);
            }
            // Array interpolation for paths
            else if (Array.isArray(startValue) && Array.isArray(endValue)) {
                return this.interpolateArray(startValue, endValue, t);
            }
            // Handle point interpolation
            else if ('x' in startValue && 'y' in startValue && 
                     'x' in endValue && 'y' in endValue) {
                return this.interpolatePoint(startValue, endValue, t);
            }
        }
        
        // Default case for properties we don't know how to interpolate
        // Just return the start or end value depending on t
        return t < 0.5 ? startValue : endValue;
    }
    
    static interpolateNumber(start, end, t) {
        return start + (end - start) * t;
    }
    
    static interpolateColor(startColor, endColor, t) {
        // Handle both p5.js color objects and our custom color format
        let r1, g1, b1, a1, r2, g2, b2, a2;
        
        if (startColor.levels) { // p5.js color object
            [r1, g1, b1, a1] = startColor.levels;
            [r2, g2, b2, a2] = endColor.levels;
        } else { // Our custom format
            r1 = startColor.r;
            g1 = startColor.g;
            b1 = startColor.b;
            a1 = startColor.a || 255;
            
            r2 = endColor.r;
            g2 = endColor.g;
            b2 = endColor.b;
            a2 = endColor.a || 255;
        }
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        const a = Math.round(a1 + (a2 - a1) * t);
        
        return color(r, g, b, a);
    }
    
    static interpolateArray(startArray, endArray, t) {
        // Make sure arrays are the same length
        const length = Math.max(startArray.length, endArray.length);
        const result = [];
        
        for (let i = 0; i < length; i++) {
            if (i >= startArray.length) {
                result.push(endArray[i]);
            } else if (i >= endArray.length) {
                result.push(startArray[i]);
            } else {
                result.push(this.interpolate(startArray[i], endArray[i], t));
            }
        }
        
        return result;
    }
    
    static interpolatePoint(startPoint, endPoint, t) {
        return {
            x: startPoint.x + (endPoint.x - startPoint.x) * t,
            y: startPoint.y + (endPoint.y - startPoint.y) * t
        };
    }
}
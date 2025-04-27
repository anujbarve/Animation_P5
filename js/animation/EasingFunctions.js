class EasingFunctions {
    static getEasing(easingName) {
        if (typeof this[easingName] === 'function') {
            return this[easingName];
        }
        
        // Default to linear if the easing function doesn't exist
        return this.linear;
    }
    
    // Basic easing functions
    static linear(t) {
        return t;
    }
    
    // Quadratic
    static easeInQuad(t) {
        return t * t;
    }
    
    static easeOutQuad(t) {
        return t * (2 - t);
    }
    
    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    // Cubic
    static easeInCubic(t) {
        return t * t * t;
    }
    
    static easeOutCubic(t) {
        return (--t) * t * t + 1;
    }
    
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    // Quartic
    static easeInQuart(t) {
        return t * t * t * t;
    }
    
    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    static easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    
    // Quintic
    static easeInQuint(t) {
        return t * t * t * t * t;
    }
    
    static easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    }
    
    static easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
    
    // Sinusoidal
    static easeInSine(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    }
    
    static easeOutSine(t) {
        return Math.sin(t * Math.PI / 2);
    }
    
    static easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }
    
    // Exponential
    static easeInExpo(t) {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    }
    
    static easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    static easeInOutExpo(t) {
        if (t === 0 || t === 1) return t;
        return t < 0.5 ?
            Math.pow(2, 10 * (2 * t - 1)) / 2 :
            (2 - Math.pow(2, -10 * (2 * t - 1))) / 2;
    }
    
    // Circular
    static easeInCirc(t) {
        return 1 - Math.sqrt(1 - t * t);
    }
    
    static easeOutCirc(t) {
        return Math.sqrt(1 - (--t * t));
    }
    
    static easeInOutCirc(t) {
        return t < 0.5 ?
            (1 - Math.sqrt(1 - 4 * t * t)) / 2 :
            (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2;
    }
    
    // Elastic
    static easeInElastic(t) {
        if (t === 0 || t === 1) return t;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    }
    
    static easeOutElastic(t) {
        if (t === 0 || t === 1) return t;
        return 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI);
    }
    
    static easeInOutElastic(t) {
        if (t === 0 || t === 1) return t;
        t *= 2;
        if (t < 1) {
            return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }
        return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    }
    
    // Back
    static easeInBack(t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    }
    
    static easeOutBack(t) {
        const s = 1.70158;
        return (t = t - 1) * t * ((s + 1) * t + s) + 1;
    }
    
    static easeInOutBack(t) {
        let s = 1.70158 * 1.525;
        if ((t *= 2) < 1) {
            return 0.5 * (t * t * ((s + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
    }
    
    // Bounce
    static easeOutBounce(t) {
        if (t < (1 / 2.75)) {
            return 7.5625 * t * t;
        } else if (t < (2 / 2.75)) {
            return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
        } else if (t < (2.5 / 2.75)) {
            return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
        } else {
            return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
        }
    }
    
    static easeInBounce(t) {
        return 1 - this.easeOutBounce(1 - t);
    }
    
    static easeInOutBounce(t) {
        return t < 0.5 ?
            this.easeInBounce(t * 2) * 0.5 :
            this.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }
    
    // Get all available easing function names
    static getAllEasingNames() {
        return [
            "linear",
            "easeInQuad", "easeOutQuad", "easeInOutQuad",
            "easeInCubic", "easeOutCubic", "easeInOutCubic",
            "easeInQuart", "easeOutQuart", "easeInOutQuart",
            "easeInQuint", "easeOutQuint", "easeInOutQuint",
            "easeInSine", "easeOutSine", "easeInOutSine",
            "easeInExpo", "easeOutExpo", "easeInOutExpo",
            "easeInCirc", "easeOutCirc", "easeInOutCirc",
            "easeInElastic", "easeOutElastic", "easeInOutElastic",
            "easeInBack", "easeOutBack", "easeInOutBack",
            "easeInBounce", "easeOutBounce", "easeInOutBounce"
        ];
    }
}
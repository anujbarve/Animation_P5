class Timeline {
    constructor(engine) {
        this.engine = engine;
        this.currentFrame = 0;
        this.totalFrames = 240; // Default 10 seconds at 24fps
        this.fps = 24;
        this.markers = []; // For timeline markers/comments
        this.isLooping = false;
    }

    advanceFrame() {
        this.currentFrame++;
        
        if (this.currentFrame >= this.totalFrames) {
            if (this.isLooping) {
                this.currentFrame = 0;
            } else {
                this.currentFrame = 0; // Change this to 0 instead of totalFrames - 1
                this.engine.pause();    // Still pause the animation
            }
        }
    }
    

    setFrame(frame) {
        if (frame >= 0 && frame < this.totalFrames) {
            this.currentFrame = frame;
            // Update all objects to reflect this frame
            this.engine.objects.forEach(obj => obj.updateToFrame(frame));
        }
    }

    setDuration(seconds) {
        this.totalFrames = seconds * this.fps;
        // Ensure current frame is still valid
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = this.totalFrames - 1;
        }
    }

    setFPS(fps) {
        const currentDurationSecs = this.totalFrames / this.fps;
        this.fps = fps;
        this.totalFrames = Math.round(currentDurationSecs * fps);
    }

    addMarker(frame, label) {
        this.markers.push({
            frame: frame,
            label: label
        });
        // Sort markers by frame
        this.markers.sort((a, b) => a.frame - b.frame);
    }

    removeMarker(index) {
        if (index >= 0 && index < this.markers.length) {
            this.markers.splice(index, 1);
        }
    }

    frameToTime(frame) {
        const totalSeconds = frame / this.fps;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const frames = frame % this.fps;
        
        return {
            minutes: minutes,
            seconds: seconds,
            frames: frames,
            formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
        };
    }

    timeToFrame(minutes, seconds, frames) {
        return (minutes * 60 * this.fps) + (seconds * this.fps) + frames;
    }

    // Add a method to reset and restart the animation
restart() {
    this.currentFrame = 0;
    this.engine.objects.forEach(obj => obj.updateToFrame(0));
    
    // Auto-play when restarting
    this.engine.play();
}
}
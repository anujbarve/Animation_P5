class Recorder {
    constructor(engine) {
        this.engine = engine;
        this.isRecording = false;
        this.capturer = null;
        this.format = 'webm'; // Default format
        this.quality = 0.8;
        this.frameRate = 24;
    }

    setupCapturer() {
        const options = {
            format: this.format,
            framerate: this.frameRate,
            quality: this.quality,
            verbose: true
        };
        
        this.capturer = new CCapture(options);
    }

    startRecording() {
        if (this.isRecording) return;
        
        this.setupCapturer();
        this.capturer.start();
        this.isRecording = true;
        
        // Reset to frame 0
        this.engine.timeline.setFrame(0);
        this.engine.play();
    }

    captureFrame() {
        if (!this.isRecording || !this.capturer) return;
        
        this.capturer.capture(document.getElementById('defaultCanvas0'));
        
        // Auto-stop when we reach the end
        if (this.engine.timeline.currentFrame >= this.engine.timeline.totalFrames - 1) {
            this.stopRecording();
        }
    }

    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        this.engine.pause();
        
        this.capturer.stop();
        this.capturer.save((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `animation_export_${Date.now()}.${this.format}`;
            a.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
        });
    }

    setFormat(format) {
        const validFormats = ['webm', 'gif', 'png', 'jpg'];
        if (validFormats.includes(format)) {
            this.format = format;
        } else {
            console.error('Invalid format specified:', format);
        }
    }

    setQuality(quality) {
        if (quality >= 0 && quality <= 1) {
            this.quality = quality;
        }
    }

    setFrameRate(fps) {
        if (fps > 0) {
            this.frameRate = fps;
        }
    }
}
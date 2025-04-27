class ExportManager {
    // Show export options dialog
    static showExportOptions(engine) {
        if (!engine.recorder) {
            console.error("Recorder not initialized");
            return;
        }
        
        // Create a simple dialog
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#333';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '5px';
        dialog.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        dialog.style.zIndex = '1000';
        dialog.style.width = '300px';
        
        // Add dialog title
        const title = document.createElement('h3');
        title.textContent = 'Export Animation';
        title.style.margin = '0 0 15px 0';
        dialog.appendChild(title);
        
        // Add format selection
        const formatGroup = document.createElement('div');
        formatGroup.style.marginBottom = '15px';
        
        const formatLabel = document.createElement('label');
        formatLabel.textContent = 'Format:';
        formatLabel.style.display = 'block';
        formatLabel.style.marginBottom = '5px';
        formatGroup.appendChild(formatLabel);
        
        const formatSelect = document.createElement('select');
        formatSelect.style.width = '100%';
        formatSelect.style.padding = '5px';
        formatSelect.style.backgroundColor = '#444';
        formatSelect.style.color = '#fff';
        formatSelect.style.border = '1px solid #555';
        
        const formats = [
            { value: 'webm', label: 'WebM Video' },
            { value: 'gif', label: 'Animated GIF' },
            { value: 'png', label: 'PNG Sequence' }
        ];
        
        formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.value;
            option.textContent = format.label;
            formatSelect.appendChild(option);
        });
        
        formatGroup.appendChild(formatSelect);
        dialog.appendChild(formatGroup);
        
        // Add quality slider
        const qualityGroup = document.createElement('div');
        qualityGroup.style.marginBottom = '15px';
        
        const qualityLabel = document.createElement('label');
        qualityLabel.textContent = 'Quality: 80%';
        qualityLabel.style.display = 'block';
        qualityLabel.style.marginBottom = '5px';
        qualityGroup.appendChild(qualityLabel);
        
        const qualitySlider = document.createElement('input');
        qualitySlider.type = 'range';
        qualitySlider.min = '10';
        qualitySlider.max = '100';
        qualitySlider.value = '80';
        qualitySlider.style.width = '100%';
        qualitySlider.addEventListener('input', () => {
            qualityLabel.textContent = `Quality: ${qualitySlider.value}%`;
        });
        
        qualityGroup.appendChild(qualitySlider);
        dialog.appendChild(qualityGroup);
        
        // Add FPS control
        const fpsGroup = document.createElement('div');
        fpsGroup.style.marginBottom = '15px';
        
        const fpsLabel = document.createElement('label');
        fpsLabel.textContent = 'FPS:';
        fpsLabel.style.display = 'block';
        fpsLabel.style.marginBottom = '5px';
        fpsGroup.appendChild(fpsLabel);
        
        const fpsInput = document.createElement('input');
        fpsInput.type = 'number';
        fpsInput.min = '1';
        fpsInput.max = '60';
        fpsInput.value = engine.timeline.fps;
        fpsInput.style.width = '100%';
        fpsInput.style.padding = '5px';
        fpsInput.style.backgroundColor = '#444';
        fpsInput.style.color = '#fff';
        fpsInput.style.border = '1px solid #555';
        
        fpsGroup.appendChild(fpsInput);
        dialog.appendChild(fpsGroup);
        
        // Add action buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'space-between';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'button';
        cancelButton.style.padding = '8px 15px';
        cancelButton.style.backgroundColor = '#555';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '3px';
        cancelButton.style.cursor = 'pointer';
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export';
        exportButton.className = 'button primary';
        exportButton.style.padding = '8px 15px';
        exportButton.style.backgroundColor = '#4a80f0';
        exportButton.style.color = '#fff';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '3px';
        exportButton.style.cursor = 'pointer';
        
        exportButton.addEventListener('click', () => {
            const format = formatSelect.value;
            const quality = parseInt(qualitySlider.value) / 100;
            const fps = parseInt(fpsInput.value);
            
            document.body.removeChild(dialog);
            
            this.startExport(engine, format, quality, fps);
        });
        
        buttonGroup.appendChild(cancelButton);
        buttonGroup.appendChild(exportButton);
        dialog.appendChild(buttonGroup);
        
        // Add to document
        document.body.appendChild(dialog);
    }
    
    // Start exporting the animation
    static startExport(engine, format, quality, fps) {
        // Update recorder settings
        engine.recorder.setFormat(format);
        engine.recorder.setQuality(quality);
        engine.recorder.setFrameRate(fps);
        
        // Start recording
        engine.recorder.startRecording();
        
        // Show a recording indicator
        this.showRecordingIndicator(engine);
    }
    
    // Display a recording in progress indicator
    static showRecordingIndicator(engine) {
        const indicator = document.createElement('div');
        indicator.id = 'recording-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        indicator.style.color = 'white';
        indicator.style.padding = '5px 15px';
        indicator.style.borderRadius = '20px';
        indicator.style.zIndex = '1000';
        indicator.style.fontWeight = 'bold';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        
        // Add recording icon
        const recordingDot = document.createElement('div');
        recordingDot.style.width = '10px';
        recordingDot.style.height = '10px';
        recordingDot.style.backgroundColor = 'red';
        recordingDot.style.borderRadius = '50%';
        recordingDot.style.marginRight = '10px';
        // Animate the recording dot
        recordingDot.style.animation = 'pulse 1s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        indicator.appendChild(recordingDot);
        
        const text = document.createElement('span');
        text.textContent = 'Recording...';
        indicator.appendChild(text);
        
        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '✕';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.background = 'none';
        cancelButton.style.border = 'none';
        cancelButton.style.color = 'white';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontWeight = 'bold';
        
        cancelButton.addEventListener('click', () => {
            engine.recorder.stopRecording();
            document.body.removeChild(indicator);
        });
        
        indicator.appendChild(cancelButton);
        
        document.body.appendChild(indicator);
        
        // Add listener to automatically remove when recording stops
        const checkRecording = setInterval(() => {
            if (!engine.recorder.isRecording) {
                clearInterval(checkRecording);
                if (document.body.contains(indicator)) {
                    document.body.removeChild(indicator);
                }
            }
        }, 500);
    }
}
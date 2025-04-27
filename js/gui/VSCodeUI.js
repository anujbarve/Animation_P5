class VSCodeUI {
    constructor(engine) {
        this.engine = engine;
        this.sidebar = null;
        this.panels = {};
        this.activePanelId = null;
        this.isPresentationMode = false;
        this.codeEditorPanel = null;
    }
    
    initialize() {
        // Initialize sidebar
        this.sidebar = document.querySelector('.sidebar');
        
        // Create sidebar icons
        this.createSidebarIcons();
        
        // Initialize all toggle buttons
        this.initializeToggleButtons();
        
        
        // Initialize panels (but keep them hidden)
        this.initializePanels();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update status bar
        this.updateStatusBar();
    }
    
    createSidebarIcons() {
        const sidebarIcons = document.querySelector('.sidebar-icons');
        
        // Define sidebar icons
        const icons = [
            { id: 'explorer', title: 'Explorer', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h5v2H7v-2z"/></svg>', panel: 'explorer-panel' },
            { id: 'shapes', title: 'Shapes', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 12h3v8h14v-8h3L12 2zm0 3.5L17.5 11h-11L12 5.5z"/></svg>', panel: 'shapes-panel' },
            { id: 'properties', title: 'Properties', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 3h10v4h-2V5H9v2H7V3zm-5 7h2v10h16V10h2v12H2V10zm4-2h16v8H6V8zm8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>', panel: 'properties-panel' },
            { id: 'animation', title: 'Animation', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10-6v12l8-6-8-6z"/></svg>', panel: 'animation-panel' },
            { id: 'code', title: 'Code Editor', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>', panel: 'code-panel' },
            { id: 'export', title: 'Export', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>', panel: 'export-panel' }
        ];
        
        // Create buttons for each icon
        icons.forEach(icon => {
            const button = document.createElement('button');
            button.id = `${icon.id}-btn`;
            button.title = icon.title;
            button.innerHTML = icon.icon;
            button.dataset.panel = icon.panel;
            
            button.addEventListener('click', () => {
                this.togglePanel(icon.panel, button);
            });
            
            sidebarIcons.appendChild(button);
        });
    }
    
    initializeToggleButtons() {
        // Presentation mode toggle
        const presentationToggle = document.querySelector('.presentation-toggle');
        presentationToggle.addEventListener('click', () => {
            this.togglePresentationMode();
        });
    }
    
    
    initializePanels() {
        // Create panel containers
        const panelDefinitions = [
            { id: 'explorer-panel', title: 'Explorer', content: this.createExplorerPanel() },
            { id: 'shapes-panel', title: 'Shapes', content: this.createShapesPanel() },
            { id: 'properties-panel', title: 'Properties', content: document.createElement('div') },
            { id: 'animation-panel', title: 'Animation', content: this.createAnimationPanel() },
            { id: 'code-panel', title: 'Code Editor', content: document.createElement('div') },
            { id: 'export-panel', title: 'Export', content: this.createExportPanel() }
        ];
        
        panelDefinitions.forEach(panel => {
            this.createPanel(panel.id, panel.title, panel.content);
        });
    }
    
    createPanel(id, title, contentElement) {
        // Create panel container
        const panel = document.createElement('div');
        panel.className = 'panel hidden';
        panel.id = id;
        
        // Add drag functionality
        panel.style.position = 'absolute';
        panel.style.top = '50px';
        panel.style.right = '20px';
        
        // Create panel header
        const header = document.createElement('div');
        header.className = 'panel-header';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'panel-title';
        titleElement.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'panel-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            this.hidePanel(id);
        });
        
        header.appendChild(titleElement);
        header.appendChild(closeButton);
        
        // Create panel content
        const content = document.createElement('div');
        content.className = 'panel-content';
        content.appendChild(contentElement);
        
        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Make panel draggable
        this.makeDraggable(panel, header);
        
        // Add to document
        document.body.appendChild(panel);
        
        // Store reference
        this.panels[id] = panel;
        
        return panel;
    }
    
    makeDraggable(element, handle) {
        let isDragging = false;
        let offsetX, offsetY;
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            
            element.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Keep within window bounds
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            element.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            element.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.userSelect = '';
        });
    }
    
    togglePanel(panelId, button) {
        // If clicking the active panel, hide it
        if (this.activePanelId === panelId) {
            this.hidePanel(panelId);
            this.activePanelId = null;
            return;
        }
        
        // Hide all panels
        for (const id in this.panels) {
            this.panels[id].classList.add('hidden');
        }
        
        // Remove active class from all buttons
        document.querySelectorAll('.sidebar-icons button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show the selected panel
        this.panels[panelId].classList.remove('hidden');
        this.activePanelId = panelId;
        
        // Add active class to the button
        if (button) button.classList.add('active');
        
        // Special handling for panels
        if (panelId === 'code-panel' && this.codeEditorPanel) {
            // Initialize code editor if needed
            this.codeEditorPanel.show();
        }
    }
    
    hidePanel(panelId) {
        if (this.panels[panelId]) {
            this.panels[panelId].classList.add('hidden');
        }
        
        // Remove active class from corresponding button
        const button = document.querySelector(`button[data-panel="${panelId}"]`);
        if (button) button.classList.remove('active');
    }
    
    togglePresentationMode() {
        const appContainer = document.querySelector('.app-container');
        
        this.isPresentationMode = !this.isPresentationMode;
        
        if (this.isPresentationMode) {
            appContainer.classList.add('presentation-mode');
            // Hide all panels
            for (const id in this.panels) {
                this.panels[id].classList.add('hidden');
            }
            // Change button text
            document.querySelector('.presentation-toggle').textContent = '⚙️';
            
            // Ensure canvas uses full space
            windowResized();
        } else {
            appContainer.classList.remove('presentation-mode');
            // Change button text
            document.querySelector('.presentation-toggle').textContent = '👁️';
            
            // Update canvas size again
            setTimeout(windowResized, 100);
        }
    }
    
    createExplorerPanel() {
        const container = document.createElement('div');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search objects...';
        searchInput.style.width = '100%';
        searchInput.style.marginBottom = '10px';
        searchInput.style.padding = '5px';
        searchInput.style.backgroundColor = 'var(--vscode-bg)';
        searchInput.style.color = 'var(--vscode-text)';
        searchInput.style.border = '1px solid var(--vscode-border)';
        
        const objectsList = document.createElement('div');
        objectsList.className = 'objects-list';
        objectsList.style.maxHeight = '300px';
        objectsList.style.overflowY = 'auto';
        
        // Populate objects list
        this.updateObjectsList = () => {
            objectsList.innerHTML = '';
            
            if (!this.engine.objects.length) {
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = 'No objects in scene';
                emptyMsg.style.padding = '10px';
                emptyMsg.style.color = '#888';
                objectsList.appendChild(emptyMsg);
                return;
            }
            
            this.engine.objects.forEach((obj, index) => {
                const item = document.createElement('div');
                item.className = 'object-item';
                item.style.padding = '6px 8px';
                item.style.marginBottom = '2px';
                item.style.cursor = 'pointer';
                item.style.borderRadius = '3px';
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                
                // Highlight selected object
                if (this.engine.selectedObject === obj) {
                    item.style.backgroundColor = 'var(--vscode-selection)';
                }
                
                // Icon based on shape type
                const icon = document.createElement('span');
                icon.style.marginRight = '8px';
                icon.style.opacity = '0.7';
                
                if (obj instanceof Circle) {
                    icon.innerHTML = '⚪';
                } else if (obj instanceof Rectangle) {
                    icon.innerHTML = '⬛';
                } else if (obj instanceof Text) {
                    icon.innerHTML = 'T';
                } else if (obj instanceof Path) {
                    icon.innerHTML = '⭐';
                } else {
                    icon.innerHTML = '⬤';
                }
                
                const name = document.createElement('span');
                name.textContent = obj.name || `Object ${index}`;
                
                const visibility = document.createElement('button');
                visibility.innerHTML = obj.visible ? '👁️' : '👁️‍🗨️';
                visibility.style.marginLeft = 'auto';
                visibility.style.background = 'none';
                visibility.style.border = 'none';
                visibility.style.cursor = 'pointer';
                visibility.style.opacity = '0.6';
                visibility.style.fontSize = '14px';
                
                visibility.addEventListener('click', (e) => {
                    e.stopPropagation();
                    obj.visible = !obj.visible;
                    visibility.innerHTML = obj.visible ? '👁️' : '👁️‍🗨️';
                });
                
                item.appendChild(icon);
                item.appendChild(name);
                item.appendChild(visibility);
                
                item.addEventListener('click', () => {
                    this.engine.selectObject(obj);
                    this.updateObjectsList();
                    
                    // Show properties panel when selecting an object
                    this.togglePanel('properties-panel', document.querySelector('#properties-btn'));
                });
                
                objectsList.appendChild(item);
            });
        };
        
        // Add search functionality
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            
            Array.from(objectsList.children).forEach(item => {
                if (item.querySelector('span:nth-child(2)')) {
                    const name = item.querySelector('span:nth-child(2)').textContent.toLowerCase();
                    item.style.display = name.includes(query) ? 'flex' : 'none';
                }
            });
        });
        
        // Add buttons for object management
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.marginTop = '10px';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'vscode-button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (this.engine.selectedObject) {
                if (confirm('Delete selected object?')) {
                    this.engine.removeObject(this.engine.selectedObject);
                    this.updateObjectsList();
                }
            } else {
                alert('No object selected');
            }
        });
        
        const duplicateBtn = document.createElement('button');
        duplicateBtn.className = 'vscode-button';
        duplicateBtn.textContent = 'Duplicate';
        duplicateBtn.addEventListener('click', () => {
            if (this.engine.selectedObject) {
                const clone = this.engine.selectedObject.clone();
                clone.x += 20;
                clone.y += 20;
                this.engine.addObject(clone);
                this.updateObjectsList();
            } else {
                alert('No object selected');
            }
        });
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'vscode-button';
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => {
            if (confirm('Remove all objects?')) {
                this.engine.objects = [];
                this.engine.selectedObject = null;
                this.updateObjectsList();
            }
        });
        
        buttonsContainer.appendChild(deleteBtn);
        buttonsContainer.appendChild(duplicateBtn);
        buttonsContainer.appendChild(clearBtn);
        
        container.appendChild(searchInput);
        container.appendChild(objectsList);
        container.appendChild(buttonsContainer);
        
        return container;
    }
    
    createShapesPanel() {
        const container = document.createElement('div');
        
        const title = document.createElement('h4');
        title.textContent = 'Add Shapes';
        title.style.marginTop = '0';
        
        const shapesGrid = document.createElement('div');
        shapesGrid.style.display = 'grid';
        shapesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        shapesGrid.style.gap = '10px';
        shapesGrid.style.marginBottom = '15px';
        
        const shapes = [
            { name: 'Circle', icon: '⚪', type: 'circle' },
            { name: 'Rectangle', icon: '⬛', type: 'rectangle' },
            { name: 'Text', icon: 'T', type: 'text' },
            { name: 'Path', icon: '⭐', type: 'path' }
        ];
        
        shapes.forEach(shape => {
            const shapeBtn = document.createElement('button');
            shapeBtn.className = 'vscode-button';
            shapeBtn.style.display = 'flex';
            shapeBtn.style.flexDirection = 'column';
            shapeBtn.style.alignItems = 'center';
            shapeBtn.style.padding = '15px 10px';
            
            const icon = document.createElement('div');
            icon.textContent = shape.icon;
            icon.style.fontSize = '24px';
            icon.style.marginBottom = '5px';
            
            const label = document.createElement('div');
            label.textContent = shape.name;
            label.style.fontSize = '12px';
            
            shapeBtn.appendChild(icon);
            shapeBtn.appendChild(label);
            
            shapeBtn.addEventListener('click', () => {
                this.createShape(shape.type);
            });
            
            shapesGrid.appendChild(shapeBtn);
        });
        
        // Template shapes
        const templatesTitle = document.createElement('h4');
        templatesTitle.textContent = 'Templates';
        
        const templatesContainer = document.createElement('div');
        templatesContainer.style.display = 'grid';
        templatesContainer.style.gridTemplateColumns = '1fr';
        templatesContainer.style.gap = '5px';
        
        const templates = [
            { name: 'Bounce Animation', function: 'createBounceAnimation' },
            { name: 'Text Typing', function: 'createTypingAnimation' },
            { name: 'Wave Effect', function: 'createWaveAnimation' },
            { name: 'Particle System', function: 'createParticleAnimation' }
        ];
        
        templates.forEach(template => {
            const btn = document.createElement('button');
            btn.className = 'vscode-button';
            btn.textContent = template.name;
            btn.addEventListener('click', () => {
                if (typeof window[template.function] === 'function') {
                    window[template.function]();
                } else if (typeof this[template.function] === 'function') {
                    this[template.function]();
                } else {
                    console.error(`Function ${template.function} not found`);
                }
            });
            
            templatesContainer.appendChild(btn);
        });
        
        container.appendChild(title);
        container.appendChild(shapesGrid);
        container.appendChild(templatesTitle);
        container.appendChild(templatesContainer);
        
        return container;
    }
    
    createAnimationPanel() {
        const container = document.createElement('div');
        
        const timeControls = document.createElement('div');
        timeControls.style.marginBottom = '15px';
        
        const fpsContainer = document.createElement('div');
        fpsContainer.style.marginBottom = '10px';
        
        const fpsLabel = document.createElement('label');
        fpsLabel.textContent = 'FPS:';
        fpsLabel.style.display = 'block';
        fpsLabel.style.marginBottom = '5px';
        
        const fpsInput = document.createElement('input');
        fpsInput.type = 'number';
        fpsInput.min = '1';
        fpsInput.max = '60';
        fpsInput.value = this.engine.timeline.fps;
        fpsInput.style.width = '100%';
        
        fpsContainer.appendChild(fpsLabel);
        fpsContainer.appendChild(fpsInput);
        
        const durationContainer = document.createElement('div');
        durationContainer.style.marginBottom = '10px';
        
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Duration (seconds):';
        durationLabel.style.display = 'block';
        durationLabel.style.marginBottom = '5px';
        
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.min = '1';
        durationInput.max = '60';
        durationInput.value = this.engine.timeline.totalFrames / this.engine.timeline.fps;
        durationInput.style.width = '100%';
        
        durationContainer.appendChild(durationLabel);
        durationContainer.appendChild(durationInput);
        
        const updateBtn = document.createElement('button');
        updateBtn.className = 'vscode-button primary';
        updateBtn.textContent = 'Update Timeline';
        updateBtn.style.width = '100%';
        
        updateBtn.addEventListener('click', () => {
            const fps = parseInt(fpsInput.value);
            const duration = parseInt(durationInput.value);
            
            if (fps > 0 && duration > 0) {
                this.engine.timeline.setFPS(fps);
                this.engine.timeline.setDuration(duration);
                
                // Update timeline display
                if (this.engine.uiManager && this.engine.uiManager.timelinePanel) {
                    this.engine.uiManager.timelinePanel.updateRulerMarkers();
                }
            }
        });
        
        timeControls.appendChild(fpsContainer);
        timeControls.appendChild(durationContainer);
        timeControls.appendChild(updateBtn);
        
        // Playback controls
        const playbackContainer = document.createElement('div');
        playbackContainer.style.display = 'flex';
        playbackContainer.style.justifyContent = 'space-between';
        playbackContainer.style.marginTop = '20px';
        
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'vscode-button';
        playPauseBtn.innerHTML = '▶️';
        playPauseBtn.style.flex = '1';
        playPauseBtn.style.marginRight = '5px';
        
        playPauseBtn.addEventListener('click', () => {
            if (this.engine.isPlaying) {
                this.engine.pause();
                playPauseBtn.innerHTML = '▶️';
            } else {
                this.engine.play();
                playPauseBtn.innerHTML = '⏸️';
            }
        });
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'vscode-button';
        restartBtn.innerHTML = '⟲';
        restartBtn.style.flex = '1';
        restartBtn.style.marginRight = '5px';
        
        restartBtn.addEventListener('click', () => {
            this.engine.timeline.setFrame(0);
            this.engine.play();
            playPauseBtn.innerHTML = '⏸️';
        });
        
        const loopToggle = document.createElement('button');
        loopToggle.className = 'vscode-button';
        loopToggle.innerHTML = '🔁';
        loopToggle.style.flex = '1';
        loopToggle.style.opacity = this.engine.timeline.isLooping ? '1' : '0.5';
        
        loopToggle.addEventListener('click', () => {
            this.engine.timeline.isLooping = !this.engine.timeline.isLooping;
            loopToggle.style.opacity = this.engine.timeline.isLooping ? '1' : '0.5';
        });
        
        playbackContainer.appendChild(playPauseBtn);
        playbackContainer.appendChild(restartBtn);
        playbackContainer.appendChild(loopToggle);
        
        // Recording section
        const recordingSection = document.createElement('div');
        recordingSection.style.marginTop = '20px';
        
        const recordingTitle = document.createElement('h4');
        recordingTitle.textContent = 'Record Animation';
        recordingTitle.style.marginBottom = '10px';
        
        const recordBtn = document.createElement('button');
        recordBtn.className = 'vscode-button primary';
        recordBtn.innerHTML = '⚫ Record';
        recordBtn.style.width = '100%';
        
        recordBtn.addEventListener('click', () => {
            ExportManager.showExportOptions(this.engine);
        });
        
        recordingSection.appendChild(recordingTitle);
        recordingSection.appendChild(recordBtn);
        
        container.appendChild(timeControls);
        container.appendChild(playbackContainer);
        container.appendChild(recordingSection);
        
        return container;
    }
    
    createExportPanel() {
        const container = document.createElement('div');
        
        const title = document.createElement('h4');
        title.textContent = 'Export Options';
        title.style.marginTop = '0';
        
        // Format selection
        const formatLabel = document.createElement('label');
        formatLabel.textContent = 'Format:';
        formatLabel.style.display = 'block';
        formatLabel.style.marginBottom = '5px';
        
        const formatSelect = document.createElement('select');
        formatSelect.style.width = '100%';
        formatSelect.style.marginBottom = '15px';
        formatSelect.style.backgroundColor = 'var(--vscode-bg)';
        formatSelect.style.color = 'var(--vscode-text)';
        formatSelect.style.border = '1px solid var(--vscode-border)';
        formatSelect.style.padding = '5px';
        
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
        
        // Quality slider
        const qualityLabel = document.createElement('label');
        qualityLabel.textContent = 'Quality: 80%';
        qualityLabel.style.display = 'block';
        qualityLabel.style.marginBottom = '5px';
        
        const qualitySlider = document.createElement('input');
        qualitySlider.type = 'range';
        qualitySlider.min = '10';
        qualitySlider.max = '100';
        qualitySlider.value = '80';
        qualitySlider.style.width = '100%';
        qualitySlider.style.marginBottom = '15px';
        
        qualitySlider.addEventListener('input', () => {
            qualityLabel.textContent = `Quality: ${qualitySlider.value}%`;
        });
        
        // Export button
        const exportBtn = document.createElement('button');
        exportBtn.className = 'vscode-button primary';
        exportBtn.textContent = 'Export Animation';
        exportBtn.style.width = '100%';
        
        exportBtn.addEventListener('click', () => {
            const format = formatSelect.value;
            const quality = parseInt(qualitySlider.value) / 100;
            
            // Use the Export Manager
            this.startExport(format, quality, this.engine.timeline.fps);
            
            // Hide panel after export starts
            this.hidePanel('export-panel');
        });
        
        // Project save/load options
        const projectTitle = document.createElement('h4');
        projectTitle.textContent = 'Project Options';
        projectTitle.style.marginTop = '20px';
        
        const projectButtons = document.createElement('div');
        projectButtons.style.display = 'grid';
        projectButtons.style.gridTemplateColumns = '1fr 1fr';
        projectButtons.style.gap = '10px';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'vscode-button';
        saveBtn.textContent = 'Save Project';
        
        saveBtn.addEventListener('click', () => {
            ProjectManager.saveProject(this.engine);
        });
        
        const loadBtn = document.createElement('button');
        loadBtn.className = 'vscode-button';
        loadBtn.textContent = 'Load Project';
        
        loadBtn.addEventListener('click', () => {
            ProjectManager.promptLoadProject(this.engine);
            
            // Update the object list after loading
            setTimeout(() => {
                this.updateObjectsList();
            }, 500);
        });
        
        projectButtons.appendChild(saveBtn);
        projectButtons.appendChild(loadBtn);
        
        container.appendChild(title);
        container.appendChild(formatLabel);
        container.appendChild(formatSelect);
        container.appendChild(qualityLabel);
        container.appendChild(qualitySlider);
        container.appendChild(exportBtn);
        container.appendChild(projectTitle);
        container.appendChild(projectButtons);
        
        return container;
    }
    
    startExport(format, quality, fps) {
        // Update recorder settings
        this.engine.recorder.setFormat(format);
        this.engine.recorder.setQuality(quality);
        this.engine.recorder.setFrameRate(fps);
        
        // Start recording
        this.engine.recorder.startRecording();
        
        // Show a recording indicator
        this.showRecordingIndicator();
    }
    
    showRecordingIndicator() {
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
        recordingDot.style.animation = 'pulse 1s infinite';
        
        // Create pulse animation if it doesn't exist
        if (!document.querySelector('#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        const text = document.createElement('span');
        text.textContent = 'Recording...';
        
        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '✕';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.background = 'none';
        cancelButton.style.border = 'none';
        cancelButton.style.color = 'white';
        cancelButton.style.cursor = 'pointer';
        
        cancelButton.addEventListener('click', () => {
            this.engine.recorder.stopRecording();
            document.body.removeChild(indicator);
        });
        
        indicator.appendChild(recordingDot);
        indicator.appendChild(text);
        indicator.appendChild(cancelButton);
        
        document.body.appendChild(indicator);
        
        // Auto-remove when recording stops
        const checkRecording = setInterval(() => {
            if (!this.engine.recorder.isRecording) {
                clearInterval(checkRecording);
                if (document.body.contains(indicator)) {
                    document.body.removeChild(indicator);
                }
            }
        }, 500);
    }
    
    setupEventListeners() {
        // Update status bar information
        window.addEventListener('mousemove', (e) => {
            const canvasRect = document.getElementById('canvas-container').getBoundingClientRect();
            
            if (
                e.clientX >= canvasRect.left && 
                e.clientX <= canvasRect.right && 
                e.clientY >= canvasRect.top && 
                e.clientY <= canvasRect.bottom
            ) {
                const x = Math.round(e.clientX - canvasRect.left);
                const y = Math.round(e.clientY - canvasRect.top);
                document.getElementById('position-info').textContent = `X: ${x}, Y: ${y}`;
            }
        });
        
        // Listen for object selection changes
        setInterval(() => {
            document.getElementById('object-count').textContent = `Objects: ${this.engine.objects.length}`;
            document.getElementById('frame-info').textContent = `Frame: ${this.engine.timeline.currentFrame}/${this.engine.timeline.totalFrames}`;
            document.getElementById('fps-info').textContent = `FPS: ${Math.round(frameRate())}`;
            
            // Update objects list if panel is visible
            if (!this.panels['explorer-panel'].classList.contains('hidden') && this.updateObjectsList) {
                this.updateObjectsList();
            }
        }, 100);
    }
    
    updateStatusBar() {
        // Initial status bar update
        document.getElementById('object-count').textContent = `Objects: ${this.engine.objects.length}`;
        document.getElementById('frame-info').textContent = `Frame: ${this.engine.timeline.currentFrame}/${this.engine.timeline.totalFrames}`;
        document.getElementById('fps-info').textContent = `FPS: ${this.engine.timeline.fps}`;
    }
    
    createShape(type) {
        const centerX = this.engine.canvasWidth / 2;
        const centerY = this.engine.canvasHeight / 2;
        
        // Find an empty spot near the center
        let x = centerX + Math.random() * 100 - 50;
        let y = centerY + Math.random() * 100 - 50;
        
        // Create the shape using UIManager's helper
        const uiManager = this.engine.uiManager;
        const shape = uiManager.createShape(type, x, y);
        
        // Update the objects list
        if (this.updateObjectsList) {
            this.updateObjectsList();
        }
        
        return shape;
    }
    
    // Animation template methods
    createBounceAnimation() {
        const animAPI = new AnimationAPI(this.engine);
        
        // Clear existing objects
        animAPI.clearAll();
        
        // Create a bouncing ball
        const ball = animAPI.createShape('circle', {
            x: 400,
            y: 100,
            size: 80,
            fill: color(255, 100, 100),
            name: "Bouncing Ball"
        });
        
        // Set up path for bouncing
        const path = [
            {x: 400, y: 100},
            {x: 400, y: 500},
            {x: 400, y: 200},
            {x: 400, y: 500},
            {x: 400, y: 300},
            {x: 400, y: 500},
            {x: 400, y: 400},
            {x: 400, y: 500}
        ];
        
        // Animate along the path
        animAPI.followPath(ball, path, 0, 120, 'easeOutBounce');
        
        // Squash and stretch
        const keyframes = [
            {frame: 0, value: 80},
            {frame: 30, value: 90, easing: 'easeInCubic'},
            {frame: 40, value: 60, easing: 'easeOutCubic'},
            {frame: 50, value: 80, easing: 'easeInOutCubic'},
            {frame: 70, value: 85, easing: 'easeInCubic'},
            {frame: 80, value: 70, easing: 'easeOutCubic'},
            {frame: 90, value: 80, easing: 'easeInOutCubic'},
            {frame: 110, value: 75, easing: 'easeInCubic'},
            {frame: 120, value: 80, easing: 'easeOutCubic'}
        ];
        
        animAPI.animate(ball, 'width', keyframes);
        
        // Update objects list
        if (this.updateObjectsList) {
            this.updateObjectsList();
        }
        
        // Play the animation
        animAPI.play();
    }
    
    createTypingAnimation() {
        const animAPI = new AnimationAPI(this.engine);
        
        // Clear existing objects
        animAPI.clearAll();
        
        // Create text object
        const text = animAPI.createShape('text', {
            x: 400,
            y: 300,
            text: "",
            fontSize: 36,
            fill: color(255, 255, 255),
            name: "Typing Text"
        });
        
        // Create typing animation
        animAPI.typeText(text, 0, "Creating programmatic animations is fun!", 120);
        
        // Add a cursor
        const cursor = animAPI.createShape('rectangle', {
            x: 400,
            y: 300,
            width: 3,
            height: 36,
            fill: color(255, 255, 255),
            name: "Cursor"
        });
        
        // Make cursor blink
        animAPI.animate(cursor, 'opacity', [
            {frame: 0, value: 255},
            {frame: 10, value: 0},
            {frame: 20, value: 255},
            {frame: 30, value: 0},
            {frame: 40, value: 255},
            {frame: 50, value: 0},
            {frame: 60, value: 255},
            {frame: 70, value: 0},
            {frame: 80, value: 255},
            {frame: 90, value: 0},
            {frame: 100, value: 255},
            {frame: 110, value: 0},
            {frame: 120, value: 255}
        ]);
        
        // Update objects list
        if (this.updateObjectsList) {
            this.updateObjectsList();
        }
        
        // Play the animation
        animAPI.play();
    }
    
    createWaveAnimation() {
        const animAPI = new AnimationAPI(this.engine);
        
        // Clear existing objects
        animAPI.clearAll();
        
        // Create a group in a circle
        const circles = animAPI.createGroup(12, 'circle', {
            size: 30,
            fill: color(100, 200, 255),
            name: "Wave Circle"
        }, 'circle');
        
        // Create wave effect
        animAPI.waveEffect(circles, 'width', 0, 120, 30, 60);
        
        // Update objects list
        if (this.updateObjectsList) {
            this.updateObjectsList();
        }
        
        // Play the animation
        animAPI.play();
    }
    
    createParticleAnimation() {
        animAPI.clearAll();
        animAPI.setFPS(30);
        animAPI.setDuration(4);
        
        // Create particle system
        animAPI.createParticleSystem(400, 300, 50, {
            type: 'circle',
            size: 15,
            color: [255, 0, 0],
            duration: 90,
            spread: 300,
            easing: 'easeOutCubic',
            scaleDown: true
        });
        
        // Add title that scales up
        const title = animAPI.createShape('text', {
            x: 400,
            y: 300,
            text: "BOOM!",
            fontSize: 10,
            fill: color(0, 100, 50)
        });
        
        // Animate title
        animAPI.animate(title, 'fontSize', [
            {frame: 0, value: 10, easing: 'easeOutElastic'},
            {frame: 20, value: 72, easing: 'easeOutElastic'}
        ]);
        
        animAPI.play();
    }
}
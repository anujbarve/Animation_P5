class TimelinePanel {
  constructor(engine, keyframeManager) {
    this.engine = engine;
    this.keyframeManager = keyframeManager;

    // DOM elements
    this.timelineContainer = null;
    this.timelineTrack = null;
    this.timelineScrubber = null;
    this.timelineRuler = null;
    this.playPauseButton = null;
    this.currentTimeDisplay = null;
  }

// In TimelinePanel.js's initialize method
initialize() {
    this.pixelsPerFrame = 5; // Default value
    
    // Check if we're using the VS Code UI
    const timelinePanelContent = document.querySelector('.timeline-panel-content');
    if (timelinePanelContent) {
        timelinePanelContent.id = 'timeline-container'; // Ensure ID is set
        this.timelineContainer = timelinePanelContent;
    }
    
    this.createTimelineDOM();
    this.setupTimelineEvents();
    this.createZoomControls();
    this.fitTimelineToWindow();
}

  createTimelineDOM() {
    // Get the container
    this.timelineContainer = document.getElementById("timeline-container");
    this.timelineContainer.innerHTML = ""; // Clear any existing content

    // Create UI elements
    this.createTimelineControls();
    this.createTimelineRuler();
    this.createTimelineTracks();
  }

  createTimelineControls() {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "timeline-controls";
    controlsContainer.style.display = "flex";
    controlsContainer.style.alignItems = "center";
    controlsContainer.style.padding = "5px";
    controlsContainer.style.borderBottom = "1px solid #444";

    // Play/Pause button
    this.playPauseButton = document.createElement("button");
    this.playPauseButton.className = "button";
    this.playPauseButton.innerHTML = "▶️";
    this.playPauseButton.style.width = "30px";

    // Current time display
    this.currentTimeDisplay = document.createElement("div");
    this.currentTimeDisplay.className = "current-time";
    this.currentTimeDisplay.innerHTML = "00:00:00";
    this.currentTimeDisplay.style.marginLeft = "10px";
    this.currentTimeDisplay.style.fontFamily = "monospace";


    const restartButton = document.createElement('button');
    restartButton.className = 'button';
    restartButton.innerHTML = '⟲';
    restartButton.title = 'Restart Animation';
    restartButton.style.width = '30px';
    restartButton.style.marginLeft = '5px';
    
    restartButton.addEventListener('click', () => {
        this.engine.timeline.restart();
        this.playPauseButton.innerHTML = '⏸️';
    });

    // Add controls to container
    controlsContainer.appendChild(this.playPauseButton);
    controlsContainer.appendChild(restartButton);
    controlsContainer.appendChild(this.currentTimeDisplay);

    // Add to timeline container
    this.timelineContainer.appendChild(controlsContainer);
  }

  createTimelineRuler() {
    this.timelineRuler = document.createElement("div");
    this.timelineRuler.className = "timeline-ruler";
    this.timelineRuler.style.height = "20px";
    this.timelineRuler.style.position = "relative";
    this.timelineRuler.style.borderBottom = "1px solid #444";
    this.timelineRuler.style.overflow = "hidden";

    // Generate ruler markers
    this.updateRulerMarkers();

    // Add to timeline container
    this.timelineContainer.appendChild(this.timelineRuler);
  }

  updateRulerMarkers() {
    if (!this.timelineRuler) return;

    this.timelineRuler.innerHTML = "";

    const totalFrames = this.engine.timeline.totalFrames;
    const pixelsPerFrame = 5; // Can be adjusted for zoom level

    // Calculate the width needed
    const rulerWidth = totalFrames * pixelsPerFrame;
    this.timelineRuler.style.width = `${rulerWidth}px`;

    // Create markers
    for (let i = 0; i <= totalFrames; i += 10) {
      const marker = document.createElement("div");
      marker.className = "ruler-marker";
      marker.style.position = "absolute";
      marker.style.left = `${i * pixelsPerFrame}px`;
      marker.style.height = i % 50 === 0 ? "12px" : "8px";
      marker.style.width = "1px";
      marker.style.backgroundColor = i % 50 === 0 ? "#aaa" : "#666";
      marker.style.top = i % 50 === 0 ? "0px" : "4px";

      // Add frame number for major markers
      if (i % 50 === 0) {
        const label = document.createElement("div");
        label.className = "ruler-label";
        label.textContent = i;
        label.style.position = "absolute";
        label.style.left = `${i * pixelsPerFrame + 3}px`;
        label.style.top = "0px";
        label.style.fontSize = "9px";
        label.style.color = "#aaa";
        this.timelineRuler.appendChild(label);
      }

      this.timelineRuler.appendChild(marker);
    }
  }

  createTimelineTracks() {
    const tracksContainer = document.createElement("div");
    tracksContainer.className = "timeline-tracks";
    tracksContainer.style.position = "relative";
    tracksContainer.style.overflow = "auto";
    tracksContainer.style.height = "calc(100% - 60px)"; // Subtract controls and ruler height

    // Create the main timeline track
    this.timelineTrack = document.createElement("div");
    this.timelineTrack.className = "timeline-track";
    this.timelineTrack.style.position = "relative";
    this.timelineTrack.style.height = "100%";
    this.timelineTrack.style.backgroundColor = "#2a2a2a";

    // Set width based on total frames
    const pixelsPerFrame = 5;
    const trackWidth = this.engine.timeline.totalFrames * pixelsPerFrame;
    this.timelineTrack.style.width = `${trackWidth}px`;

    // Create the timeline scrubber
    this.timelineScrubber = document.createElement("div");
    this.timelineScrubber.className = "timeline-scrubber";
    this.timelineScrubber.style.position = "absolute";
    this.timelineScrubber.style.top = "0";
    this.timelineScrubber.style.height = "100%";
    this.timelineScrubber.style.width = "2px";
    this.timelineScrubber.style.backgroundColor = "red";
    this.timelineScrubber.style.pointerEvents = "none";

    // Add scrubber to track
    this.timelineTrack.appendChild(this.timelineScrubber);

    // Add track to container
    tracksContainer.appendChild(this.timelineTrack);

    // Add container to timeline
    this.timelineContainer.appendChild(tracksContainer);
  }

  setupTimelineEvents() {
    if (!this.timelineTrack || !this.playPauseButton) return;

    // Click on timeline to set current frame
    this.timelineTrack.addEventListener("click", (e) => {
      const rect = this.timelineTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pixelsPerFrame = 5;
      const frame = Math.floor(x / pixelsPerFrame);

      if (frame >= 0 && frame < this.engine.timeline.totalFrames) {
        this.engine.timeline.setFrame(frame);
      }
    });

    // Play/Pause button
    this.playPauseButton.addEventListener("click", () => {
      if (this.engine.isPlaying) {
        this.engine.pause();
        this.playPauseButton.innerHTML = "▶️";
      } else {
        this.engine.play();
        this.playPauseButton.innerHTML = "⏸️";
      }
    });
  }

  update() {
    if (!this.timelineScrubber || !this.currentTimeDisplay) return;

    // Update scrubber position
    const currentFrame = this.engine.timeline.currentFrame;
    const pixelsPerFrame = 5;
    this.timelineScrubber.style.left = `${currentFrame * pixelsPerFrame}px`;

    // Update time display
    const timeInfo = this.engine.timeline.frameToTime(currentFrame);
    this.currentTimeDisplay.innerHTML = timeInfo.formatted;

    // Update keyframe markers
    this.updateKeyframeMarkers();

    // Update play/pause button state
    if (this.playPauseButton) {
      this.playPauseButton.innerHTML = this.engine.isPlaying ? "⏸️" : "▶️";
    }
  }

  updateKeyframeMarkers() {
    // Remove existing keyframe markers
    const existingMarkers =
      this.timelineTrack.querySelectorAll(".keyframe-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Only show keyframes for selected object
    if (!this.engine.selectedObject) return;

    const pixelsPerFrame = 5;
    const keyframes = this.keyframeManager.getKeyframesForObject(
      this.engine.selectedObject
    );

    // Create new markers
    keyframes.forEach((kf) => {
      const marker = document.createElement("div");
      marker.className = "keyframe-marker";
      marker.style.position = "absolute";
      marker.style.left = `${kf.frame * pixelsPerFrame - 4}px`; // Center the diamond
      marker.style.top = "50%";
      marker.style.width = "8px";
      marker.style.height = "8px";
      marker.style.backgroundColor = "#ffcc00";
      marker.style.transform = "rotate(45deg) translateY(-50%)";
      marker.style.cursor = "pointer";

      // Add property name as tooltip
      marker.title = `${kf.property}: ${kf.value}`;

      // Add to timeline track
      this.timelineTrack.appendChild(marker);

      // Make keyframes draggable
      this.setupKeyframeDrag(marker, kf);
    });
  }

  setupKeyframeDrag(markerElement, keyframeData) {
    let isDragging = false;
    let startX;
    let originalFrame = keyframeData.frame;

    markerElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      e.stopPropagation(); // Prevent timeline click
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const pixelsPerFrame = 5;
      const frameDelta = Math.round(deltaX / pixelsPerFrame);
      const newFrame = originalFrame + frameDelta;

      // Update position visually
      if (newFrame >= 0 && newFrame < this.engine.timeline.totalFrames) {
        markerElement.style.left = `${newFrame * pixelsPerFrame - 4}px`;
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = e.clientX - startX;
      const pixelsPerFrame = 5;
      const frameDelta = Math.round(deltaX / pixelsPerFrame);
      const newFrame = originalFrame + frameDelta;

      if (newFrame >= 0 && newFrame < this.engine.timeline.totalFrames) {
        // Update the actual keyframe
        this.keyframeManager.updateKeyframe(
          this.engine.selectedObject,
          keyframeData.property,
          originalFrame,
          newFrame,
          keyframeData.value,
          keyframeData.easing
        );

        // Update the timeline display
        this.updateKeyframeMarkers();
      }
    });
  }

  // Add this method to TimelinePanel class
  createZoomControls() {
    const zoomControls = document.createElement("div");
    zoomControls.className = "timeline-zoom-controls";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.innerHTML = "−";
    zoomOutButton.title = "Zoom Out";
    zoomOutButton.addEventListener("click", () => this.adjustZoom(0.8));

    const zoomInButton = document.createElement("button");
    zoomInButton.innerHTML = "+";
    zoomInButton.title = "Zoom In";
    zoomInButton.addEventListener("click", () => this.adjustZoom(1.25));

    const fitButton = document.createElement("button");
    fitButton.innerHTML = "↔";
    fitButton.title = "Fit Timeline";
    fitButton.addEventListener("click", () => this.fitTimelineToWindow());

    zoomControls.appendChild(zoomOutButton);
    zoomControls.appendChild(zoomInButton);
    zoomControls.appendChild(fitButton);

    this.timelineContainer.appendChild(zoomControls);
  }

  // Add method to adjust zoom
  adjustZoom(factor) {
    this.pixelsPerFrame = Math.max(
      2,
      Math.min(20, this.pixelsPerFrame * factor)
    );
    this.updateRulerMarkers();
    this.updateTrackWidth();
    this.update();
  }

  // Add method to fit timeline to window
  fitTimelineToWindow() {
    const containerWidth = this.timelineContainer.clientWidth;
    const totalFrames = this.engine.timeline.totalFrames;

    // Calculate pixels per frame to fit timeline
    this.pixelsPerFrame = Math.max(2, (containerWidth - 40) / totalFrames);

    this.updateRulerMarkers();
    this.updateTrackWidth();
    this.update();
  }

  // Add method to update track width
  updateTrackWidth() {
    if (!this.timelineTrack) return;

    const trackWidth = this.engine.timeline.totalFrames * this.pixelsPerFrame;
    this.timelineTrack.style.width = `${trackWidth}px`;
    this.timelineRuler.style.width = `${trackWidth}px`;
  }
}

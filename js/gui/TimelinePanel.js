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
    this.pixelsPerFrame = 5; // Default value
    this.tracksContainer = null;
    this.isDraggingScrubber = false;
  }

  initialize() {
    this.createTimelineDOM();
    this.setupTimelineEvents();
    this.createZoomControls();
    this.fitTimelineToWindow(); // Auto-fit on initialization
  }

  createTimelineDOM() {
    // Create container if it doesn't exist
    this.timelineContainer = document.getElementById("timeline-container");
    if (!this.timelineContainer) {
      this.timelineContainer = document.createElement("div");
      this.timelineContainer.id = "timeline-container";
      document.body.appendChild(this.timelineContainer);
    }
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
    controlsContainer.style.padding = "8px";
    controlsContainer.style.borderBottom = "1px solid var(--border-color)";
    controlsContainer.style.backgroundColor = "#1a1a1a";

    // Create controls wrapper for better organization
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "controls-wrapper";
    controlsWrapper.style.display = "flex";
    controlsWrapper.style.alignItems = "center";
    controlsWrapper.style.gap = "5px";

    // Play/Pause button
    this.playPauseButton = document.createElement("button");
    this.playPauseButton.className = "button timeline-btn";
    this.playPauseButton.innerHTML = "▶️";
    this.playPauseButton.title = "Play/Pause";
    this.playPauseButton.style.width = "32px";
    this.playPauseButton.style.height = "32px";
    this.playPauseButton.style.display = "flex";
    this.playPauseButton.style.justifyContent = "center";
    this.playPauseButton.style.alignItems = "center";
    this.playPauseButton.style.fontSize = "16px";
    this.playPauseButton.style.padding = "0";

    // Restart button
    const restartButton = document.createElement("button");
    restartButton.className = "button timeline-btn";
    restartButton.innerHTML = "⟲";
    restartButton.title = "Restart Animation";
    restartButton.style.width = "32px";
    restartButton.style.height = "32px";
    restartButton.style.display = "flex";
    restartButton.style.justifyContent = "center";
    restartButton.style.alignItems = "center";
    restartButton.style.fontSize = "16px";
    restartButton.style.padding = "0";

    restartButton.addEventListener("click", () => {
      this.engine.timeline.restart();
      this.playPauseButton.innerHTML = "⏸️";
    });

    // Current time display
    this.currentTimeDisplay = document.createElement("div");
    this.currentTimeDisplay.className = "current-time";
    this.currentTimeDisplay.innerHTML = "00:00:00";
    this.currentTimeDisplay.style.marginLeft = "10px";
    this.currentTimeDisplay.style.marginRight = "20px";
    this.currentTimeDisplay.style.fontFamily = "monospace";
    this.currentTimeDisplay.style.fontSize = "14px";
    this.currentTimeDisplay.style.padding = "3px 6px";
    this.currentTimeDisplay.style.backgroundColor = "#111";
    this.currentTimeDisplay.style.borderRadius = "3px";
    this.currentTimeDisplay.style.border = "1px solid #333";

    // Add frame navigation controls
    const prevFrameBtn = document.createElement("button");
    prevFrameBtn.className = "button timeline-btn";
    prevFrameBtn.innerHTML = "◀";
    prevFrameBtn.title = "Previous Frame";
    prevFrameBtn.style.width = "28px";
    prevFrameBtn.style.height = "28px";
    prevFrameBtn.style.padding = "0";
    prevFrameBtn.addEventListener("click", () => {
      const currentFrame = this.engine.timeline.currentFrame;
      if (currentFrame > 0) {
        this.engine.timeline.setFrame(currentFrame - 1);
      }
    });

    const nextFrameBtn = document.createElement("button");
    nextFrameBtn.className = "button timeline-btn";
    nextFrameBtn.innerHTML = "▶";
    nextFrameBtn.title = "Next Frame";
    nextFrameBtn.style.width = "28px";
    nextFrameBtn.style.height = "28px";
    nextFrameBtn.style.padding = "0";
    nextFrameBtn.addEventListener("click", () => {
      const currentFrame = this.engine.timeline.currentFrame;
      if (currentFrame < this.engine.timeline.totalFrames - 1) {
        this.engine.timeline.setFrame(currentFrame + 1);
      }
    });

    // Add keyframing controls
    const addKeyframeBtn = document.createElement("button");
    addKeyframeBtn.className = "button timeline-btn";
    addKeyframeBtn.innerHTML = "◆";
    addKeyframeBtn.title = "Add Keyframe";
    addKeyframeBtn.style.color = "var(--keyframe-color)";
    addKeyframeBtn.style.width = "28px";
    addKeyframeBtn.style.height = "28px";
    addKeyframeBtn.style.marginLeft = "15px";
    addKeyframeBtn.style.padding = "0";
    addKeyframeBtn.addEventListener("click", () => {
      if (this.engine.selectedObject) {
        const property = prompt("Enter property to keyframe:", "x");
        if (property && this.engine.selectedObject.hasOwnProperty(property)) {
          this.keyframeManager.createKeyframeForCurrentSelection(
            this.engine,
            property
          );
          this.updateKeyframeMarkers();
        }
      } else {
        alert("Please select an object first");
      }
    });

    // Add controls to wrapper
    controlsWrapper.appendChild(this.playPauseButton);
    controlsWrapper.appendChild(restartButton);
    controlsWrapper.appendChild(this.currentTimeDisplay);
    controlsWrapper.appendChild(prevFrameBtn);
    controlsWrapper.appendChild(nextFrameBtn);
    controlsWrapper.appendChild(addKeyframeBtn);

    // Create FPS counter/setter
    const fpsContainer = document.createElement("div");
    fpsContainer.className = "fps-container";
    fpsContainer.style.marginLeft = "auto";
    fpsContainer.style.display = "flex";
    fpsContainer.style.alignItems = "center";
    fpsContainer.style.gap = "5px";

    const fpsLabel = document.createElement("span");
    fpsLabel.textContent = "FPS:";
    fpsLabel.style.fontSize = "12px";

    const fpsInput = document.createElement("input");
    fpsInput.type = "number";
    fpsInput.min = "1";
    fpsInput.max = "60";
    fpsInput.value = this.engine.timeline.fps;
    fpsInput.style.width = "40px";
    fpsInput.style.padding = "3px";
    fpsInput.style.backgroundColor = "#222";
    fpsInput.style.color = "var(--text-color)";
    fpsInput.style.border = "1px solid #444";
    fpsInput.style.borderRadius = "3px";
    fpsInput.addEventListener("change", () => {
      const fps = parseInt(fpsInput.value);
      if (fps > 0 && fps <= 60) {
        this.engine.timeline.setFPS(fps);
      }
    });

    fpsContainer.appendChild(fpsLabel);
    fpsContainer.appendChild(fpsInput);

    // Add wrappers to container
    controlsContainer.appendChild(controlsWrapper);
    controlsContainer.appendChild(fpsContainer);

    // Add to timeline container
    this.timelineContainer.appendChild(controlsContainer);
  }

  createTimelineRuler() {
    const rulerContainer = document.createElement("div");
    rulerContainer.className = "timeline-ruler-container";
    rulerContainer.style.position = "relative";
    rulerContainer.style.height = "20px";
    rulerContainer.style.overflow = "hidden";
    rulerContainer.style.borderBottom = "1px solid var(--border-color)";
    rulerContainer.style.backgroundColor = "#1a1a1a";

    this.timelineRuler = document.createElement("div");
    this.timelineRuler.className = "timeline-ruler";
    this.timelineRuler.style.height = "20px";
    this.timelineRuler.style.position = "relative";

    rulerContainer.appendChild(this.timelineRuler);
    this.timelineContainer.appendChild(rulerContainer);

    // Generate ruler markers
    this.updateRulerMarkers();
  }

  updateRulerMarkers() {
    if (!this.timelineRuler) return;

    this.timelineRuler.innerHTML = "";

    const totalFrames = this.engine.timeline.totalFrames;

    // Calculate the width needed
    const rulerWidth = totalFrames * this.pixelsPerFrame;
    this.timelineRuler.style.width = `${rulerWidth}px`;

    // Create markers
    for (let i = 0; i <= totalFrames; i += 5) {
      const marker = document.createElement("div");
      marker.className = "ruler-marker";
      marker.style.position = "absolute";
      marker.style.left = `${i * this.pixelsPerFrame}px`;
      marker.style.height =
        i % 50 === 0 ? "12px" : i % 10 === 0 ? "10px" : "6px";
      marker.style.width = "1px";
      marker.style.backgroundColor =
        i % 50 === 0 ? "#aaa" : i % 10 === 0 ? "#888" : "#555";
      marker.style.top = i % 50 === 0 ? "2px" : i % 10 === 0 ? "4px" : "7px";

      // Add frame number for major markers
      if (i % 50 === 0 || (i % 10 === 0 && this.pixelsPerFrame > 8)) {
        const label = document.createElement("div");
        label.className = "ruler-label";
        label.textContent = i;
        label.style.position = "absolute";
        label.style.left = `${i * this.pixelsPerFrame + 3}px`;
        label.style.top = "0px";
        label.style.fontSize = "9px";
        label.style.color = "#aaa";
        this.timelineRuler.appendChild(label);
      }

      this.timelineRuler.appendChild(marker);
    }
  }

  createTimelineTracks() {
    this.tracksContainer = document.createElement("div");
    this.tracksContainer.className = "timeline-tracks";
    this.tracksContainer.style.position = "relative";
    this.tracksContainer.style.overflow = "auto";
    this.tracksContainer.style.height = "calc(100% - 64px)"; // Subtract controls and ruler height
    this.tracksContainer.style.backgroundColor = "#151515";

    // Create layers container
    const layersContainer = document.createElement("div");
    layersContainer.className = "layers-container";
    layersContainer.style.position = "absolute";
    layersContainer.style.left = "0";
    layersContainer.style.top = "0";
    layersContainer.style.width = "150px";
    layersContainer.style.height = "100%";
    layersContainer.style.borderRight = "1px solid var(--border-color)";
    layersContainer.style.backgroundColor = "#1a1a1a";
    layersContainer.style.zIndex = "2";
    layersContainer.style.overflowY = "auto";

    // Populate with object layers
    this.updateLayersList(layersContainer);

    // Create the main timeline track
    const trackArea = document.createElement("div");
    trackArea.className = "track-area";
    trackArea.style.marginLeft = "150px";
    trackArea.style.height = "100%";
    trackArea.style.overflow = "auto";
    trackArea.style.position = "relative";

    this.timelineTrack = document.createElement("div");
    this.timelineTrack.className = "timeline-track";
    this.timelineTrack.style.position = "relative";
    this.timelineTrack.style.height = "100%";
    this.timelineTrack.style.backgroundColor = "var(--timeline-track)";

    // Set width based on total frames
    const trackWidth = this.engine.timeline.totalFrames * this.pixelsPerFrame;
    this.timelineTrack.style.width = `${trackWidth}px`;
    this.timelineTrack.style.minHeight = "150px"; // Ensure minimum height

    // Create the timeline scrubber
    this.timelineScrubber = document.createElement("div");
    this.timelineScrubber.className = "timeline-scrubber";
    this.timelineScrubber.style.position = "absolute";
    this.timelineScrubber.style.top = "0";
    this.timelineScrubber.style.height = "100%";
    this.timelineScrubber.style.width = "2px";
    this.timelineScrubber.style.backgroundColor = "red";
    this.timelineScrubber.style.zIndex = "3";
    this.timelineScrubber.innerHTML = `<div class="scrubber-handle" style="width:10px;height:10px;background-color:red;position:absolute;top:0;left:-4px;border-radius:50%;"></div>`;

    // Add scrubber to track
    this.timelineTrack.appendChild(this.timelineScrubber);

    trackArea.appendChild(this.timelineTrack);
    this.tracksContainer.appendChild(layersContainer);
    this.tracksContainer.appendChild(trackArea);

    // Add container to timeline
    this.timelineContainer.appendChild(this.tracksContainer);
  }

  updateLayersList(container) {
    if (!container) return;
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "layers-header";
    header.textContent = "Objects";
    header.style.padding = "8px";
    header.style.fontWeight = "bold";
    header.style.borderBottom = "1px solid var(--border-color)";
    container.appendChild(header);

    // Get all objects
    const objects = this.engine.objects;

    // Create a list item for each object
    objects.forEach((obj, index) => {
      const item = document.createElement("div");
      item.className = "layer-item";
      item.setAttribute("data-object-id", obj.id);
      item.style.padding = "6px 8px";
      item.style.borderBottom = "1px solid #222";
      item.style.cursor = "pointer";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.transition = "background-color 0.2s";

      if (this.engine.selectedObject === obj) {
        item.style.backgroundColor = "#2a4e7a";
      }

      // Add visibility toggle
      const visToggle = document.createElement("span");
      visToggle.innerHTML = obj.visible ? "👁️" : "👁️‍🗨️";
      visToggle.style.marginRight = "8px";
      visToggle.style.fontSize = "14px";
      visToggle.style.opacity = obj.visible ? 1 : 0.5;
      visToggle.style.cursor = "pointer";

      visToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Don't select the object
        obj.visible = !obj.visible;
        visToggle.innerHTML = obj.visible ? "👁️" : "👁️‍🗨️";
        visToggle.style.opacity = obj.visible ? 1 : 0.5;
      });

      // Add object name
      const name = document.createElement("span");
      name.textContent = obj.name || `Object ${index}`;
      name.style.flex = 1;
      name.style.overflow = "hidden";
      name.style.textOverflow = "ellipsis";
      name.style.whiteSpace = "nowrap";

      item.appendChild(visToggle);
      item.appendChild(name);

      // When clicked, select the object
      item.addEventListener("click", () => {
        this.engine.selectObject(obj);
        // Update selection styling
        document.querySelectorAll(".layer-item").forEach((el) => {
          el.style.backgroundColor = "";
        });
        item.style.backgroundColor = "#2a4e7a";
      });

      // Hover effect
      item.addEventListener("mouseenter", () => {
        if (this.engine.selectedObject !== obj) {
          item.style.backgroundColor = "#2c2c2c";
        }
      });

      item.addEventListener("mouseleave", () => {
        if (this.engine.selectedObject !== obj) {
          item.style.backgroundColor = "";
        }
      });

      container.appendChild(item);
    });
  }

  setupTimelineEvents() {
    if (!this.timelineTrack || !this.playPauseButton) return;

    // Click on timeline to set current frame
    this.timelineTrack.addEventListener("click", (e) => {
      const rect = this.timelineTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const frame = Math.floor(x / this.pixelsPerFrame);

      if (frame >= 0 && frame < this.engine.timeline.totalFrames) {
        this.engine.timeline.setFrame(frame);
      }
    });

    // Scrubber dragging
    this.timelineScrubber.addEventListener("mousedown", (e) => {
      this.isDraggingScrubber = true;
      e.stopPropagation(); // Prevent timeline click
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.isDraggingScrubber) return;

      const rect = this.timelineTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const frame = Math.floor(x / this.pixelsPerFrame);

      if (frame >= 0 && frame < this.engine.timeline.totalFrames) {
        this.engine.timeline.setFrame(frame);
      }
    });

    document.addEventListener("mouseup", () => {
      this.isDraggingScrubber = false;
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

    // Track scrolling synchronization
    if (this.tracksContainer) {
      const trackArea = this.tracksContainer.querySelector(".track-area");

      trackArea.addEventListener("scroll", () => {
        // Keep the ruler in sync with horizontal scroll
        const rulerContainer = this.timelineContainer.querySelector(
          ".timeline-ruler-container"
        );
        rulerContainer.scrollLeft = trackArea.scrollLeft;
      });
    }

    // Mouse wheel for horizontal scrolling with shift key
    this.timelineTrack.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        const trackArea = this.tracksContainer.querySelector(".track-area");
        trackArea.scrollLeft += e.deltaY;
      } else if (e.ctrlKey || e.metaKey) {
        // Zoom with ctrl/cmd + wheel
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.8 : 1.25;
        this.adjustZoom(zoomFactor);
      }
    });
  }

  createZoomControls() {
    const zoomControls = document.createElement("div");
    zoomControls.className = "timeline-zoom-controls";
    zoomControls.style.position = "absolute";
    zoomControls.style.bottom = "10px";
    zoomControls.style.right = "10px";
    zoomControls.style.display = "flex";
    zoomControls.style.gap = "5px";
    zoomControls.style.zIndex = "5";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.innerHTML = "−";
    zoomOutButton.title = "Zoom Out";
    zoomOutButton.className = "button";
    zoomOutButton.style.width = "24px";
    zoomOutButton.style.height = "24px";
    zoomOutButton.style.padding = "0";
    zoomOutButton.style.display = "flex";
    zoomOutButton.style.alignItems = "center";
    zoomOutButton.style.justifyContent = "center";
    zoomOutButton.addEventListener("click", () => this.adjustZoom(0.8));

    const zoomInButton = document.createElement("button");
    zoomInButton.innerHTML = "+";
    zoomInButton.title = "Zoom In";
    zoomInButton.className = "button";
    zoomInButton.style.width = "24px";
    zoomInButton.style.height = "24px";
    zoomInButton.style.padding = "0";
    zoomInButton.style.display = "flex";
    zoomInButton.style.alignItems = "center";
    zoomInButton.style.justifyContent = "center";
    zoomInButton.addEventListener("click", () => this.adjustZoom(1.25));

    const fitButton = document.createElement("button");
    fitButton.innerHTML = "↔";
    fitButton.title = "Fit Timeline";
    fitButton.className = "button";
    fitButton.style.width = "24px";
    fitButton.style.height = "24px";
    fitButton.style.padding = "0";
    fitButton.style.display = "flex";
    fitButton.style.alignItems = "center";
    fitButton.style.justifyContent = "center";
    fitButton.addEventListener("click", () => this.fitTimelineToWindow());

    zoomControls.appendChild(zoomOutButton);
    zoomControls.appendChild(zoomInButton);
    zoomControls.appendChild(fitButton);

    this.timelineContainer.appendChild(zoomControls);
  }

  adjustZoom(factor) {
    this.pixelsPerFrame = Math.max(
      2,
      Math.min(20, this.pixelsPerFrame * factor)
    );
    this.updateRulerMarkers();
    this.updateTrackWidth();
    this.update();
  }

  fitTimelineToWindow() {
    const trackArea = this.tracksContainer?.querySelector(".track-area");
    if (!trackArea) return;

    const containerWidth = trackArea.clientWidth;
    const totalFrames = this.engine.timeline.totalFrames;

    // Calculate pixels per frame to fit timeline
    this.pixelsPerFrame = Math.max(2, (containerWidth - 20) / totalFrames);

    this.updateRulerMarkers();
    this.updateTrackWidth();
    this.update();
  }

  updateTrackWidth() {
    if (!this.timelineTrack) return;

    const trackWidth = this.engine.timeline.totalFrames * this.pixelsPerFrame;
    this.timelineTrack.style.width = `${trackWidth}px`;
    this.timelineRuler.style.width = `${trackWidth}px`;
  }

  update() {
    if (!this.timelineScrubber || !this.currentTimeDisplay) return;

    // Update scrubber position
    const currentFrame = this.engine.timeline.currentFrame;
    this.timelineScrubber.style.left = `${
      currentFrame * this.pixelsPerFrame
    }px`;

    // Update time display
    const timeInfo = this.engine.timeline.frameToTime(currentFrame);
    this.currentTimeDisplay.innerHTML = timeInfo.formatted;

    // Update keyframe markers
    this.updateKeyframeMarkers();

    // Update play/pause button state
    if (this.playPauseButton) {
      this.playPauseButton.innerHTML = this.engine.isPlaying ? "⏸️" : "▶️";
    }

    // Update layers list
    const layersContainer =
      this.tracksContainer?.querySelector(".layers-container");
    if (layersContainer) {
      this.updateLayersList(layersContainer);
    }
  }

  updateKeyframeMarkers() {
    // Remove existing keyframe markers
    const existingMarkers =
      this.timelineTrack.querySelectorAll(".keyframe-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Only show keyframes for selected object
    if (!this.engine.selectedObject) return;

    const keyframes = this.keyframeManager.getKeyframesForObject(
      this.engine.selectedObject
    );

    // Create new markers
    keyframes.forEach((kf) => {
      const marker = document.createElement("div");
      marker.className = "keyframe-marker";
      marker.style.position = "absolute";
      marker.style.left = `${kf.frame * this.pixelsPerFrame - 4}px`; // Center the diamond
      marker.style.top = "50%";
      marker.style.width = "8px";
      marker.style.height = "8px";
      marker.style.backgroundColor = "var(--keyframe-color)";
      marker.style.transform = "rotate(45deg) translateY(-50%)";
      marker.style.cursor = "pointer";
      marker.style.borderRadius = "1px";
      marker.style.zIndex = "2";

      // Add property name as tooltip
      marker.title = `${kf.property}: ${kf.value} [${kf.easing || "linear"}]`;

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
      originalFrame = keyframeData.frame; // Update original frame on each drag start
      e.stopPropagation(); // Prevent timeline click

      // Add active state
      markerElement.classList.add("active");
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const frameDelta = Math.round(deltaX / this.pixelsPerFrame);
      const newFrame = originalFrame + frameDelta;

      // Update position visually
      if (newFrame >= 0 && newFrame < this.engine.timeline.totalFrames) {
        markerElement.style.left = `${newFrame * this.pixelsPerFrame - 4}px`;
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;

      // Remove active state
      markerElement.classList.remove("active");

      const deltaX = e.clientX - startX;
      const frameDelta = Math.round(deltaX / this.pixelsPerFrame);
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

    // Context menu for keyframe
    markerElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      // Create context menu
      const contextMenu = document.createElement("div");
      contextMenu.className = "keyframe-context-menu";
      contextMenu.style.position = "fixed";
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.backgroundColor = "#333";
      contextMenu.style.border = "1px solid #555";
      contextMenu.style.borderRadius = "4px";
      contextMenu.style.padding = "5px 0";
      contextMenu.style.zIndex = "1000";
      contextMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";

      const menuItems = [
        {
          label: "Set Value...",
          action: () => {
            const newValue = prompt("Enter new value:", keyframeData.value);
            if (newValue !== null) {
              const numValue = parseFloat(newValue);
              if (!isNaN(numValue)) {
                this.keyframeManager.updateKeyframe(
                  this.engine.selectedObject,
                  keyframeData.property,
                  keyframeData.frame,
                  keyframeData.frame,
                  numValue,
                  keyframeData.easing
                );
                this.updateKeyframeMarkers();
              }
            }
          },
        },
        {
          label: "Set Easing...",
          action: () => {
            const easings = [
              "linear",
              "easeInQuad",
              "easeOutQuad",
              "easeInOutQuad",
              "easeInCubic",
              "easeOutCubic",
              "easeInOutCubic",
              "easeInQuart",
              "easeOutQuart",
              "easeInOutQuart",
              "easeInQuint",
              "easeOutQuint",
              "easeInOutQuint",
              "easeInSine",
              "easeOutSine",
              "easeInOutSine",
              "easeInExpo",
              "easeOutExpo",
              "easeInOutExpo",
              "easeInCirc",
              "easeOutCirc",
              "easeInOutCirc",
              "easeInElastic",
              "easeOutElastic",
              "easeInOutElastic",
              "easeInBack",
              "easeOutBack",
              "easeInOutBack",
              "easeInBounce",
              "easeOutBounce",
              "easeInOutBounce",
            ];

            const easingMenu = document.createElement("div");
            easingMenu.className = "easing-menu";
            easingMenu.style.position = "fixed";
            easingMenu.style.left = `${
              contextMenu.offsetLeft + contextMenu.offsetWidth
            }px`;
            easingMenu.style.top = `${contextMenu.offsetTop}px`;
            easingMenu.style.backgroundColor = "#333";
            easingMenu.style.border = "1px solid #555";
            easingMenu.style.borderRadius = "4px";
            easingMenu.style.padding = "5px 0";
            easingMenu.style.zIndex = "1000";
            easingMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
            easingMenu.style.maxHeight = "300px";
            easingMenu.style.overflowY = "auto";

            easings.forEach((easing) => {
              const item = document.createElement("div");
              item.style.padding = "5px 15px";
              item.style.cursor = "pointer";
              item.style.whiteSpace = "nowrap";
              item.textContent = easing;

              if (keyframeData.easing === easing) {
                item.style.backgroundColor = "#4d94e7";
              }

              item.addEventListener("mouseenter", () => {
                if (keyframeData.easing !== easing) {
                  item.style.backgroundColor = "#444";
                }
              });

              item.addEventListener("mouseleave", () => {
                if (keyframeData.easing !== easing) {
                  item.style.backgroundColor = "";
                }
              });

              item.addEventListener("click", () => {
                this.keyframeManager.updateKeyframe(
                  this.engine.selectedObject,
                  keyframeData.property,
                  keyframeData.frame,
                  keyframeData.frame,
                  keyframeData.value,
                  easing
                );
                this.updateKeyframeMarkers();
                document.body.removeChild(easingMenu);
                document.body.removeChild(contextMenu);
              });

              easingMenu.appendChild(item);
            });

            document.body.appendChild(easingMenu);
          },
        },
        {
          label: "Delete Keyframe",
          action: () => {
            this.keyframeManager.removeKeyframe(
              this.engine.selectedObject,
              keyframeData.property,
              keyframeData.frame
            );
            this.updateKeyframeMarkers();
          },
        },
      ];

      menuItems.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.style.padding = "5px 15px";
        menuItem.style.cursor = "pointer";
        menuItem.style.whiteSpace = "nowrap";
        menuItem.textContent = item.label;

        menuItem.addEventListener("mouseenter", () => {
          menuItem.style.backgroundColor = "#444";
        });

        menuItem.addEventListener("mouseleave", () => {
          menuItem.style.backgroundColor = "";
        });

        menuItem.addEventListener("click", () => {
          item.action();
          document.body.removeChild(contextMenu);
        });

        contextMenu.appendChild(menuItem);
      });

      document.body.appendChild(contextMenu);

      // Close menu when clicking elsewhere
      setTimeout(() => {
        const closeMenu = (e) => {
          if (
            !contextMenu.contains(e.target) &&
            !e.target.classList.contains("easing-menu") &&
            !e.target.closest(".easing-menu")
          ) {
            document.body.removeChild(contextMenu);

            const easingMenu = document.querySelector(".easing-menu");
            if (easingMenu) {
              document.body.removeChild(easingMenu);
            }

            document.removeEventListener("click", closeMenu);
          }
        };

        document.addEventListener("click", closeMenu);
      }, 0);
    });
  }
}

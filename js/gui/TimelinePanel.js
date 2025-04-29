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
    controlsContainer.className =
      "flex items-center p-2 border-b border-gray-600 bg-gray-700";

    // Create controls wrapper for better organization
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "flex items-center gap-1";

    // Play/Pause button
    this.playPauseButton = document.createElement("button");
    this.playPauseButton.className =
      "bg-gray-600 text-gray-100 border-none rounded w-8 h-8 flex items-center justify-center text-base cursor-pointer hover:bg-gray-500";
    this.playPauseButton.innerHTML = "▶️";
    this.playPauseButton.title = "Play/Pause";

    // Restart button
    const restartButton = document.createElement("button");
    restartButton.className =
      "bg-gray-600 text-gray-100 border-none rounded w-8 h-8 flex items-center justify-center text-base cursor-pointer hover:bg-gray-500";
    restartButton.innerHTML = "⟲";
    restartButton.title = "Restart Animation";

    restartButton.addEventListener("click", () => {
      this.engine.timeline.restart();
      this.playPauseButton.innerHTML = "⏸️";
    });

    // Current time display
    this.currentTimeDisplay = document.createElement("div");
    this.currentTimeDisplay.className =
      "ml-2 mr-5 font-mono text-sm p-1 bg-gray-800 rounded border border-gray-600";
    this.currentTimeDisplay.innerHTML = "00:00:00";

    // Add frame navigation controls
    const prevFrameBtn = document.createElement("button");
    prevFrameBtn.className =
      "bg-gray-600 text-gray-100 border-none rounded w-7 h-7 cursor-pointer hover:bg-gray-500";
    prevFrameBtn.innerHTML = "◀";
    prevFrameBtn.title = "Previous Frame";
    prevFrameBtn.addEventListener("click", () => {
      const currentFrame = this.engine.timeline.currentFrame;
      if (currentFrame > 0) {
        this.engine.timeline.setFrame(currentFrame - 1);
      }
    });

    const nextFrameBtn = document.createElement("button");
    nextFrameBtn.className =
      "bg-gray-600 text-gray-100 border-none rounded w-7 h-7 cursor-pointer hover:bg-gray-500";
    nextFrameBtn.innerHTML = "▶";
    nextFrameBtn.title = "Next Frame";
    nextFrameBtn.addEventListener("click", () => {
      const currentFrame = this.engine.timeline.currentFrame;
      if (currentFrame < this.engine.timeline.totalFrames - 1) {
        this.engine.timeline.setFrame(currentFrame + 1);
      }
    });

    // Add keyframing controls
    const addKeyframeBtn = document.createElement("button");
    addKeyframeBtn.className =
      "bg-gray-600 text-yellow-400 border-none rounded w-7 h-7 ml-4 cursor-pointer hover:bg-gray-500";
    addKeyframeBtn.innerHTML = "◆";
    addKeyframeBtn.title = "Add Keyframe";
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
    fpsContainer.className = "ml-auto flex items-center gap-1";

    const fpsLabel = document.createElement("span");
    fpsLabel.className = "text-xs";
    fpsLabel.textContent = "FPS:";

    const fpsInput = document.createElement("input");
    fpsInput.type = "number";
    fpsInput.min = "1";
    fpsInput.max = "60";
    fpsInput.value = this.engine.timeline.fps;
    fpsInput.className =
      "w-10 p-1 bg-gray-700 text-gray-100 border border-gray-600 rounded";
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
    rulerContainer.className =
      "relative h-5 overflow-hidden border-b border-gray-600 bg-gray-700";

    this.timelineRuler = document.createElement("div");
    this.timelineRuler.className = "h-5 relative";

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
      marker.className = "ruler-marker absolute";
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
        label.className = "ruler-label absolute text-[9px] text-gray-400";
        label.textContent = i;
        label.style.left = `${i * this.pixelsPerFrame + 3}px`;
        label.style.top = "0px";
        this.timelineRuler.appendChild(label);
      }

      this.timelineRuler.appendChild(marker);
    }
  }

  createTimelineTracks() {
    this.tracksContainer = document.createElement("div");
    this.tracksContainer.className =
      "relative overflow-auto h-[calc(100%-64px)] bg-gray-800";

    // Create layers container
    const layersContainer = document.createElement("div");
    layersContainer.className =
      "absolute left-0 top-0 w-36 h-full border-r border-gray-600 bg-gray-700 z-10 overflow-y-auto";

    // Populate with object layers
    this.updateLayersList(layersContainer);

    // Create the main timeline track
    const trackArea = document.createElement("div");
    trackArea.className = "track-area ml-36 h-full overflow-auto relative";

    this.timelineTrack = document.createElement("div");
    this.timelineTrack.className = "relative h-full bg-gray-700";

    // Set width based on total frames
    const trackWidth = this.engine.timeline.totalFrames * this.pixelsPerFrame;
    this.timelineTrack.style.width = `${trackWidth}px`;
    this.timelineTrack.style.minHeight = "150px"; // Ensure minimum height

    // Create the timeline scrubber
    this.timelineScrubber = document.createElement("div");
    this.timelineScrubber.className =
      "absolute top-0 h-full w-[2px] bg-red-500 z-20";
    this.timelineScrubber.innerHTML = `<div class="scrubber-handle"></div>`;

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
    header.className = "p-2 font-bold border-b border-gray-600";
    header.textContent = "Objects";
    container.appendChild(header);

    // Get all objects
    const objects = this.engine.objects;

    // Create a list item for each object
    objects.forEach((obj, index) => {
      const item = document.createElement("div");
      item.className =
        "layer-item p-2 border-b border-gray-700 cursor-pointer flex items-center transition-colors duration-200";
      item.setAttribute("data-object-id", obj.id);

      if (this.engine.selectedObject === obj) {
        item.classList.add("bg-blue-800");
      }

      // Add visibility toggle
      const visToggle = document.createElement("span");
      visToggle.className = "mr-2 text-sm";
      visToggle.style.opacity = obj.visible ? 1 : 0.5;
      visToggle.style.cursor = "pointer";
      visToggle.innerHTML = obj.visible ? "👁️" : "👁️‍🗨️";

      visToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // Don't select the object
        obj.visible = !obj.visible;
        visToggle.innerHTML = obj.visible ? "👁️" : "👁️‍🗨️";
        visToggle.style.opacity = obj.visible ? 1 : 0.5;
      });

      // Add object name
      const name = document.createElement("span");
      name.className = "flex-1 overflow-hidden text-ellipsis whitespace-nowrap";
      name.textContent = obj.name || `Object ${index}`;

      item.appendChild(visToggle);
      item.appendChild(name);

      // When clicked, select the object
      item.addEventListener("click", () => {
        this.engine.selectObject(obj);
        // Update selection styling
        document.querySelectorAll(".layer-item").forEach((el) => {
          el.classList.remove("bg-blue-800");
        });
        item.classList.add("bg-blue-800");
      });

      // Hover effect
      item.addEventListener("mouseenter", () => {
        if (this.engine.selectedObject !== obj) {
          item.classList.add("bg-gray-600");
        }
      });

      item.addEventListener("mouseleave", () => {
        if (this.engine.selectedObject !== obj) {
          item.classList.remove("bg-gray-600");
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
        const rulerContainer = this.timelineContainer.querySelector(".h-5");
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
    zoomControls.className = "absolute bottom-2 right-2 flex gap-1 z-20";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.className =
      "bg-gray-600 text-gray-100 border-none rounded w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-500";
    zoomOutButton.innerHTML = "−";
    zoomOutButton.title = "Zoom Out";
    zoomOutButton.addEventListener("click", () => this.adjustZoom(0.8));

    const zoomInButton = document.createElement("button");
    zoomInButton.className =
      "bg-gray-600 text-gray-100 border-none rounded w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-500";
    zoomInButton.innerHTML = "+";
    zoomInButton.title = "Zoom In";
    zoomInButton.addEventListener("click", () => this.adjustZoom(1.25));

    const fitButton = document.createElement("button");
    fitButton.className =
      "bg-gray-600 text-gray-100 border-none rounded w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-500";
    fitButton.innerHTML = "↔";
    fitButton.title = "Fit Timeline";
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
    const layersContainer = this.tracksContainer?.querySelector(".w-36");
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
      marker.className =
        "keyframe-marker absolute w-2 h-2 bg-yellow-400 cursor-pointer z-10";
      marker.style.left = `${kf.frame * this.pixelsPerFrame - 4}px`; // Center the diamond
      marker.style.top = "50%";
      marker.style.borderRadius = "1px";

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
      markerElement.classList.add("scale-125");
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
      markerElement.classList.remove("scale-125");

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
      contextMenu.className =
        "bg-gray-700 border border-gray-600 rounded p-1 absolute z-50 shadow-lg";
      contextMenu.style.position = "fixed";
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;

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
            easingMenu.className =
              "bg-gray-700 border border-gray-600 rounded p-1 absolute z-50 shadow-lg max-h-72 overflow-y-auto";
            easingMenu.style.position = "fixed";
            easingMenu.style.left = `${
              contextMenu.offsetLeft + contextMenu.offsetWidth
            }px`;
            easingMenu.style.top = `${contextMenu.offsetTop}px`;

            easings.forEach((easing) => {
              const item = document.createElement("div");
              item.className =
                "p-1 cursor-pointer whitespace-nowrap hover:bg-gray-600";
              item.textContent = easing;
              if (keyframeData.easing === easing) {
                item.classList.add("bg-blue-700");
              }

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
        menuItem.className =
          "p-1 cursor-pointer whitespace-nowrap hover:bg-gray-600";
        menuItem.textContent = item.label;

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
            !e.target.classList.contains("bg-gray-700") &&
            !e.target.closest(".bg-gray-700")
          ) {
            document.body.removeChild(contextMenu);
            const easingMenu = document.querySelector(".max-h-72");
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

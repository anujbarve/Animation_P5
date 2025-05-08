class PropertiesPanel {
  constructor(engine, gui, keyframeManager) {
    this.engine = engine;
    this.gui = gui;
    this.keyframeManager = keyframeManager;

    // GUI folders
    this.shapeFolder = null;
    this.styleFolder = null;
    this.animationFolder = null;
    this.presetsFolder = null; // Add this line

    // GUI controllers
    this.controllers = {
      shape: {},
      style: {},
      animation: {},
    };

    this.lastSelectedObject = null;
  }

  initialize() {
    // Create folders
    this.shapeFolder = this.gui.addFolder("Shape Properties");
    this.styleFolder = this.gui.addFolder("Style Properties");
    this.animationFolder = this.gui.addFolder("Animation");
    // Add empty message when no object is selected
    this.updateForSelectedObject();
  }

  update() {
    // Check if selected object changed
    if (this.lastSelectedObject !== this.engine.selectedObject) {
      this.updateForSelectedObject();
    }

    // Update controllers if needed
    this.updateControllers();
  }

  updateForSelectedObject() {
    // Store reference to currently selected object
    this.lastSelectedObject = this.engine.selectedObject;

    // Clear existing controllers
    this.clearControllers();

    // Clear any previous no-selection message
    const oldMessage = this.shapeFolder.domElement.querySelector(
      ".no-selection-message"
    );
    if (oldMessage) {
      oldMessage.remove();
    }

    // If no object selected, show message
    if (!this.engine.selectedObject) {
      const noSelectionMsg = document.createElement("div");
      noSelectionMsg.className =
        "no-selection-message p-2 text-gray-400 text-center italic";
      noSelectionMsg.innerHTML = "No object selected";
      this.shapeFolder.domElement.appendChild(noSelectionMsg);
      return;
    }

    // Add appropriate controllers for the selected object type
    this.addShapeControllers();
    this.addStyleControllers();
    this.addAnimationControllers();
  }

  clearControllers() {
    // Clear shape controllers
    for (const key in this.controllers.shape) {
      this.shapeFolder.remove(this.controllers.shape[key]);
    }
    this.controllers.shape = {};

    // Clear style controllers
    for (const key in this.controllers.style) {
      this.styleFolder.remove(this.controllers.style[key]);
    }
    this.controllers.style = {};

    // Clear animation controllers
    for (const key in this.controllers.animation) {
      this.animationFolder.remove(this.controllers.animation[key]);
    }
    this.controllers.animation = {};

    // Remove the presets folder if it exists
    if (this.presetsFolder) {
      try {
        this.animationFolder.removeFolder(this.presetsFolder);
      } catch (e) {
        // In case there's an issue removing the folder
        console.warn("Could not remove presets folder:", e);
      }
      this.presetsFolder = null;
    }
  }

  addShapeControllers() {
    const obj = this.engine.selectedObject;

    // Common properties for all shapes
    this.controllers.shape.name = this.shapeFolder.add(obj, "name");

    this.controllers.shape.x = this.shapeFolder
      .add(obj, "x", 0, this.engine.canvasWidth)
      .step(1);
    this.controllers.shape.y = this.shapeFolder
      .add(obj, "y", 0, this.engine.canvasHeight)
      .step(1);
    this.controllers.shape.rotation = this.shapeFolder
      .add(obj, "rotation", 0, 360)
      .step(1);

    // Shape-specific properties
    if (obj instanceof Circle) {
      this.controllers.shape.width = this.shapeFolder
        .add(obj, "width", 1, 500)
        .step(1)
        .name("diameter");
    } else if (obj instanceof Rectangle) {
      this.controllers.shape.width = this.shapeFolder
        .add(obj, "width", 1, 500)
        .step(1);
      this.controllers.shape.height = this.shapeFolder
        .add(obj, "height", 1, 500)
        .step(1);
      this.controllers.shape.cornerRadius = this.shapeFolder
        .add(obj, "cornerRadius", 0, 100)
        .step(1);
    } else if (obj instanceof Text) {
      this.controllers.shape.text = this.shapeFolder.add(obj, "text");
      this.controllers.shape.fontSize = this.shapeFolder
        .add(obj, "fontSize", 8, 72)
        .step(1);
      this.controllers.shape.fontFamily = this.shapeFolder.add(
        obj,
        "fontFamily",
        [
          "Arial",
          "Verdana",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Georgia",
        ]
      );
      this.controllers.shape.textAlign = this.shapeFolder.add(
        obj,
        "textAlign",
        ["left", "center", "right"]
      );
      this.controllers.shape.textStyle = this.shapeFolder.add(
        obj,
        "textStyle",
        ["normal", "italic", "bold"]
      );
    } else if (obj instanceof Path) {
      this.controllers.shape.closed = this.shapeFolder.add(obj, "closed");

      // Add button to edit points
      const editPointsButton = {
        editPoints: () => {
          this.showPointEditor(obj);
        },
      };
      this.controllers.shape.editPoints = this.shapeFolder
        .add(editPointsButton, "editPoints")
        .name("Edit Points");
    }

    // Add keyframe buttons to all numeric properties
    this.addKeyframeButtonsToFolder(this.shapeFolder, this.controllers.shape);
  }

  addStyleControllers() {
    const obj = this.engine.selectedObject;

    // Add color controllers using dat.GUI's addColor method
    const fillColorObj = {
      fillColor: [red(obj.fill), green(obj.fill), blue(obj.fill)],
    };

    const strokeColorObj = {
      strokeColor: [red(obj.stroke), green(obj.stroke), blue(obj.stroke)],
    };

    this.controllers.style.fillColor = this.styleFolder
      .addColor(fillColorObj, "fillColor")
      .onChange((value) => {
        obj.fill = color(value[0], value[1], value[2], alpha(obj.fill));
      });

    this.controllers.style.strokeColor = this.styleFolder
      .addColor(strokeColorObj, "strokeColor")
      .onChange((value) => {
        obj.stroke = color(value[0], value[1], value[2], alpha(obj.stroke));
      });

    this.controllers.style.opacity = this.styleFolder
      .add(obj, "opacity", 0, 255)
      .step(1);
    this.controllers.style.strokeWeight = this.styleFolder
      .add(obj, "strokeWeight", 0, 20)
      .step(0.5);
    this.controllers.style.visible = this.styleFolder.add(obj, "visible");

    // Add additional style options
    if (obj instanceof Text) {
      this.controllers.style.letterSpacing = this.styleFolder
        .add(obj, "letterSpacing", -5, 20)
        .step(0.5);
      this.controllers.style.lineHeight = this.styleFolder
        .add(obj, "lineHeight", 0.5, 2)
        .step(0.1);
    }

    // Add fill and stroke options
    const fillOptions = { fillType: obj.fillType || "solid" };
    this.controllers.style.fillType = this.styleFolder
      .add(fillOptions, "fillType", ["solid", "gradient", "none"])
      .onChange((value) => {
        obj.fillType = value;
        // In full implementation, update fill based on type
      });

    // Add keyframe buttons to numeric properties
    this.addKeyframeButtonsToFolder(this.styleFolder, this.controllers.style);
  }

  addAnimationControllers() {
    const obj = this.engine.selectedObject;

    // Add current keyframes information
    const keyframesCount = this.getKeyframesCount(obj);

    const keyframesInfo = {
      message: `This object has ${keyframesCount} keyframes`,
    };
    this.controllers.animation.info = this.animationFolder
      .add(keyframesInfo, "message")
      .name("Keyframes")
      .listen();

    // Add buttons for common animation actions
    const animationActions = {
      addKeyframe: () => {
        const property = prompt("Enter property name to keyframe:", "x");
        if (property && obj.hasOwnProperty(property)) {
          this.keyframeManager.createKeyframeForCurrentSelection(
            this.engine,
            property
          );
        }
      },
      removeAllKeyframes: () => {
        if (confirm("Remove all keyframes for this object?")) {
          for (const prop in obj.keyframes) {
            delete obj.keyframes[prop];
          }
        }
      },
      editEasing: () => {
        const easingTypes = [
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

        const easingType = prompt(
          "Select easing type:\n" + easingTypes.join("\n"),
          "easeInOutCubic"
        );

        if (easingType && easingTypes.includes(easingType)) {
          const property = prompt("Enter property name to apply easing:", "x");
          if (property && obj.keyframes?.[property]) {
            const frame = parseInt(
              prompt(
                "Enter keyframe frame number:",
                this.engine.timeline.currentFrame
              )
            );

            // Find the keyframe
            const keyframeIndex = obj.keyframes[property].findIndex(
              (kf) => kf.frame === frame
            );
            if (keyframeIndex !== -1) {
              obj.keyframes[property][keyframeIndex].easing = easingType;
            }
          }
        }
      },
      previewAnimation: () => {
        // Restart animation at beginning and play
        this.engine.timeline.restart();
        this.engine.play();
      },
    };

    this.controllers.animation.addKeyframe = this.animationFolder
      .add(animationActions, "addKeyframe")
      .name("Add Keyframe");
    this.controllers.animation.removeKeyframes = this.animationFolder
      .add(animationActions, "removeAllKeyframes")
      .name("Remove All");
    this.controllers.animation.editEasing = this.animationFolder
      .add(animationActions, "editEasing")
      .name("Edit Easing");
    this.controllers.animation.previewAnimation = this.animationFolder
      .add(animationActions, "previewAnimation")
      .name("Preview");

    // Add animation presets if there are animatable properties
    this.addAnimationPresets();
  }

  addAnimationPresets() {
    const obj = this.engine.selectedObject;
    if (!obj) return;

    // Remove existing presets folder if it exists
    if (this.presetsFolder) {
      try {
        this.animationFolder.removeFolder(this.presetsFolder);
      } catch (e) {
        // In case there's an issue removing the folder
        console.warn("Could not remove presets folder:", e);
      }
    }

    // Create new presets folder
    this.presetsFolder = this.animationFolder.addFolder("Animation Presets");

    const presets = {
      fadeIn: () => {
        this.keyframeManager.createKeyframe(obj, "opacity", 0, 0);
        this.keyframeManager.createKeyframe(
          obj,
          "opacity",
          24,
          255,
          "easeOutCubic"
        );
      },
      fadeOut: () => {
        const startFrame = prompt(
          "Start frame for fade out:",
          this.engine.timeline.currentFrame
        );
        if (startFrame) {
          const frame = parseInt(startFrame);
          this.keyframeManager.createKeyframe(obj, "opacity", frame, 255);
          this.keyframeManager.createKeyframe(
            obj,
            "opacity",
            frame + 24,
            0,
            "easeInCubic"
          );
        }
      },
      bounceIn: () => {
        this.keyframeManager.createKeyframe(obj, "y", 0, obj.y + 100);
        this.keyframeManager.createKeyframe(
          obj,
          "y",
          10,
          obj.y - 20,
          "easeOutQuad"
        );
        this.keyframeManager.createKeyframe(
          obj,
          "y",
          14,
          obj.y + 10,
          "easeInQuad"
        );
        this.keyframeManager.createKeyframe(
          obj,
          "y",
          18,
          obj.y - 5,
          "easeOutQuad"
        );
        this.keyframeManager.createKeyframe(
          obj,
          "y",
          22,
          obj.y,
          "easeInOutQuad"
        );
      },
      pulse: () => {
        const baseScale = 1.0;
        const currentFrame = this.engine.timeline.currentFrame;

        if (obj instanceof Circle || obj instanceof Rectangle) {
          const baseWidth = obj.width;
          const baseHeight = obj instanceof Rectangle ? obj.height : obj.width;

          // Width pulsing
          this.keyframeManager.createKeyframe(
            obj,
            "width",
            currentFrame,
            baseWidth
          );
          this.keyframeManager.createKeyframe(
            obj,
            "width",
            currentFrame + 10,
            baseWidth * 1.2,
            "easeOutQuad"
          );
          this.keyframeManager.createKeyframe(
            obj,
            "width",
            currentFrame + 20,
            baseWidth,
            "easeInQuad"
          );

          // Height pulsing for rectangles
          if (obj instanceof Rectangle) {
            this.keyframeManager.createKeyframe(
              obj,
              "height",
              currentFrame,
              baseHeight
            );
            this.keyframeManager.createKeyframe(
              obj,
              "height",
              currentFrame + 10,
              baseHeight * 1.2,
              "easeOutQuad"
            );
            this.keyframeManager.createKeyframe(
              obj,
              "height",
              currentFrame + 20,
              baseHeight,
              "easeInQuad"
            );
          }
        }
      },
      spin: () => {
        const currentRotation = obj.rotation || 0;
        const currentFrame = this.engine.timeline.currentFrame;

        this.keyframeManager.createKeyframe(
          obj,
          "rotation",
          currentFrame,
          currentRotation
        );
        this.keyframeManager.createKeyframe(
          obj,
          "rotation",
          currentFrame + 30,
          currentRotation + 360,
          "easeInOutCubic"
        );
      },
      moveRight: () => {
        const currentX = obj.x;
        const currentFrame = this.engine.timeline.currentFrame;

        this.keyframeManager.createKeyframe(obj, "x", currentFrame, currentX);
        this.keyframeManager.createKeyframe(
          obj,
          "x",
          currentFrame + 30,
          currentX + 200,
          "easeInOutQuad"
        );
      },
    };

    for (const [name, action] of Object.entries(presets)) {
      this.presetsFolder.add({ [name]: action }, name);
    }
  }

  showPointEditor(pathObj) {
    // Create a floating point editor
    const editorContainer = document.createElement("div");
    editorContainer.className =
      "bg-gray-800 border border-gray-600 rounded-lg shadow-2xl w-96 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-2";

    // Add a title
    const title = document.createElement("h3");
    title.className = "m-0 p-0 pb-2 border-b border-gray-600 text-lg";
    title.textContent = "Edit Path Points";
    editorContainer.appendChild(title);

    // Create point list
    const pointsList = document.createElement("div");
    pointsList.className = "max-h-72 overflow-y-auto mb-2";

    // Add each point
    pathObj.points.forEach((point, index) => {
      const pointItem = document.createElement("div");
      pointItem.className =
        "flex items-center mb-1 p-1 border border-gray-700 rounded";

      const pointNumber = document.createElement("span");
      pointNumber.className = "w-16 mr-2";
      pointNumber.textContent = `Point ${index + 1}:`;

      const xInput = document.createElement("input");
      xInput.type = "number";
      xInput.value = point.x;
      xInput.className =
        "w-14 mr-1 p-1 bg-gray-700 text-gray-100 border border-gray-600 rounded";

      const yInput = document.createElement("input");
      yInput.type = "number";
      yInput.value = point.y;
      yInput.className =
        "w-14 p-1 bg-gray-700 text-gray-100 border border-gray-600 rounded";

      // Update point values when inputs change
      xInput.addEventListener("change", () => {
        pathObj.points[index].x = parseFloat(xInput.value);
      });

      yInput.addEventListener("change", () => {
        pathObj.points[index].y = parseFloat(yInput.value);
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className =
        "ml-auto bg-gray-600 text-gray-100 border-none rounded w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-500";
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", () => {
        if (pathObj.points.length > 3) {
          pathObj.points.splice(index, 1);
          pointItem.remove();
        } else {
          alert("Paths must have at least 3 points");
        }
      });

      // Assemble point item
      pointItem.appendChild(pointNumber);
      pointItem.appendChild(document.createTextNode("X:"));
      pointItem.appendChild(xInput);
      pointItem.appendChild(document.createTextNode("Y:"));
      pointItem.appendChild(yInput);
      pointItem.appendChild(deleteBtn);

      pointsList.appendChild(pointItem);
    });

    editorContainer.appendChild(pointsList);

    // Add controls
    const controls = document.createElement("div");
    controls.className = "flex justify-between mt-2";

    // Add new point button
    const addButton = document.createElement("button");
    addButton.className =
      "bg-gray-600 text-gray-100 border-none rounded px-2 py-1 cursor-pointer hover:bg-gray-500";
    addButton.textContent = "Add Point";
    addButton.addEventListener("click", () => {
      // Calculate a new point position based on average of existing points
      let newX = 0,
        newY = 0;
      pathObj.points.forEach((p) => {
        newX += p.x;
        newY += p.y;
      });
      newX /= pathObj.points.length;
      newY /= pathObj.points.length;

      // Add point with a slight offset
      pathObj.addPoint(newX + 10, newY + 10);

      // Refresh the editor
      document.body.removeChild(editorContainer);
      this.showPointEditor(pathObj);
    });

    // Close button
    const closeButton = document.createElement("button");
    closeButton.className =
      "bg-blue-600 text-gray-100 border-none rounded px-2 py-1 cursor-pointer hover:bg-blue-500";
    closeButton.textContent = "Done";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(editorContainer);
    });

    controls.appendChild(addButton);
    controls.appendChild(closeButton);
    editorContainer.appendChild(controls);

    // Add to document
    document.body.appendChild(editorContainer);

    // Make editor draggable
    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;

    title.style.cursor = "move";
    title.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = editorContainer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      editorContainer.style.left = `${x}px`;
      editorContainer.style.top = `${y}px`;
      editorContainer.style.transform = "none";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  addKeyframeButtonsToFolder(folder, controllers) {
    // For each controller, add a keyframe button next to it
    for (const propName in controllers) {
      const controller = controllers[propName];

      // Only add keyframe buttons to numeric properties
      if (typeof this.engine.selectedObject[propName] === "number") {
        const keyframeButton = document.createElement("button");
        keyframeButton.innerHTML = "◆";
        keyframeButton.title = "Add keyframe";
        keyframeButton.className = "keyframe-button";
        keyframeButton.style.marginLeft = "5px";
        keyframeButton.style.background = "none";
        keyframeButton.style.border = "none";
        keyframeButton.style.color = "#fbbf24";
        keyframeButton.style.cursor = "pointer";
        keyframeButton.style.fontSize = "12px";
        keyframeButton.style.opacity = "0.5";
        keyframeButton.style.transition = "opacity 0.2s, transform 0.2s";

        // Store the property name directly on the button
        keyframeButton.dataset.property = propName;

        // Update button appearance if there's a keyframe at current frame
        this.updateKeyframeButtonState(keyframeButton, propName);

        // Add click handler
        keyframeButton.addEventListener("click", () => {
          const obj = this.engine.selectedObject;
          const property = propName;
          const currentFrame = this.engine.timeline.currentFrame;

          if (this.keyframeManager.hasKeyframeAt(obj, property, currentFrame)) {
            // Remove keyframe if it exists
            this.keyframeManager.removeKeyframeForCurrentSelection(
              this.engine,
              property
            );
            keyframeButton.style.opacity = "0.5";
            keyframeButton.style.transform = "scale(1)";
          } else {
            // Add keyframe
            this.keyframeManager.createKeyframeForCurrentSelection(
              this.engine,
              property
            );
            keyframeButton.style.opacity = "1";
            keyframeButton.style.transform = "scale(1.2)";
            setTimeout(() => {
              keyframeButton.style.transform = "scale(1)";
            }, 200);
          }
        });

        // Add button next to the controller
        const controllerElement = controller.__li;
        controllerElement.style.position = "relative";
        controllerElement.appendChild(keyframeButton);
      }
    }
  }

  updateKeyframeButtonState(button, property) {
    const obj = this.engine.selectedObject;
    if (!obj) return;

    const currentFrame = this.engine.timeline.currentFrame;
    const hasKeyframe = this.keyframeManager.hasKeyframeAt(
      obj,
      property,
      currentFrame
    );

    button.style.opacity = hasKeyframe ? "1" : "0.5";
    button.style.transform = hasKeyframe ? "scale(1.2)" : "scale(1)";
  }

  updateControllers() {
    // Update all keyframe buttons
    if (this.engine.selectedObject) {
      const keyframeButtons = document.querySelectorAll(".keyframe-button");
      keyframeButtons.forEach((button) => {
        const property = button.dataset.property;
        if (property) {
          this.updateKeyframeButtonState(button, property);
        }
      });

      // Update keyframes count
      if (this.controllers.animation.info) {
        const keyframesCount = this.getKeyframesCount(
          this.engine.selectedObject
        );
        this.controllers.animation.info.object.message = `This object has ${keyframesCount} keyframes`;
      }
    }
  }

  getKeyframesCount(obj) {
    let count = 0;
    if (obj && obj.keyframes) {
      for (const prop in obj.keyframes) {
        count += obj.keyframes[prop].length;
      }
    }
    return count;
  }

  show() {
    this.shapeFolder.domElement.parentElement.style.display = "block";
    this.styleFolder.domElement.parentElement.style.display = "block";
    this.animationFolder.domElement.parentElement.style.display = "block";
  }

  hide() {
    this.shapeFolder.domElement.parentElement.style.display = "none";
    this.styleFolder.domElement.parentElement.style.display = "none";
    this.animationFolder.domElement.parentElement.style.display = "none";
  }
}

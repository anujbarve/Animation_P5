class DemoCodes {
  ring() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    const n0 = this.animation.createShape("circle", {
      x: 200,
      y: 400,
      size: 80,
      fill: colors.goldenRod, // Highlight node
      name: "node 0",
    });

    const n1 = this.animation.createShape("circle", {
      x: 400,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 1",
    });

    const n2 = this.animation.createShape("circle", {
      x: 600,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 2",
    });

    const n3 = this.animation.createShape("circle", {
      x: 800,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 3",
    });

    const n4 = this.animation.createShape("circle", {
      x: 800,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 4",
    });

    const n5 = this.animation.createShape("circle", {
      x: 600,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 5",
    });

    const n6 = this.animation.createShape("circle", {
      x: 400,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 6",
    });

    const n7 = this.animation.createShape("circle", {
      x: 200,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 7",
    });

    const fp1 = this.animation.createShape("flowpath", {
      startShape: n0,
      endShape: n1,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp2 = this.animation.createShape("flowpath", {
      startShape: n1,
      endShape: n2,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp3 = this.animation.createShape("flowpath", {
      startShape: n2,
      endShape: n3,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp4 = this.animation.createShape("flowpath", {
      startShape: n3,
      endShape: n4,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp5 = this.animation.createShape("flowpath", {
      startShape: n4,
      endShape: n5,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp6 = this.animation.createShape("flowpath", {
      startShape: n5,
      endShape: n6,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp7 = this.animation.createShape("flowpath", {
      startShape: n6,
      endShape: n7,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp8 = this.animation.createShape("flowpath", {
      startShape: n7,
      endShape: n0,
      startConnection: "bottom",
      endConnection: "top",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });
  }

  ringOptimized() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };
  
    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);
  
    // Node coordinates and optional custom colors
    const nodeGrid = [
      [200, 400, colors.goldenRod], // node 0 (highlighted)
      [400, 400],                   // node 1
      [600, 400],                   // node 2
      [800, 400],                   // node 3
      [800, 200],                   // node 4
      [600, 200],                   // node 5
      [400, 200],                   // node 6
      [200, 200],                   // node 7
    ];
  
    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });
  
    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8,
      particleSize: 6,
      fill: colors.steelBlue,
      animationSpeed: 2,
    };
  
    // Define flows [startIndex, endIndex, startConnection, endConnection]
    const flowPaths = [
      [0, 1, "right", "left"],
      [1, 2, "right", "left"],
      [2, 3, "right", "left"],
      [3, 4, "top", "bottom"],
      [4, 5, "left", "right"],
      [5, 6, "left", "right"],
      [6, 7, "left", "right"],
      [7, 0, "bottom", "top"],
    ];
  
    // Create flows using direct index reference
    flowPaths.forEach(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });
  
    this.animation.reset();
    this.animation.play(true);
  }
  

  mesh() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    const n03 = this.animation.createShape("circle", {
      x: 100,
      y: 100,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 3",
    });

    const n07 = this.animation.createShape("circle", {
      x: 300,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 7",
    });

    const n11 = this.animation.createShape("circle", {
      x: 500,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 11",
    });

    const n15 = this.animation.createShape("circle", {
      x: 700,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 15",
    });

    const n02 = this.animation.createShape("circle", {
      x: 100,
      y: 300,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 2",
    });

    const n06 = this.animation.createShape("circle", {
      x: 300,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 6",
    });

    const n10 = this.animation.createShape("circle", {
      x: 500,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 10",
    });

    const n14 = this.animation.createShape("circle", {
      x: 700,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 14",
    });

    const n01 = this.animation.createShape("circle", {
      x: 100,
      y: 500,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 1",
    });

    const n05 = this.animation.createShape("circle", {
      x: 300,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 5",
    });

    const n09 = this.animation.createShape("circle", {
      x: 500,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 9",
    });

    const n13 = this.animation.createShape("circle", {
      x: 700,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 13",
    });

    const n00 = this.animation.createShape("circle", {
      x: 100,
      y: 700,
      size: 80,
      fill: colors.goldenRod, // Highlight node
      name: "node 0",
    });

    const n04 = this.animation.createShape("circle", {
      x: 300,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 4",
    });

    const n08 = this.animation.createShape("circle", {
      x: 500,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 8",
    });

    const n12 = this.animation.createShape("circle", {
      x: 700,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 12",
    });

    const fp1 = this.animation.createShape("flowpath", {
      startShape: n00,
      endShape: n04,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp2 = this.animation.createShape("flowpath", {
      startShape: n04,
      endShape: n08,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp3 = this.animation.createShape("flowpath", {
      startShape: n08,
      endShape: n12,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp4 = this.animation.createShape("flowpath", {
      startShape: n00,
      endShape: n01,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp5 = this.animation.createShape("flowpath", {
      startShape: n01,
      endShape: n02,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp6 = this.animation.createShape("flowpath", {
      startShape: n02,
      endShape: n03,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp7 = this.animation.createShape("flowpath", {
      startShape: n04,
      endShape: n05,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp8 = this.animation.createShape("flowpath", {
      startShape: n05,
      endShape: n06,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp9 = this.animation.createShape("flowpath", {
      startShape: n06,
      endShape: n07,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp10 = this.animation.createShape("flowpath", {
      startShape: n08,
      endShape: n09,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp11 = this.animation.createShape("flowpath", {
      startShape: n09,
      endShape: n10,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp12 = this.animation.createShape("flowpath", {
      startShape: n10,
      endShape: n11,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp13 = this.animation.createShape("flowpath", {
      startShape: n12,
      endShape: n13,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp14 = this.animation.createShape("flowpath", {
      startShape: n13,
      endShape: n14,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp15 = this.animation.createShape("flowpath", {
      startShape: n14,
      endShape: n15,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp16 = this.animation.createShape("flowpath", {
      startShape: n03,
      endShape: n07,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp17 = this.animation.createShape("flowpath", {
      startShape: n07,
      endShape: n11,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp18 = this.animation.createShape("flowpath", {
      startShape: n11,
      endShape: n15,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp19 = this.animation.createShape("flowpath", {
      startShape: n02,
      endShape: n06,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp20 = this.animation.createShape("flowpath", {
      startShape: n06,
      endShape: n10,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp21 = this.animation.createShape("flowpath", {
      startShape: n10,
      endShape: n14,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp22 = this.animation.createShape("flowpath", {
      startShape: n01,
      endShape: n05,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp23 = this.animation.createShape("flowpath", {
      startShape: n05,
      endShape: n09,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp24 = this.animation.createShape("flowpath", {
      startShape: n09,
      endShape: n13,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });
  }

  meshOptimized() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };
    
    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);
    
    // Node coordinates and optional custom colors
    const nodeGrid = [
      [100, 700, colors.goldenRod], // 0
      [100, 500],                   // 1
      [100, 300],                   // 2
      [100, 100],                   // 3
      [300, 700],                   // 4
      [300, 500],                   // 5
      [300, 300],                   // 6
      [300, 100],                   // 7
      [500, 700],                   // 8
      [500, 500],                   // 9
      [500, 300],                   // 10
      [500, 100],                   // 11
      [700, 700],                   // 12
      [700, 500],                   // 13
      [700, 300],                   // 14
      [700, 100],                   // 15
    ];
    
    // Create all nodes and store them as an array of shapes
    const nodes = nodeGrid.map(([x, y, customFill], index) => {
      return this.animation.createShape("rectangle", {
        x,
        y,
        height : 100,
        width : 100,
        fill: customFill || colors.steelBlue,
        name: `node ${index}`,
      });
    });
    
    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8,
      particleSize: 6,
      fill: colors.steelBlue,
      animationSpeed: 2,
    };
    
    // Define flows **by index**, not name
    const flowPaths = [
      // [startIndex, endIndex, startConnection, endConnection]
      [0, 4, "right", "left"],
      [4, 8, "right", "left"],
      [8, 12, "right", "left"],
    
      [1, 5, "right", "left"],
      [5, 9, "right", "left"],
      [9, 13, "right", "left"],
    
      [2, 6, "right", "left"],
      [6, 10, "right", "left"],
      [10, 14, "right", "left"],
    
      [3, 7, "right", "left"],
      [7, 11, "right", "left"],
      [11, 15, "right", "left"],
    
      [0, 1, "top", "bottom"],
      [1, 2, "top", "bottom"],
      [2, 3, "top", "bottom"],
      [4, 5, "top", "bottom"],
      [5, 6, "top", "bottom"],
      [6, 7, "top", "bottom"],
      [8, 9, "top", "bottom"],
      [9, 10, "top", "bottom"],
      [10, 11, "top", "bottom"],
      [12, 13, "top", "bottom"],
      [13, 14, "top", "bottom"],
      [14, 15, "top", "bottom"],
    ];
    
    // Create flows using direct index reference
    const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[startIdx],
        endShape: nodes[endIdx],
        startConnection: startConn,
        endConnection: endConn,
      });
    });


    this.animation.reset();
    this.animation.play(true);
  }

  hypercubeOptimized() {
    const colors = {
        skyBlue: [135, 206, 235],
        coral: [255, 127, 80],
        limeGreen: [50, 205, 50],
        goldenRod: [218, 165, 32],
        orchid: [218, 112, 214],
        slateGray: [112, 128, 144],
        tomato: [255, 99, 71],
        steelBlue: [70, 130, 180],
        mediumPurple: [147, 112, 219],
        seaGreen: [46, 139, 87],
        deepPink: [255, 20, 147],
        turquoise: [64, 224, 208],
        fireBrick: [178, 34, 34],
        darkOrange: [255, 140, 0],
        lightSlateGray: [119, 136, 153],
      };
  
      this.animation.clearAll();
      this.animation.setDuration(10);
      this.animation.setFPS(60);
      this.engine.setCanvasSize(1900, 1000);
  
      // Node coordinates and names
      const nodeGrid = [
        // [x, y, name, highlightColor?]
        [100, 700, "node 0", colors.goldenRod], // Highlighted node
        [500, 700, "node 1"],
        [500, 300, "node 2"],
        [100, 300, "node 3"],
        [300, 500, "node 4"],
        [700, 500, "node 5"],
        [700, 100, "node 6"],
        [300, 100, "node 7"],
      ];
  
      // Create all nodes and keep reference by name
      
      const nodes = nodeGrid.map(([x, y, name, customFill]) => {
        return this.animation.createShape("circle", {
          x,
          y,
          size: 80,
          fill: customFill || colors.steelBlue,
          name,
        });
      });
  
      const flowDefaults = {
        pathStyle: "bezier",
        curveIntensity: 0,
        arrowEnd: false,
        arrowSize: 8,
        stroke: colors.steelBlue,
        strokeWeight: 2,
        flowParticles: 8,
        particleSize: 6,
        fill: colors.steelBlue,
        animationSpeed: 2,
      };
  
      const flowPaths = [
        // [startNode, endNode, startConnection, endConnection]
  
  
        [0, 4, "center", "center"],
        [2, 6, "center", "center"],
        [1, 5, "center", "center"],
        [3, 7, "center", "center"],
  
        [0, 1, "center", "center"],
        [1, 2, "center", "center"],
        [2, 3, "center", "center"],
        [3, 0, "center", "center"],
  
  
        [4, 5, "center", "center"],
        [5, 6, "center", "center"],
        [6, 7, "center", "center"],
        [7, 4, "center", "center"],
      ];
  
      const flows = flowPaths.map(([startIdx, endIdx, startConn, endConn]) => {
        this.animation.createShape("flowpath", {
          ...flowDefaults,
          startShape: nodes[startIdx],
          endShape: nodes[endIdx],
          startConnection: startConn,
          endConnection: endConn,
        });
      });
  }

  matrixVectorOptimized() {
    const colors = {
        skyBlue: [135, 206, 235],
        coral: [255, 127, 80],
        limeGreen: [50, 205, 50],
        goldenRod: [218, 165, 32],
        orchid: [218, 112, 214],
        slateGray: [112, 128, 144],
        tomato: [255, 99, 71],
        steelBlue: [70, 130, 180],
        mediumPurple: [147, 112, 219],
        seaGreen: [46, 139, 87],
        deepPink: [255, 20, 147],
        turquoise: [64, 224, 208],
        fireBrick: [178, 34, 34],
        darkOrange: [255, 140, 0],
        lightSlateGray: [119, 136, 153],
      };
  
      this.animation.clearAll();
      this.animation.setDuration(10);
      this.animation.setFPS(60);
      this.engine.setCanvasSize(1900, 1000);
  
      // Node coordinates and names
      const nodeGrid = [
        // [x, y, name, highlightColor?]
        [400, 400, "node 0", colors.goldenRod], // Highlighted node
        [400, 500, "node 1"],
        [400, 600, "node 2"],
        [400, 700, "node 3"],
        [500, 400, "node 4"],
        [500, 500, "node 5"],
        [500, 600, "node 6"],
        [500, 700, "node 7"],
        [600, 400, "node 8"],
        [600, 500, "node 9"],
        [600, 600, "node 10"],
        [600, 700, "node 11"],
        [700, 400, "node 12"],
        [700, 500, "node 13"],
        [700, 600, "node 14"],
        [700, 700, "node 15"],
  
        [200,400,"ov 1", colors.fireBrick],
        [200,500,"ov 2", colors.fireBrick],
        [200,600,"ov 3", colors.fireBrick],
        [200,700,"ov 4", colors.fireBrick],
  
        [400,200,"iv 1", colors.fireBrick],
        [500,200,"iv 2", colors.fireBrick],
        [600,200,"iv 3", colors.fireBrick],
        [700,200,"iv 4", colors.fireBrick],
      ];
  
      // Create all nodes and keep reference by name
      const nodes = nodeGrid.map(([x, y, name, customFill]) =>
        this.animation.createShape("rectangle", {
          x,
          y,
          height : 100,
          width : 100,
          fill: customFill || colors.steelBlue,
          name,
        })
      );
  
      const flowDefaults = {
        pathStyle: "bezier",
        curveIntensity: 0,
        arrowEnd: false,
        arrowSize: 8,
        stroke: colors.goldenRod,
        strokeWeight: 2,
        flowParticles: 8,
        particleSize: 6,
        fill: colors.fireBrick,
        animationSpeed: 2,
      };
  
  
      flowPaths.forEach(([start, end, startConn, endConn]) => {
        this.animation.createShape("flowpath", {
          ...flowDefaults,
          startShape: nodes[start],
          endShape: nodes[end],
          startConnection: startConn,
          endConnection: endConn,
        });
      });
  
      console.log(nodes)
  }
}

(function () {
  "use strict";

  var canvas = document.getElementById("atmosphere");
  if (!canvas || !canvas.getContext) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;

  var context = canvas.getContext("2d", { alpha: true });
  var particles = [];
  var width = 0;
  var height = 0;
  var ratio = 1;
  var frame = 0;
  var running = !document.hidden;
  var lastTime = 0;
  var randomState = 0x50a1f01;
  var palette = {
    default: [102, 199, 242],
    contested: [255, 127, 115],
    inferred: [169, 153, 255],
    established: [85, 230, 177]
  };

  function particleCount() {
    if (width < 700) return 18;
    if (width < 1100) return 30;
    return 46;
  }

  function seededRandom() {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  }

  function makeParticle(index) {
    var lane = index % 7;
    return {
      x: seededRandom() * width,
      y: seededRandom() * height,
      radius: .45 + seededRandom() * 1.45,
      speed: .018 + seededRandom() * .055,
      drift: (seededRandom() - .5) * .018,
      alpha: .07 + seededRandom() * .22,
      phase: seededRandom() * Math.PI * 2,
      lane: lane
    };
  }

  function resize() {
    width = Math.max(1, document.documentElement.clientWidth);
    height = Math.max(1, window.innerHeight);
    ratio = Math.min(window.devicePixelRatio || 1, width < 700 ? 1 : 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    randomState = (0x50a1f01 ^ Math.imul(width, 2654435761) ^ height) >>> 0;
    particles = Array.from({ length: particleCount() }, function (_, index) { return makeParticle(index); });
  }

  function sceneColor() {
    var state = document.body.dataset.evidence || "default";
    return palette[state.toLowerCase()] || palette.default;
  }

  function draw(time) {
    if (!running) return;
    var delta = Math.min(40, time - lastTime || 16);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    var color = sceneColor();
    var scene = document.body.dataset.scene || "cold-open";
    var horizontal = scene === "measurement-problem" || scene === "investable-stack" || scene === "thesis-diff";

    particles.forEach(function (particle, index) {
      particle.phase += .00055 * delta;
      if (horizontal) {
        particle.x += particle.speed * delta;
        particle.y += Math.sin(particle.phase + index) * .018 * delta;
      } else {
        particle.y -= particle.speed * delta;
        particle.x += (particle.drift + Math.sin(particle.phase) * .012) * delta;
      }

      if (particle.y < -8) { particle.y = height + 8; particle.x = seededRandom() * width; }
      if (particle.y > height + 8) { particle.y = -8; }
      if (particle.x > width + 8) { particle.x = -8; particle.y = seededRandom() * height; }
      if (particle.x < -8) { particle.x = width + 8; }

      context.beginPath();
      context.fillStyle = "rgba(" + color.join(",") + "," + particle.alpha + ")";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      if (index % 9 === 0) {
        context.beginPath();
        context.strokeStyle = "rgba(" + color.join(",") + ",.035)";
        context.moveTo(particle.x, particle.y);
        context.lineTo(particle.x + (horizontal ? -46 : 12), particle.y + (horizontal ? 5 : 54));
        context.stroke();
      }
    });
    frame = window.requestAnimationFrame(draw);
  }

  function setRunning(next) {
    if (next === running) return;
    running = next;
    if (running) {
      lastTime = 0;
      frame = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(frame);
    }
  }

  document.addEventListener("visibilitychange", function () { setRunning(!document.hidden); });
  reduced.addEventListener("change", function (event) {
    if (event.matches) {
      setRunning(false);
      context.clearRect(0, 0, width, height);
      canvas.hidden = true;
    } else {
      canvas.hidden = false;
      setRunning(!document.hidden);
    }
  });

  var resizeFrame = 0;
  window.addEventListener("resize", function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(resize);
  }, { passive: true });

  resize();
  frame = window.requestAnimationFrame(draw);
}());

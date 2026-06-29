const canvas = document.querySelector("#robotCanvas");
const ctx = canvas?.getContext("2d");
const statusEl = document.querySelector("#demoStatus");
const toggleButton = document.querySelector("#demoToggle");

if (canvas && ctx && statusEl && toggleButton) {
  const nodes = [
    { x: 0.11, y: 0.65, label: "图像输入", color: "#2d6f9f" },
    { x: 0.32, y: 0.34, label: "YOLO-PK", color: "#0f8b8d" },
    { x: 0.55, y: 0.58, label: "DQN-MPC", color: "#5c5aa7" },
    { x: 0.78, y: 0.28, label: "瞬变速驱动", color: "#c88d2c" },
    { x: 0.9, y: 0.68, label: "结构监测", color: "#c94f45" },
  ];

  let running = false;
  let progress = 0;
  let lastFrame = 0;

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, Math.floor(rect.width * ratio));
    canvas.height = Math.max(180, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };

  const scale = (point) => ({
    x: point.x * canvas.clientWidth,
    y: point.y * canvas.clientHeight,
  });

  const drawGrid = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.strokeStyle = "#e2ebe7";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawPath = (points, active) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = active ? 5 : 4;
    ctx.strokeStyle = active ? "#0f8b8d" : "#c7d5cf";
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  };

  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fbfa";
    ctx.fillRect(0, 0, width, height);
    drawGrid();

    const points = nodes.map(scale);
    drawPath(points, false);

    const segmentCount = points.length - 1;
    const raw = Math.min(progress, 0.999) * segmentCount;
    const index = Math.floor(raw);
    const local = raw - index;
    const activePoints = points.slice(0, index + 1);
    if (index < points.length - 1) {
      const a = points[index];
      const b = points[index + 1];
      activePoints.push({
        x: a.x + (b.x - a.x) * local,
        y: a.y + (b.y - a.y) * local,
      });
    }
    drawPath(activePoints, true);

    nodes.forEach((node, index) => {
      const point = points[index];
      const isActive = progress * segmentCount >= index - 0.1;
      ctx.fillStyle = isActive ? node.color : "#ffffff";
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, isActive ? 18 : 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isActive ? "#ffffff" : node.color;
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), point.x, point.y);

      ctx.fillStyle = "#1f2927";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.fillText(node.label, point.x, point.y + 34);
    });

    const robotIndex = Math.min(index, points.length - 2);
    const a = points[robotIndex];
    const b = points[robotIndex + 1];
    const x = a.x + (b.x - a.x) * local;
    const y = a.y + (b.y - a.y) * local;
    const angle = Math.atan2(b.y - a.y, b.x - a.x);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#1f2927";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -11);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#9ff4eb";
    ctx.beginPath();
    ctx.arc(2, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const tick = (timestamp) => {
    if (!lastFrame) lastFrame = timestamp;
    const delta = timestamp - lastFrame;
    lastFrame = timestamp;

    if (running) {
      progress += delta / 7800;
      if (progress >= 1) {
        progress = 1;
        running = false;
        statusEl.textContent = "完成监测";
        toggleButton.textContent = "重新演示";
      } else if (progress > 0.76) {
        statusEl.textContent = "工程监测";
      } else if (progress > 0.52) {
        statusEl.textContent = "驱动响应";
      } else if (progress > 0.28) {
        statusEl.textContent = "决策控制";
      } else {
        statusEl.textContent = "视觉识别";
      }
    }

    draw();
    requestAnimationFrame(tick);
  };

  toggleButton.addEventListener("click", () => {
    if (progress >= 1) progress = 0;
    running = !running;
    toggleButton.textContent = running ? "暂停演示" : "继续演示";
    statusEl.textContent = running ? "视觉识别" : "已暂停";
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(tick);
}

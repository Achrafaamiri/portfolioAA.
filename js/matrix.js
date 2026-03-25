(function () {
  window.addEventListener('load', function () {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const FONT_SIZE = 14;
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]';

    let cols, drops, animId;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      cols  = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));
    }

    function draw() {
      ctx.fillStyle = 'rgba(6, 10, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = FONT_SIZE + 'px monospace';

      for (let i = 0; i < cols; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = '#c8ffd8';
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);

        ctx.fillStyle = '#4adc80';
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FONT_SIZE);

        ctx.fillStyle = '#1c5c44';
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FONT_SIZE * 2);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20);
        }
        drops[i]++;
      }
    }

    window.addEventListener('resize', resize);
    resize();
    setInterval(draw, 50);
  });
})();

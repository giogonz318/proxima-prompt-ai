import { useEffect, useRef } from 'react';

export default function CosmosBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
    }));

    // Comets
    const comets = Array.from({ length: 3 }, () => createComet(canvas));

    function createComet(canvas) {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: Math.random() * 4 + 3,
        vy: Math.random() * 2 + 1,
        len: Math.random() * 120 + 60,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 120 + 80,
        delay: Math.random() * 300,
      };
    }

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula glow blobs
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.35
      );
      gradient1.addColorStop(0, 'rgba(120, 60, 200, 0.06)');
      gradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.6, 0,
        canvas.width * 0.75, canvas.height * 0.6, canvas.width * 0.3
      );
      gradient2.addColorStop(0, 'rgba(40, 100, 220, 0.05)');
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((s) => {
        s.alpha += s.speed * (Math.random() > 0.5 ? 1 : -1);
        s.alpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${s.alpha})`;
        ctx.fill();
      });

      // Draw comets
      comets.forEach((c, i) => {
        if (frame < c.delay) return;
        c.life++;
        if (c.life > c.maxLife) {
          comets[i] = { ...createComet(canvas), delay: 0 };
          comets[i].x = -50;
          comets[i].y = Math.random() * canvas.height * 0.6;
          return;
        }
        c.x += c.vx;
        c.y += c.vy;

        const progress = c.life / c.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

        const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.len, c.y - c.len * 0.5);
        grad.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.9})`);
        grad.addColorStop(0.3, `rgba(160, 140, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.len, c.y - c.len * 0.5);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Comet head glow
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
        ctx.fill();
      });

      frame++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
import { useEffect, useRef } from 'react';

export default function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.05 + 0.01,
      gold: Math.random() > 0.9,
    }));

    let shooters = [];
    const addShooter = () => shooters.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 150 + 50,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      speed: Math.random() * 8 + 5,
      life: 1,
    });
    const shooterInterval = setInterval(addShooter, 3000);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed;
        const op = 0.4 + Math.sin(s.twinkle) * 0.6;
        const sz = s.r * (0.7 + Math.sin(s.twinkle) * 0.3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(212,175,55,${op * 0.8})` : `rgba(255,255,255,${op * 0.6})`;
        ctx.fill();
        s.y -= s.speed * 0.05;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      });

      shooters = shooters.filter((s, i) => {
        const ex = s.x + Math.cos(s.angle) * s.len * s.life;
        const ey = s.y + Math.sin(s.angle) * s.len * s.life;
        const g = ctx.createLinearGradient(s.x, s.y, ex, ey);
        g.addColorStop(0, 'rgba(212,175,55,0)');
        g.addColorStop(1, `rgba(212,175,55,${s.life * 0.8})`);
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.015;
        return s.life > 0 && s.x < canvas.width && s.y < canvas.height;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shooterInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="starCanvas" ref={ref} />;
}

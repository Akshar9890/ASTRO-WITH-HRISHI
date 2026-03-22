import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot   = useRef(null);
  const trail = useRef(null);
  const pos   = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let animId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      // Dot follows instantly
      if (dot.current) {
        dot.current.style.left = pos.current.x - 5 + 'px';
        dot.current.style.top  = pos.current.y - 5 + 'px';
      }
      // Trail lerps smoothly
      trailPos.current.x = lerp(trailPos.current.x, pos.current.x, 0.15);
      trailPos.current.y = lerp(trailPos.current.y, pos.current.y, 0.15);
      if (trail.current) {
        trail.current.style.left = trailPos.current.x - 16 + 'px';
        trail.current.style.top  = trailPos.current.y - 16 + 'px';
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    // Scale up on hover over interactive elements
    const onEnter = () => {
      dot.current?.style.setProperty('transform', 'scale(2.5)');
      trail.current?.style.setProperty('transform', 'scale(1.5)');
      trail.current?.style.setProperty('opacity', '0.8');
    };
    const onLeave = () => {
      dot.current?.style.setProperty('transform', 'scale(1)');
      trail.current?.style.setProperty('transform', 'scale(1)');
      trail.current?.style.setProperty('opacity', '0.5');
    };
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={dot} style={{ transition: 'transform 0.2s ease' }} />
      <div className="cursor-trail" ref={trail} style={{ transition: 'transform 0.2s ease, opacity 0.2s ease' }} />
    </>
  );
}

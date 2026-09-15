import React, { useEffect, useRef } from 'react';

export const AuthBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Approved palette particles: #06B6D4 (cyan), #38BDF8 (sky), #8B5CF6 (violet), #2563EB (blue)
    const BRAND_COLORS = [
      { r: 6, g: 182, b: 212 },   // #06B6D4
      { r: 56, g: 189, b: 248 },  // #38BDF8
      { r: 139, g: 92, b: 246 },  // #8B5CF6
      { r: 37, g: 99, b: 235 },   // #2563EB
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      color: { r: number; g: number; b: number };
    }

    const particles: Particle[] = Array.from({ length: 30 }, () => {
      const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
      const baseAlpha = Math.random() * 0.24 + 0.1;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.6,
        baseAlpha,
        alpha: baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color,
      };
    });

    let tick = 0;
    const LINK_DISTANCE = 115;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, w, h);

      // Render drifting particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        // Subtle alpha breathing
        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed) * 0.08;
        const currentAlpha = Math.max(0.04, Math.min(0.35, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${currentAlpha})`;
        ctx.fill();
      }

      // Restrained connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    // Subtle Parallax for Background Orbs & Grid
    let pRaf: number;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateBgParallax = () => {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${curX * 2}px, ${curY * 2}px, 0)`;
      }
      if (glow1Ref.current) {
        glow1Ref.current.style.transform = `translate3d(${curX * 1.5}px, ${curY * 1.5}px, 0)`;
      }
      if (glow2Ref.current) {
        glow2Ref.current.style.transform = `translate3d(${curX * -1.8}px, ${curY * -1.8}px, 0)`;
      }
      if (glow3Ref.current) {
        glow3Ref.current.style.transform = `translate3d(${curX * 1.2}px, ${curY * -1.2}px, 0)`;
      }

      pRaf = requestAnimationFrame(updateBgParallax);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    pRaf = requestAnimationFrame(updateBgParallax);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pRaf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="skillsync-background" aria-hidden="true">
      {/* 3 Large Living Atmospheric Radial Glows with Slow Movements */}
      <div ref={glow1Ref} className="skillsync-bg-orb skillsync-bg-orb-cyan" />
      <div ref={glow2Ref} className="skillsync-bg-orb skillsync-bg-orb-blue" />
      <div ref={glow3Ref} className="skillsync-bg-orb skillsync-bg-orb-purple" />

      {/* Subtle Digital Technical Grid + Light Sweep */}
      <div ref={gridRef} className="skillsync-bg-grid">
        <div className="skillsync-grid-sweep" />
      </div>

      {/* Restrained 30-Particle Field */}
      <canvas ref={canvasRef} className="skillsync-bg-canvas" />
    </div>
  );
};
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function ArenaAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect for the atmosphere
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [0.4, 0.2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let startTimerId: number;
    let pointerFrameId = 0;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(242, 125, 38, ${this.opacity})`; // Brand color particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < Math.min(particleCount, 100); i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    init();
    // Let the route render first; the particles are atmosphere, not critical content.
    startTimerId = window.setTimeout(animate, 500);

    const handleMouseMove = (e: MouseEvent) => {
      if (pointerFrameId) return;
      pointerFrameId = window.requestAnimationFrame(() => {
        pointerFrameId = 0;
        if (!spotlightRef.current) return;
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 400}px, ${e.clientY - 400}px, 0)`;
      });
    };
    window.addEventListener("pointermove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMouseMove);
      window.clearTimeout(startTimerId);
      if (pointerFrameId) window.cancelAnimationFrame(pointerFrameId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
    >
      {/* Canvas Particles */}
      <motion.canvas
        ref={canvasRef}
        style={{ y: y1, opacity }}
        className="absolute inset-0 w-full h-full"
      />

      {/* Dynamic Spotlight Glow */}
      <div 
        ref={spotlightRef}
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(242, 125, 38, 0.4) 0%, transparent 70%)",
          transform: "translate3d(calc(50vw - 400px), calc(20vh - 400px), 0)",
          willChange: "transform",
        }}
      />

      {/* Static Arena Lights (Corners) */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-brand/5 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand/5 blur-[120px] translate-x-1/2 -translate-y-1/2" />

      {/* Smoke/Fog Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-60" />
      
      {/* Grain/Static Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #fff 0 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 0 1px, transparent 1px)",
          backgroundSize: "28px 28px, 36px 36px",
        }}
      />
    </div>
  );
}

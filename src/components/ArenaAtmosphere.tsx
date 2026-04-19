import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function ArenaAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax effect for the atmosphere
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [0.4, 0.2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
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
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
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
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        animate={{
          left: mousePos.x - 400,
          top: mousePos.y - 400,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50 }}
        style={{
          background: "radial-gradient(circle, rgba(242, 125, 38, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Static Arena Lights (Corners) */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-brand/5 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand/5 blur-[120px] translate-x-1/2 -translate-y-1/2" />

      {/* Smoke/Fog Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-60" />
      
      {/* Grain/Static Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
}

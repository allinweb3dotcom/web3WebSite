import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const circles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createCircle = () => {
      const colors = ['#FF8F71', '#FF6B6B', '#FF3D3D', '#FFB371'];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.15 + 0.05
      };
    };

    const initCircles = () => {
      circles.length = 0; // Clear existing circles
      for (let i = 0; i < 20; i++) {
        circles.push(createCircle());
      }
    };

    const drawCircle = (circle: typeof circles[0]) => {
      const gradient = ctx.createRadialGradient(
        circle.x,
        circle.y,
        0,
        circle.x,
        circle.y,
        circle.radius
      );
      
      gradient.addColorStop(0, `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'rgba(15, 15, 15, 0)');
      
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    };

    const updateCircle = (circle: typeof circles[0]) => {
      circle.angle += circle.speed * 0.02;
      circle.x = circle.x + Math.cos(circle.angle) * 1;
      circle.y = circle.y + Math.sin(circle.angle) * 1;

      if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
      if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
      if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
      if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach(circle => {
        updateCircle(circle);
        drawCircle(circle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initCircles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initCircles(); // Reinitialize circles on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full opacity-30"
    />
  );
};

export default AnimatedBackground;
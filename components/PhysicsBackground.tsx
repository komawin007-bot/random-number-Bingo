
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { getBallColor } from '../types';

interface PhysicsBackgroundProps {
  totalBalls: number;
  triggerPulse: number;
  drawnNumbers: number[]; 
}

const PhysicsBackground: React.FC<PhysicsBackgroundProps> = ({ totalBalls, triggerPulse, drawnNumbers }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const ballsRef = useRef<Matter.Body[]>([]);

  const MIN_SPEED = 1.2; 
  const visualRadius = 35;
  const physicsRadius = 18;

  // ส่วนที่แก้ไข: แรงดีดเมื่อกดปุ่ม Press
  useEffect(() => {
    if (ballsRef.current.length > 0) {
      ballsRef.current.forEach(ball => {
        // เพิ่มแรงขึ้นอย่างมากเพื่อให้กระโดดได้สูงถึงประมาณ 60% ของพื้นที่
        const forceMagnitude = (0.035 + Math.random() * 0.015) * ball.mass;
        // ปรับมุมให้เน้นพุ่งขึ้นด้านบน (-Math.PI / 2) โดยสุ่มเฉียงซ้ายขวาเล็กน้อย
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; 
        
        Matter.Body.applyForce(ball, ball.position, { 
          x: Math.cos(angle) * forceMagnitude, 
          y: Math.sin(angle) * forceMagnitude 
        });
      });
    }
  }, [triggerPulse]);

  useEffect(() => {
    if (!engineRef.current || ballsRef.current.length === 0) return;
    const world = engineRef.current.world;
    const ballsToRemove = ballsRef.current.filter(ball => 
      drawnNumbers.includes((ball as any).gameNumber)
    );
    if (ballsToRemove.length > 0) {
      Matter.Composite.remove(world, ballsToRemove);
      ballsRef.current = ballsRef.current.filter(ball => 
        !drawnNumbers.includes((ball as any).gameNumber)
      );
    }
  }, [drawnNumbers]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Events, Vector } = Matter;
    
    const engine = Engine.create({
      enableSleeping: false
    });
    engine.gravity.y = 1.6; 
    engineRef.current = engine;

    const getContainerDimensions = () => {
      const el = sceneRef.current!;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const lineY = h * 0.618;
      
      return {
        width: w,
        height: h,
        floorLevel: lineY - (visualRadius - physicsRadius)
      };
    };

    const dim = getContainerDimensions();

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: dim.width,
        height: dim.height,
        background: 'transparent', 
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    renderRef.current = render;

    const wallThick = 2000; 
    
    const groundOptions = { 
      isStatic: true, 
      restitution: 1.2, 
      friction: 0,      
      render: { visible: false } 
    };

    const wallOptions = { 
      isStatic: true, 
      restitution: 0.8, 
      friction: 0.05, 
      render: { visible: false } 
    };

    const topWall = Bodies.rectangle(dim.width / 2, -wallThick/2 - 500, dim.width * 20, wallThick, wallOptions);
    const ground = Bodies.rectangle(dim.width / 2, dim.floorLevel + wallThick/2, dim.width * 20, wallThick, groundOptions);
    const leftWall = Bodies.rectangle(-wallThick/2, dim.height / 2, wallThick, dim.height * 100, wallOptions);
    const rightWall = Bodies.rectangle(dim.width + wallThick/2, dim.height / 2, wallThick, dim.height * 100, wallOptions);
    
    Composite.add(engine.world, [topWall, ground, leftWall, rightWall]);

    const balls: Matter.Body[] = [];
    const highBouncerIds = new Set<number>();

    const updateHighBouncers = (currentBalls: Matter.Body[]) => {
      highBouncerIds.clear();
      if (currentBalls.length === 0) return;
      const count = Math.max(1, Math.floor(currentBalls.length * 0.05));
      const shuffled = [...currentBalls].sort(() => 0.5 - Math.random());
      shuffled.slice(0, count).forEach(b => highBouncerIds.add(b.id));
    };

    const availableNumbers = Array.from({ length: totalBalls }, (_, i) => i + 1)
      .filter(n => !drawnNumbers.includes(n));

    availableNumbers.forEach((num, index) => {
      const color = getBallColor(num);
      // กระจายตำแหน่งเกิดให้กว้างขึ้นและไม่สูงเกินไปจนติดขอบบน
      const startX = (dim.width * 0.05) + (Math.random() * (dim.width * 0.9));
      const startY = -50 - (Math.floor(index / 10) * 40) - (Math.random() * 20);

      const ball = Bodies.circle(startX, startY, physicsRadius, {
        restitution: 0.9, 
        friction: 0.0001,      
        frictionAir: 0.005,   
        slop: 0, 
        collisionFilter: { group: -1 },
        render: { fillStyle: color.hex }
      });

      (ball as any).gameNumber = num;
      (ball as any).depth = Math.random(); 
      balls.push(ball);
    });

    ballsRef.current = balls;
    updateHighBouncers(balls);
    Composite.add(engine.world, balls);

    // สลับลูกที่เด้งสูงทุกๆ 3 วินาที
    const swapInterval = setInterval(() => {
      updateHighBouncers(ballsRef.current);
    }, 3000);

    Events.on(engine, 'beforeUpdate', () => {
      const currentDim = getContainerDimensions();
      ballsRef.current.forEach(ball => {
        const speed = Vector.magnitude(ball.velocity);
        const isOnFloor = ball.position.y > currentDim.floorLevel - (physicsRadius + 4); // Dynamic buffer based on physicsRadius
        const isHighBouncer = highBouncerIds.has(ball.id);

        if (isHighBouncer) {
          // ลูกที่เด้งสูง: ดีดขึ้นแรงๆ เฉพาะเมื่ออยู่บนพื้นและกำลังตกหรือหยุดนิ่ง (ป้องกันการเด้งกลางอากาศ)
          if (isOnFloor && ball.velocity.y >= -0.5) {
            const forceX = (Math.random() - 0.5) * 0.02 * ball.mass;
            const forceY = (-0.05 - Math.random() * 0.04) * ball.mass;
            Matter.Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
          }
        } else {
          // ลูกที่เด้งเบาๆ: เด้งถี่ๆ 15% และขยับซ้ายขวา เฉพาะเมื่ออยู่บนพื้น (ป้องกันการเด้งกลางอากาศ)
          if (isOnFloor && ball.velocity.y >= -0.5) {
            // เพิ่มแรงแนวนอนให้ขยับไปมาซ้ายขวา
            const rollX = (Math.random() - 0.5) * 0.025 * ball.mass;
            // แรงเด้งถี่ๆ ที่แรงขึ้นแต่ยังคุมความสูง (ประมาณ 15% ของลูกเด้งสูง)
            const bounceY = (-0.015 - Math.random() * 0.005) * ball.mass;
            Matter.Body.applyForce(ball, ball.position, { x: rollX, y: bounceY });
          }
        }

        if (speed > 25) {
          const ratio = 25 / speed;
          Matter.Body.setVelocity(ball, {
            x: ball.velocity.x * ratio,
            y: ball.velocity.y * ratio
          });
        }
      });
    });

    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const currentDim = getContainerDimensions();
      
      const sortedBalls = [...ballsRef.current].sort((a, b) => (a as any).depth - (b as any).depth);

      sortedBalls.forEach(ball => {
        const { x, y } = ball.position;
        if (y < -visualRadius || y > currentDim.floorLevel + visualRadius) return;

        const num = (ball as any).gameNumber;
        const colorInfo = getBallColor(num);
        const drawRadius = visualRadius * 0.96; 
        
        ctx.save();
        ctx.translate(x, y);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;

        ctx.beginPath();
        ctx.arc(0, 0, drawRadius, 0, 2 * Math.PI);
        ctx.fillStyle = colorInfo.hex;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.rotate(ball.angle);
        const innerRadius = drawRadius * 0.62;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff'; 
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        ctx.fillStyle = '#000000';
        ctx.font = '900 22px Roboto, Arial'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), 0, 1);
        
        ctx.beginPath();
        ctx.moveTo(-11, 13);
        ctx.lineTo(11, 13);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3; 
        ctx.stroke();

        ctx.rotate(-ball.angle); 
        
        const depthGrad = ctx.createRadialGradient(-drawRadius * 0.3, -drawRadius * 0.3, 0, 0, 0, drawRadius);
        depthGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
        depthGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
        depthGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = depthGrad;
        ctx.beginPath();
        ctx.arc(0, 0, drawRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Specular Highlight
        ctx.beginPath();
        ctx.ellipse(0, -drawRadius * 0.55, drawRadius * 0.45, drawRadius * 0.18, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        ctx.restore();
      });
    });

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const handleResize = () => {
      const currentDim = getContainerDimensions();
      const ratio = window.devicePixelRatio || 1;
      
      render.options.width = currentDim.width;
      render.options.height = currentDim.height;
      render.canvas.width = currentDim.width * ratio;
      render.canvas.height = currentDim.height * ratio;
      render.canvas.style.width = currentDim.width + 'px';
      render.canvas.style.height = currentDim.height + 'px';
      
      Matter.Body.setPosition(ground, { x: currentDim.width / 2, y: currentDim.floorLevel + wallThick/2 });
      Matter.Body.setPosition(topWall, { x: currentDim.width / 2, y: -wallThick/2 });
      Matter.Body.setPosition(rightWall, { x: currentDim.width + wallThick/2, y: currentDim.height / 2 });
      Matter.Body.setPosition(leftWall, { x: -wallThick/2, y: currentDim.height / 2 });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(swapInterval);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      engineRef.current = null;
    };
  }, [totalBalls]);

  return (
    <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <div className="absolute w-full z-10" style={{ top: '61.8%' }}>
        <div className="w-full h-[1.5px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
      </div>
    </div>
  );
};

export default PhysicsBackground;

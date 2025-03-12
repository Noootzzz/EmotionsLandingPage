import { useState, useEffect, useRef } from "react";
import "../css/frustration.css";
import GlitchText from './GlitchText';

//section button

const FrustratingButton = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clickCount, setClickCount] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
    const [buttonText, setButtonText] = useState("Return to the top");
    
    const handleMouseEnter = () => {
      setIsHovering(true);
      
      if (clickCount < 3 && Math.random() < 0.75) {
        const newX = Math.random() * 80 - 40; 
        const newY = Math.random() * 80 - 40; 
        setPosition({ x: newX, y: newY });
        
        const texts = [
          "Try again",
          "Not here",
          "Almost...",
          "Too slow!",
          "Keep trying",
          "Return to the top"
        ];
        setButtonText(texts[Math.floor(Math.random() * texts.length)]);
      }
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    const handleClick = (e) => {
      setClickCount(prev => prev + 1);
      
      if (clickCount < 2 && Math.random() < 0.5) {
        e.preventDefault();
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 800);
        setButtonText("Try again...");
        return false;
      }
      
      if (clickCount >= 2) {
        e.preventDefault();
        setButtonText("Finally...");
        setIsGlitching(true);
        
        setTimeout(() => {
          window.location.href = "#homepage";
        }, Math.random() * 1500 + 500);
      }
    };
    
    useEffect(() => {
      if (isGlitching) {
        const timer = setTimeout(() => {
          setButtonText("Return to the top");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isGlitching]);
    
    return (
      <div className="frustrating-button-container">
        <a 
          href="#homepage"
          className={`frustrating-button ${isHovering ? 'hovering' : ''} ${isGlitching ? 'glitching' : ''}`}
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px)`,
            transitionDuration: `${Math.random() * 0.3 + 0.1}s`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {buttonText}
        </a>
      </div>
    );
  };

//section canvas 

const FrustrationCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let strokes = [];
    let lightningStrokes = []; 
    let currentStroke = null;
    let intensityLevel = 0;
    let shakeIntensity = 0;
    let explosionPoints = [];
    let pulsating = false;
    let lastLightningTime = 0; 
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 0.5;
        this.color = color || this.getRandomColor();
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.life = 60 + Math.random() * 40;
      }
      
      getRandomColor() {
        const colors = ['#ff0000', '#dd0000', '#ffffff', '#ffff99', '#ff3333'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.life--;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        if (this.size > 0.1) this.size -= 0.05;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Lightning {
      constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX || startX + (Math.random() * 200 - 100);
        this.endY = endY || startY + (Math.random() * 200);
        this.segments = [];
        this.offset = 30; 
        this.lifespan = 10 + Math.random() * 5; 
        this.life = this.lifespan;
        this.numBranches = Math.floor(Math.random() * 3); 
        this.width = 2 + Math.random() * 3; 
        this.color = this.getColor();
        this.generateSegments();
        this.branches = [];
        
        if (Math.random() < 0.7) { 
          this.generateBranches();
        }
      }
      
      getColor() {
        const colors = [
          '#ffffff',
          '#e3f2fd', 
          '#ffff99', 
          '#fff8e1',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      generateSegments() {
        let x = this.startX;
        let y = this.startY;
        this.segments.push({ x, y });
        
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const numSegments = Math.floor(dist / 10);
        
        for (let i = 1; i <= numSegments; i++) {
          const idealX = this.startX + (dx * i) / numSegments;
          const idealY = this.startY + (dy * i) / numSegments;
          
          const offsetFactor = 1 - (i / numSegments) * 0.5; 
          const offsetX = (Math.random() * 2 - 1) * this.offset * offsetFactor;
          const offsetY = (Math.random() * 2 - 1) * this.offset * offsetFactor;
          
          x = idealX + offsetX;
          y = idealY + offsetY;
          
          this.segments.push({ x, y });
        }
      }
      
      generateBranches() {
        for (let i = 0; i < this.numBranches; i++) {
          const segmentIndex = Math.floor(Math.random() * (this.segments.length - 2)) + 1;
          const segment = this.segments[segmentIndex];
          
          const branchLength = Math.random() * 100 + 50;
          const branchAngle = Math.random() * Math.PI - Math.PI / 2; 
          const endX = segment.x + Math.sin(branchAngle) * branchLength;
          const endY = segment.y + Math.cos(branchAngle) * branchLength;
          
          this.branches.push(new Lightning(segment.x, segment.y, endX, endY));
        }
      }
      
      update() {
        this.life--;
        
        for (let i = 0; i < this.branches.length; i++) {
          this.branches[i].update();
        }
        
        if (Math.random() < 0.3 && this.life > 0) {
          const segmentIndex = Math.floor(Math.random() * this.segments.length);
          const segment = this.segments[segmentIndex];
          for (let i = 0; i < 2; i++) {
            particles.push(new Particle(
              segment.x + (Math.random() * 10 - 5),
              segment.y + (Math.random() * 10 - 5),
              '#ffffff'
            ));
          }
        }
        
        return this.life > 0;
      }
      
      draw() {
        if (this.life <= 0) return;
        
        const alpha = this.life / this.lifespan;
        const glow = 10 * alpha; 
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width * alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = glow;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        
        ctx.stroke();
        
        for (let i = 0; i < this.branches.length; i++) {
          this.branches[i].draw();
        }
        
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
    }
    
    class Stroke {
      constructor(x, y, color, type) {
        this.points = [{x, y, width: this.getRandomWidth()}];
        this.color = color || this.getRandomColor();
        this.type = type || 'chaotic';
        this.angle = Math.random() * Math.PI * 2;
        this.complete = false;
        this.maxPoints = Math.floor(Math.random() * 60) + 30;
        this.pressure = Math.random() * 0.7 + 0.3;
        this.widthVariation = Math.random() > 0.5;
      }
      
      getRandomColor() {
        const colors = ['#ff0000', '#dd0000', '#ffffff', '#000000', '#ff2222', '#aa0000'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      getRandomWidth() {
        return Math.random() * 2.5 + 0.8;
      }
      
      addPoint() {
        const lastPoint = this.points[this.points.length - 1];
        let newX, newY;
        
        switch(this.type) {
          case 'chaotic':
            newX = lastPoint.x + (Math.random() * 40 - 20) * (intensityLevel * 0.4 + 1);
            newY = lastPoint.y + (Math.random() * 40 - 20) * (intensityLevel * 0.4 + 1);
            break;
          case 'angular': {
            if (this.points.length % 4 === 0) {
              this.angle = Math.random() * Math.PI * 2;
            }
            const distance = Math.random() * 15 + 5;
            newX = lastPoint.x + Math.cos(this.angle) * distance;
            newY = lastPoint.y + Math.sin(this.angle) * distance;
            break;
          }
          default:
            newX = lastPoint.x + (Math.random() * 40 - 20);
            newY = lastPoint.y + (Math.random() * 40 - 20);
        }
        
        let newWidth;
        if (this.widthVariation) {
          const progress = this.points.length / this.maxPoints;
          if (progress < 0.3) {
            newWidth = lastPoint.width * (1 + Math.random() * 0.2);
          } else if (progress > 0.7) {
            newWidth = lastPoint.width * (0.9 - Math.random() * 0.1);
          } else {
            newWidth = lastPoint.width * (1 + (Math.random() * 0.4 - 0.2));
          }
          
          newWidth = Math.max(0.5, Math.min(4, newWidth));
        } else {
          newWidth = lastPoint.width;
        }
        
        if (newX < 0 || newX > canvas.width) {
          this.createExplosion(lastPoint.x, lastPoint.y);
          newX = Math.max(0, Math.min(canvas.width, newX));
          this.angle = Math.PI - this.angle;
        }
        if (newY < 0 || newY > canvas.height) {
          this.createExplosion(lastPoint.x, lastPoint.y);
          newY = Math.max(0, Math.min(canvas.height, newY));
          this.angle = -this.angle;
        }
        
        this.points.push({x: newX, y: newY, width: newWidth});
        
        if (Math.random() < 0.04 * intensityLevel) {
          this.createExplosion(newX, newY);
        }
        
        if (this.points.length >= this.maxPoints) {
          this.complete = true;
          this.createExplosion(newX, newY);
        }
      }
      
      createExplosion(x, y) {
        const count = Math.floor(Math.random() * 8) + 3;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(x, y));
        }
        
        if (Math.random() < 0.3) {
          explosionPoints.push({
            x, y,
            size: Math.random() * 30 + 10,
            life: 15
          });
          shakeIntensity = Math.min(shakeIntensity + 2, 10);
          
          if (Math.random() < 0.4) {
            createLightning(x, y);
          }
        }
      }
      
      draw() {
        if (this.points.length < 2) return;
        
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 1; i < this.points.length; i++) {
          const p1 = this.points[i-1];
          const p2 = this.points[i];
          
          ctx.beginPath();
          ctx.lineWidth = p1.width;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    const createLightning = (x, y, forced = false) => {
      const endX = x + (Math.random() * 200 - 100);
      const endY = Math.min(canvas.height, y + 100 + Math.random() * 200);
      
      const lightning = new Lightning(x, y, endX, endY);
      lightningStrokes.push(lightning);
      
      flashScreen();
      
      shakeIntensity = Math.min(shakeIntensity + 4, 15);
      
      explosionPoints.push({
        x: endX,
        y: endY,
        size: Math.random() * 50 + 20,
        life: 15
      });
      
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(
          endX + (Math.random() * 20 - 10),
          endY + (Math.random() * 20 - 10),
          '#ffffff'
        ));
      }
      
      if (Math.random() < 0.8 && !forced) {
        setTimeout(() => {
          const newX = endX + (Math.random() * 100 - 50);
          const newY = Math.min(y + 50, canvas.height - 50);
          createLightning(newX, newY);
        }, Math.random() * 200);
      }
      
      lastLightningTime = Date.now();
    };
    
    const flashScreen = () => {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    
    const startFrustration = () => {
      reset();
      intensityLevel = 0;
      pulsating = true;
      animate();
      
      setTimeout(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 3);
        createLightning(x, y, true);
      }, 1000);
      
      const intensityInterval = setInterval(() => {
        intensityLevel += 0.2;
        if (intensityLevel >= 5) {
          clearInterval(intensityInterval);
        }
      }, 1000);
    };
    
    const reset = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particles = [];
      strokes = [];
      lightningStrokes = [];
      currentStroke = null;
      explosionPoints = [];
      intensityLevel = 0;
      shakeIntensity = 0;
      pulsating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.05) {
        ctx.fillStyle = `rgba(30, 30, 30, 0.05)`;
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 3 + 1;
          ctx.fillRect(x, y, size, size);
        }
      }
      
      if (shakeIntensity > 0) {
        const dx = (Math.random() * 2 - 1) * shakeIntensity;
        const dy = (Math.random() * 2 - 1) * shakeIntensity;
        ctx.save();
        ctx.translate(dx, dy);
        shakeIntensity *= 0.92;
      }
      
      if (pulsating) {
        const intensity = Math.sin(Date.now() * 0.005) * 5 + 5;
        ctx.fillStyle = `rgba(30, 0, 0, ${intensity * 0.01})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      const now = Date.now();
      const timeSinceLastLightning = now - lastLightningTime;
      const lightningThreshold = Math.max(5000 - intensityLevel * 700, 1200); 
      
      if (timeSinceLastLightning > lightningThreshold && Math.random() < 0.03 * intensityLevel) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2); 
        createLightning(x, y);
      }
      
      for (let i = explosionPoints.length - 1; i >= 0; i--) {
        const explosion = explosionPoints[i];
        ctx.fillStyle = `rgba(255, 0, 0, ${explosion.life / 20})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 180, 0, ${explosion.life / 30})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        explosion.life--;
        if (explosion.life <= 0) {
          explosionPoints.splice(i, 1);
        }
      }
      
      for (let i = lightningStrokes.length - 1; i >= 0; i--) {
        const isAlive = lightningStrokes[i].update();
        lightningStrokes[i].draw();
        
        if (!isAlive) {
          lightningStrokes.splice(i, 1);
        }
      }
      
      strokes.forEach(stroke => stroke.draw());
      
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      if (currentStroke) {
        currentStroke.addPoint();
        if (currentStroke.complete) {
          strokes.push(currentStroke);
          currentStroke = null;
        }
      }
      
      if (Math.random() < 0.06 * intensityLevel && strokes.length < 20 && !currentStroke) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        let colorChance = Math.random();
        let color;
        if (colorChance < 0.4) {
          color = `rgb(${200 + Math.floor(Math.random() * 55)}, 0, 0)`;
        } else if (colorChance < 0.6) {
          color = '#000000';
        } else if (colorChance < 0.8) {
          color = '#ffffff';
        } else {
          color = `rgb(${100 + Math.floor(Math.random() * 100)}, 0, 0)`;
        }
        
        const type = Math.random() > 0.4 ? 'chaotic' : 'angular';
        currentStroke = new Stroke(x, y, color, type);
      }
      
      if (shakeIntensity > 0) {
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    const handleMouseMove = (e) => {
      if (!pulsating) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (Math.random() < 0.1 * intensityLevel) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(x, y));
        }
      }
    };
    
    const handleClick = (e) => {
      if (!pulsating) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      createLightning(x, y, true);
      
      let colorChance = Math.random();
      let color;
      if (colorChance < 0.3) {
        color = '#ff0000';
      } else if (colorChance < 0.5) {
        color = '#000000';
      } else if (colorChance < 0.7) {
        color = '#ffffff';
      } else {
        color = '#aa0000';
      }
      
      const type = Math.random() > 0.4 ? 'chaotic' : 'angular';
      strokes.push(new Stroke(x, y, color, type));
      
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y));
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    if (isActive) {
      startFrustration();
    }
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }
    
    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="frustration-canvas"
    />
  );
};

const Frustration = () => {
  return (
    <section className="frustration" id="frustration">
      <FrustrationCanvas />
      <div className="content">
        <GlitchText baseIntensity={0.6} hoverIntensity={1} enableHover>
          Frustration.
        </GlitchText>
        <FrustratingButton />
      </div>
    </section>
  );
};

export default Frustration;

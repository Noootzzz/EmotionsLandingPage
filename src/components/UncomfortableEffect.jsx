import React, { useEffect, useRef } from "react";
import "../css/uncomfortable.css";


const UncomfortableEffects = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Générer une texture étrange et sombre pour le fond
        const generateBackground = () => {
            for (let i = 0; i < 500; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 5;
                ctx.fillStyle = `rgba(${50 + Math.random() * 50}, ${50 + Math.random() * 50}, ${50 + Math.random() * 50}, ${Math.random() * 0.3 + 0.2})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Liste des yeux avec positions et caractéristiques fixes
        const fixedEyes = [
            { x: 150, y: 100, size: 30, color: "white", irisColor: "darkred" },
            { x: 350, y: 250, size: 40, color: "white", irisColor: "gray" },
            { x: 550, y: 450, size: 50, color: "white", irisColor: "dimgray" },
            { x: 750, y: 150, size: 25, color: "white", irisColor: "maroon" },
            { x: 950, y: 350, size: 60, color: "white", irisColor: "lightcoral" },
            { x: 1150, y: 550, size: 35, color: "white", irisColor: "lightgray" },
            { x: 300, y: 600, size: 45, color: "white", irisColor: "crimson" },
            { x: 800, y: 500, size: 55, color: "white", irisColor: "darkgray" },
            { x: 1000, y: 200, size: 50, color: "white", irisColor: "firebrick" },
            { x: 400, y: 300, size: 30, color: "white", irisColor: "brown" }
        ];

        // Gérer le suivi des pupilles en fonction du mouvement de la souris
        const handleMouseMove = (event) => {
            fixedEyes.forEach(eye => {
                const dx = event.clientX - eye.x;
                const dy = event.clientY - eye.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxPupilOffset = eye.size / 3;
                
                eye.pupilX = eye.x + (dx / distance) * maxPupilOffset;
                eye.pupilY = eye.y + (dy / distance) * maxPupilOffset;
            });
        };

        document.addEventListener("mousemove", handleMouseMove);

        // Fonction d'animation pour redessiner les yeux et le fond
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            generateBackground();
            
            fixedEyes.forEach(eye => {
                // Dessiner l'œil
                ctx.beginPath();
                ctx.arc(eye.x, eye.y, eye.size, 0, Math.PI * 2);
                ctx.fillStyle = eye.color;
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Dessiner l'iris
                ctx.beginPath();
                ctx.arc(eye.pupilX || eye.x, eye.pupilY || eye.y, eye.size / 2.5, 0, Math.PI * 2);
                ctx.fillStyle = eye.irisColor;
                ctx.fill();
                ctx.stroke();
                
                // Dessiner la pupille
                ctx.beginPath();
                ctx.arc(eye.pupilX || eye.x, eye.pupilY || eye.y, eye.size / 5, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        animate();

        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return <canvas ref={canvasRef} className="scary-canvas"></canvas>;
};

export default UncomfortableEffects;

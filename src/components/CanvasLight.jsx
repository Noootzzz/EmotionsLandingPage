import React, { useRef, useEffect } from "react";
import backgroundImage from "../../public/img/uncomfbg.png";
import GlitchText from "./GlitchText";


const CanvasLightEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let flicker = 1;  // Valeur initiale de la lumière
        let flickerTime = 0;  // Temps avant chaque changement de clignotement
        let noise = 0;  // Valeur pour simuler le bruit (grésillement)
        let flickerSpeed = 50; // Fréquence du changement (plus bas = plus rapide)
        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // FOND SOMBRE
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Contrôle du grésillement de la lumière
            flickerTime -= 1;
            if (flickerTime <= 0) {
                // Changer l'intensité de manière erratique pour créer un clignotement rapide
                flicker = Math.random() > 0.5 ? 1 : 0;  // Lumière allumée ou éteinte de manière rapide
                noise = Math.random() * 0.5 - 0.25;  // Bruit pour ajouter des variations erratiques
                flickerTime = Math.random() * flickerSpeed;  // Réinitialiser la fréquence du changement
            }

            // Dessiner une seule lumière qui couvre tout le canvas avec effet de clignotement rapide
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `rgba(0, 0, 0, ${flicker + noise})`);  //Couleur lumière clignotante
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");  // Dégradé vers le bas (transparent)

            // Remplir tout le canvas avec le dégradé
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <section 
            className="canvas-light-effect"
            id="uncomfortable" 
            style={{
                position: "relative", 
                width: "100vw", 
                height: "110vh", 
                zIndex: 100,
                boxShadow: "0 0 100px 100px rgba(0, 0, 0)"
            }}
        >
            <img 
                src={backgroundImage} 
                alt="Terrifying Background" 
                style={{
                    position: "absolute", 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    filter: "brightness(0.4)"
                }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0,height: "110vh" }}></canvas>
            <h1 style={{position: "relative", zIndex: 110, color: "white", height: "110vh", display: "flex", justifyContent: "center", alignItems: "center", opacity: 0.3}}>
                <GlitchText
                    baseIntensity={0.1}
                >
                    Uncomfortable.
                </GlitchText>
            </h1>
        </section>
    );
};

export default CanvasLightEffect;

import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../../public/img/uncomfbg.png";
import GlitchText from "./GlitchText";
import uncomfortableAudio from "../../public/audio/uncomfortable.mp3"; 
import UncomfortableEffects from "./UncomfortableEffect";

const CanvasLightEffect = () => {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const audioRef = useRef(null);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [audioError, setAudioError] = useState(null);
    const [scrollDarkness, setScrollDarkness] = useState(0);

    useEffect(() => {
        const testAudio = new Audio(uncomfortableAudio);
        
        testAudio.addEventListener('canplaythrough', () => {
            setAudioLoaded(true);
        });
        
        testAudio.addEventListener('error', (e) => {
            console.error("Erreur audio:", e);
            setAudioError(`Erreur: ${e.type}`);
        });
        
        testAudio.load();
        
        return () => {
            testAudio.pause();
            testAudio.src = "";
        };
    }, []);

    useEffect(() => {
        let isCurrentlyVisible = false;
        
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const sectionHeight = rect.height;
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                

                const viewportHeight = window.innerHeight;
                const scrollPosition = -rect.top;
                const maxScroll = sectionHeight - viewportHeight;
                const scrollRatio = Math.max(0, Math.min(1, scrollPosition / maxScroll));
                
                setScrollDarkness(scrollRatio);
                
                if (isVisible !== isCurrentlyVisible) {
                    isCurrentlyVisible = isVisible;
                    
                    if (!isVisible && musicPlaying && audioRef.current) {
                        audioRef.current.pause();
                        setMusicPlaying(false);
                    }
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [musicPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.1;
        }
    }, []);

    const startMusic = () => {
        if (!audioRef.current) return;
        
        audioRef.current.load();
        audioRef.current.volume = 0.1;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("Audio démarré avec succès");
                    setMusicPlaying(true);
                })
                .catch(error => {
                    console.error("Erreur de lecture audio", error);
                    setAudioError(`Erreur de lecture: ${error.message}`);
                    
                    try {
                        audioRef.current.muted = false;
                        audioRef.current.volume = 0.1;
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                        setMusicPlaying(true);
                    } catch (fallbackError) {
                        console.error("Tentative de récupération échouée:", fallbackError);
                    }
                });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let flicker = 1;
        let flickerTime = 0;
        let noise = 0;
        let flickerSpeed = 50;
        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            flickerTime -= 1;
            if (flickerTime <= 0) {
                flicker = Math.random() > 0.5 ? 1 : 0;
                noise = Math.random() * 0.5 - 0.25;
                flickerTime = Math.random() * flickerSpeed;
            }

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `rgba(0, 0, 0, ${flicker + noise})`);
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    const imageBrightness = Math.max(0.1, 0.4 - (scrollDarkness * 0.4)); 
    const textOpacity = Math.max(0.1, 0.3 - (scrollDarkness * 0.2)); 

    return (
        <section 
            className="canvas-light-effect"
            id="uncomfortable" 
            ref={sectionRef}
            style={{
                position: "relative", 
                width: "100vw", 
                height: "110vh", 
                zIndex: 100,
                boxShadow: "0 0 100px 100px rgba(0, 0, 0)"
            }}
        >
            <audio 
                ref={audioRef} 
                src={uncomfortableAudio} 
                preload="auto"
                style={{ display: 'none' }}
                loop
            />
            
            <button 
                onClick={startMusic}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    padding: '10px 15px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    opacity: musicPlaying ? 0.6 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            >
                {musicPlaying ? "Musique en cours" : "Lancer la musique"}
            </button>

            <img 
                src={backgroundImage} 
                alt="Terrifying Background" 
                style={{
                    position: "absolute", 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    filter: `brightness(${imageBrightness})`,
                    transition: "filter 0.3s ease-out"
                }}
            />
            
            {/* Overlay pour rendre la section encore plus sombre au fur et à mesure du scroll */}
            <div 
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: scrollDarkness * 0.6, 
                    zIndex: 105,
                    transition: "opacity 0.3s ease-out"
                }}
            />
            
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, height: "110vh" }}></canvas>
            
            <h1 style={{
                position: "relative", 
                zIndex: 110, 
                color: "white", 
                height: "110vh", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                opacity: textOpacity,
                transition: "opacity 0.3s ease-out"
            }}>
                <GlitchText
                    baseIntensity={0.1 + (scrollDarkness * 0.1)} 
                >
                    Uncomfortable.
                </GlitchText>
            </h1>

            <UncomfortableEffects />
        </section>
    );
};

export default CanvasLightEffect;

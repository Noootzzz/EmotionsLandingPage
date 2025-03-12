import "../css/nostalgia.css";
import GlitchText from './GlitchText';
import React, { useEffect, useState, useRef } from "react";
import nostalgiaJpeg from '../../public/img/nostalgia.jpeg';
import nostalgiaNoBackground from '../../public/img/nostalgianobg.png';
import eyeBackground from '../../public/img/eyebg.png';
import nostalgiaMusic from '../../public/audio/nostalgia.mp3'; 

const Nostalgia = () => {
    const hoverIntensity = 0.2;
    const enableHover = true;
    const sectionRef = useRef(null);
    const audioRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [audioError, setAudioError] = useState(null);
    
    useEffect(() => {
        const testAudio = new Audio(nostalgiaMusic);
        
        testAudio.addEventListener('canplaythrough', () => {
            setAudioLoaded(true);
        });
        
        testAudio.addEventListener('error', (e) => {
            console.error("Erreur:", e);
            setAudioError(`Erreur: ${e.type}`);
        });
        
        testAudio.load();
        
        return () => {
            testAudio.pause();
            testAudio.src = "";
        };
    }, []);
    
    useEffect(() => {
        const scrollLength = 8;
        let isCurrentlyVisible = false;
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            const progress = Math.min(1, Math.max(0, scrollY / (windowHeight * scrollLength)));
            setScrollPosition(progress);
            
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const isVisible = rect.top < windowHeight && rect.bottom >= 0;
                
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
        
        
        audioRef.current.load();
        
        audioRef.current.volume = 0.1;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("C'est bon!!!!");
                    setMusicPlaying(true);
                })
                .catch(error => {
                    console.error("nop", error);
                    setAudioError(`pas bon ${error.message}`);
                    
                    try {
                        audioRef.current.muted = false;
                        audioRef.current.volume = 0.3;
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                        setMusicPlaying(true);
                    } catch (fallbackError) {
                        console.error("non non :", fallbackError);
                    }
                });
        } else {
            console.log("ancien navigateur?");
        }
    };
   
    const backgroundTransform = `translateY(${scrollPosition * 5}vh)`;
    const foregroundTransform = `translateY(${scrollPosition * 5}vh)`;
    const newBackgroundTransform = `translateY(${200 - (scrollPosition * 200)}vh)`;
   
    const darkenThreshold = 0.7;
    const darkenIntensity = scrollPosition > darkenThreshold
        ? (scrollPosition - darkenThreshold) / (1 - darkenThreshold)
        : 0;
   
    const foregroundBrightness = Math.max(0.3, 1 - darkenIntensity);
   
    return (
        <section className="nostalgia" id="nostalgia" ref={sectionRef}>
            <audio 
                ref={audioRef} 
                src={nostalgiaMusic} 
                preload="auto"
                style={{
                    position: 'absolute',
                    display: 'none',
                    top: '120px',
                    right: '20px',
                    zIndex: 100,
                    width: '250px'
                }}
                loop
            />
            
            <button 
                onClick={startMusic}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 100,
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
            
            <div className="nostalgia-layer nostalgia-background-layer">
                <img
                    src={nostalgiaJpeg}
                    alt="Nostalgia background"
                    style={{ transform: backgroundTransform, opacity: 1 - scrollPosition * 0.3}}
                />
            </div>
           
            <div className="nostalgia-layer nostalgia-newbg-layer">
                <img
                    src={eyeBackground}
                    alt="Eye background"
                    style={{ transform: newBackgroundTransform }}
                    className="eye"
                />
            </div>
           
            <div className="nostalgia-layer nostalgia-foreground-layer">
                <img
                    src={nostalgiaNoBackground}
                    alt="Nostalgia foreground"
                    style={{
                        transform: foregroundTransform,
                        filter: `brightness(${foregroundBrightness})`,
                        transition: 'transform 0.1s ease-out, filter 0.1s ease-out'
                    }}
                />
            </div>
           
            <div className="nostalgia-content">    
                <div className="nostalgia-title">
                <h1 style={{ opacity: 1 - scrollPosition * 0.9 }}>
                    <GlitchText
                        baseIntensity={0.1}
                        hoverIntensity={hoverIntensity}
                        enableHover={enableHover}
                        >
                        Nostalgia.
                    </GlitchText>
                    </h1>
                </div>  
            </div>
        </section>
    );
};

export default Nostalgia;
import "../css/nostalgia.css";
import GlitchText from './glitchtext';
import React, { useEffect, useState, useRef } from "react";
import nostalgiaJpeg from '../../public/img/nostalgia.jpeg';
import nostalgiaNoBackground from '../../public/img/nostalgianobg.png';
import eyeBackground from '../../public/img/eyebg.png';

const Nostalgia = () => {
    const hoverIntensity = 0.2;
    const enableHover = true;
    const sectionRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    useEffect(() => {
        const scrollLength = 8; 
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            const progress = Math.min(1, Math.max(0, scrollY / (windowHeight * scrollLength)));
            
            setScrollPosition(progress);
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const backgroundTransform = `translateY(0)`;
    const foregroundTransform = `translateY(0)`;
    const newBackgroundTransform = `translateY(${200 - (scrollPosition * 200)}vh)`;
    
    return (
        <section className="nostalgia" id="nostalgia" ref={sectionRef}>
            <div className="nostalgia-layer nostalgia-background-layer">
                <img 
                    src={nostalgiaJpeg} 
                    alt="Nostalgia background" 
                    style={{ transform: backgroundTransform }}
                />
            </div>
            
            <div className="nostalgia-layer nostalgia-newbg-layer">
                <img 
                    src={eyeBackground} 
                    alt="Eye background" 
                    style={{ transform: newBackgroundTransform }}
                />
            </div>
            
            <div className="nostalgia-layer nostalgia-foreground-layer">
                <img 
                    src={nostalgiaNoBackground} 
                    alt="Nostalgia foreground" 
                    style={{ transform: foregroundTransform }}
                />
            </div>
            
            <div className="nostalgia-content">    
                <div className="nostalgia-title">
                    <h1 style={{ opacity: 1 - scrollPosition }}>
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
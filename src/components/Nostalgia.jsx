import "../css/nostalgia.css";
import GlitchText from './GlitchText';
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

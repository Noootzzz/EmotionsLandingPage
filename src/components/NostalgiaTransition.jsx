import React, { useEffect, useRef } from 'react';
import '../css/nostalgiaTransition.css';

const NostalgiaTransition = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const container = containerRef.current;
        
        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const sectionTop = -rect.top; 
            const sectionHeight = section.offsetHeight - window.innerHeight;
            
            const relativePosition = Math.min(Math.max(sectionTop / sectionHeight, 0), 1);
            
            if (relativePosition < 0.5) {
                const opacity = relativePosition * 2; 
                container.style.setProperty('--terre-opacity', '1');
                container.style.setProperty('--inter-opacity', opacity);
                container.style.setProperty('--transition-progress', relativePosition);
            } 
            else {
                const opacity = 2 - relativePosition * 2; 
                container.style.setProperty('--terre-opacity', opacity);
                container.style.setProperty('--inter-opacity', '1');
                container.style.setProperty('--transition-progress', relativePosition);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="nost-transition" ref={sectionRef}>
            <div className="nost-transition-container" ref={containerRef}>
                <div className="nost-transition-img terre-container">
                    <img className="terre" src="/img/terre.png" alt="sous terrain" />
                </div>
                <div className="nost-transition-img inter-container">
                    <img className="inter" src="/img/interogation.png" alt="????" />
                </div>
                <div className="transition-overlay"></div>
            </div>
        </section>
    );
};

export default NostalgiaTransition;
